import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from "axios";

const UserContext = createContext();

/**
 * User provider
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(([]));

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err))
    }, []);

    const addUser = async (user) => {
        try {
            const response = await axios.post(
                'https://jsonplaceholder.typicode.com/users',
                user
            );
            // On met à jour le state avec ce que le serveur retourne
            setUsers(prev => [...prev, response.data]);
        } catch (err) {
            console.error("Erreur lors de l'ajout :", err);
        }
    };

    return (
        <UserContext.Provider value={{ users, addUser }}>
            {children}
        </UserContext.Provider>
    );
};


/**
 * Context error
 * @returns {unknown}
 */
export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUsers doit être utilisé à l'intérieur de UserProvider");
    }
    return context;
};
