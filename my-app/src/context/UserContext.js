import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/users")
            .then(({ data }) => setUsers(data))
            .catch(err => {
                console.error("Erreur backend:", err);
                setUsers([]);
            });
    }, []);

    const addUser = async (user) => {
        try {
            const alreadyExists = users.some((u) => u.email === user.email);
            if (alreadyExists) {
                return {
                    success: false,
                    error: { message: "Cet email est déjà utilisé" },
                };
            }
            const response = await axios.post("http://localhost:8000/users", user);
            if (response.status === 201) {
                setUsers(prev => [...prev, response.data]);
                return { success: true };
            }
            return { success: false, error: { message: "Erreur serveur" } };
        } catch (err) {
            if (err.response?.status === 500) throw err;
            return { success: false, error: { message: "Erreur serveur" } };
        }
    };

    return (
        <UserContext.Provider value={{ users, addUser }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUsers = () => useContext(UserContext);
