import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Homepage from "./Homepage";

// Mock du hook useUsers
jest.mock("../context/UserContext", () => ({
    useUsers: jest.fn(),
}));

import { useUsers } from "../context/UserContext";

describe("Homepage", () => {

    test("affiche 0 utilisateur quand la liste est vide", () => {
        useUsers.mockReturnValue({ users: [] });

        render(<Homepage />);

        expect(screen.getByText(/Bienvenue sur la page d'accueil/i)).toBeInTheDocument();
        expect(screen.getByText("0 utilisateur inscrit.")).toBeInTheDocument();
    });

    test("affiche 1 utilisateur (singulier)", () => {
        useUsers.mockReturnValue({
            users: [
                {
                    firstname: "Jean",
                    lastname: "Dupont",
                    email: "jean@email.fr",
                    birth: "2000-01-01",
                    city: "Paris",
                    postalCode: "75000",
                },
            ],
        });

        render(<Homepage />);

        expect(screen.getByText("1 utilisateur inscrit")).toBeInTheDocument();
        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
        expect(screen.getByText(/jean@email.fr/i)).toBeInTheDocument();
        expect(screen.getByText(/Paris/i)).toBeInTheDocument();
        expect(screen.getByText(/75000/i)).toBeInTheDocument();
    });

    test("affiche plusieurs utilisateurs (pluriel)", () => {
        useUsers.mockReturnValue({
            users: [
                {
                    firstname: "Jean",
                    lastname: "Dupont",
                    email: "jean@email.fr",
                    birth: "2000-01-01",
                    city: "Paris",
                    postalCode: "75000",
                },
                {
                    firstname: "Marie",
                    lastname: "Martin",
                    email: "marie@email.fr",
                    birth: "1995-05-05",
                    city: "Lyon",
                    postalCode: "69000",
                },
            ],
        });

        render(<Homepage />);

        expect(screen.getByText("2 utilisateurs inscrits")).toBeInTheDocument();
        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
        expect(screen.getByText("Marie Martin")).toBeInTheDocument();
    });

});
