import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

/**
 * User provider
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users"));
        return storedUsers || [];
    });

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    return (
        <UserContext.Provider value={{ users, setUsers }}>
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
