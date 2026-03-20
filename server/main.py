from __future__ import annotations

import os
import re
from dotenv import load_dotenv
import mysql.connector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

load_dotenv()

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
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM utilisateur WHERE email = %s", (user.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    query = """
            INSERT INTO utilisateur (username, name, email, city, postal_code)
            VALUES (%s, %s, %s, %s, %s) \
            """

    values = (user.username, user.name, user.email, user.city, user.postalCode)
    cursor.execute(query, values)
    conn.commit()

    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

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