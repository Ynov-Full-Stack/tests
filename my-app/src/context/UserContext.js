import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8000`;

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then(({ data }) => setUsers(data))
      .catch((err) => {
        console.error("Erreur backend:", err);
        setUsers([]);
      });
  }, []);

  const addUser = async (user) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, user);

      if (response.status === 201) {
        setUsers((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }

      return { success: false, error: { message: "Erreur serveur" } };
    } catch (err) {
      if (err.response?.status === 500) throw err;

      return {
        success: false,
        error: {
          message: err.response?.data?.detail || "Erreur serveur",
        },
      };
    }
  };

  return <UserContext.Provider value={{ users, addUser }}>{children}</UserContext.Provider>;
};
export const useUsers = () => useContext(UserContext);
