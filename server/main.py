from __future__ import annotations

import os
import re
import logging

from dotenv import load_dotenv
from fastapi import Request
import mysql.connector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server")

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_conn():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=3306,
    )

class Address(BaseModel):
    city: str
    zipcode: str

class UserCreate(BaseModel):
    username: str
    name: str
    email: str
    address: Address

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Email invalide")
        return v

@app.get("/users")
def get_users():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM utilisateur")
    records = cursor.fetchall()
    return records

@app.post("/users", status_code=201)
def create_user(user: UserCreate):
    logger.info("POST /users reçu avec les données : %s", user.dict())

    conn = get_conn()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM utilisateur WHERE email = %s", (user.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        logger.warning("Tentative de création avec email déjà utilisé : %s", user.email)
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    query = """
            INSERT INTO utilisateur (username, name, email, city, postal_code)
            VALUES (%s, %s, %s, %s, %s)
            """
    values = (user.username, user.name, user.email, user.address.city, user.address.zipcode)
    cursor.execute(query, values)
    conn.commit()

    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    logger.info("Utilisateur créé avec succès, id=%d", new_id)

    return {
        "id": new_id,
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "address": {
            "city": user.address.city,
            "zipcode": user.address.zipcode
        }
    }
@app.delete("/testing/reset")
def reset_db():
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM utilisateur")
    conn.commit()

    cursor.close()
    conn.close()

    return {"status": "reset"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("Requête reçue: %s %s", request.method, request.url.path)
    response = await call_next(request)
    logger.info("Réponse pour %s %s : %d", request.method, request.url.path, response.status_code)
    return response