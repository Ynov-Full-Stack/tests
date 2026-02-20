import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then(({ data }) => setUsers(data))
            .catch(err => {
                console.error("Erreur JSONPlaceholder:", err);
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
            const response = await axios.post("https://jsonplaceholder.typicode.com/users", user);
            if (response.status === 201) {
                const newUser = { ...user, id: Date.now() };
                setUsers(prev => [...prev, newUser]);
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
