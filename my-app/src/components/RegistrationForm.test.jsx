import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";

/**
 * Mock localStorage.setItem
 */
beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
});

describe("RegistrationForm Integration", () => {

    /**
     * Vérification du rendu du formulaire
     */
    test("renders form", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    /**
     * Vérification de l'affichage des erreurs de validation
     */
    test("shows validation errors", () => {
        render(<RegistrationForm />);

        // simulation sans changement de valeur
        fireEvent.submit(screen.getByTestId("form"));
        // Les messages d’erreur provenant du validator contiennent "must".
        expect(screen.getAllByText(/must/i).length).toBeGreaterThan(0);
    });

    /**
     * Vérification de la soumission valide + sauvegarde
     */
    test("submits valid form and saves to localStorage", () => {
        render(<RegistrationForm />);

        // Simulation de la saisie des champs texte
        fireEvent.change(screen.getByPlaceholderText("Firstname"), {
            target: { value: "Jean" },
        });

        fireEvent.change(screen.getByPlaceholderText("Lastname"), {
            target: { value: "Dupont" },
        });

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "email@email.fr" },
        });

        fireEvent.change(screen.getByPlaceholderText("Postal Code"), {
            target: { value: "13002" },
        });

        fireEvent.change(screen.getByPlaceholderText("City"), {
            target: { value: "Paris" },
        });

        // Création d'une date valide (> 18 ans)
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);

        // Simulation de la saisie de la date de naissance
        fireEvent.change(
            screen.getByTestId("birth"),
            { target: { value: birth.toISOString().split("T")[0] } }
        );

        fireEvent.submit(screen.getByTestId("form"));

        // Vérifie que localStorage.setItem a été appelé
        // avec la clé "user" et une valeur de type string (JSON.stringify)
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "user",
            expect.any(String)
        );
    });

});
