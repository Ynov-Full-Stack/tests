import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Homepage from "./Homepage";
import { useUsers } from "../context/UserContext";

jest.mock("../context/UserContext", () => ({
    useUsers: jest.fn(),
}));

describe("Homepage", () => {
    test("affiche 0 utilisateur quand la liste est vide", () => {
        useUsers.mockReturnValue({ users: [] });
        render(<Homepage />);
        expect(screen.getByText(/Bienvenue sur la page d'accueil/i)).toBeInTheDocument();
        expect(screen.getByText("0 utilisateur inscrit.")).toBeInTheDocument();
    });

    test("affiche 1 utilisateur (singulier)", () => {
        useUsers.mockReturnValue({
            users: [{
                name: "Jean",
                username: "Jean Dupont",
                email: "jean@email.fr",
                address: { city: "Paris", zipcode: "75000" }
            }],
        });
        render(<Homepage />);
        expect(screen.getByText("1 utilisateur inscrit")).toBeInTheDocument();
        expect(screen.getByText("Jean Dupont")).toBeInTheDocument();
    });

    test("affiche plusieurs utilisateurs (pluriel)", () => {
        useUsers.mockReturnValue({
            users: [
                { name: "Jean", username: "Jean Dupont", email: "jean@email.fr", address: { city: "Paris", zipcode: "75000" } },
                { name: "Marie", username: "Martin", email: "marie@email.fr", address: { city: "Paris", zipcode: "75000" } },
            ],
        });
        render(<Homepage />);
        expect(screen.getByText("2 utilisateurs inscrits")).toBeInTheDocument();
    });
});
