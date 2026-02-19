import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserProvider } from "../context/UserContext";
import RegistrationForm from "./RegistrationForm";
import "@testing-library/jest-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockedNavigate,
}));

const renderWithProviders = (ui) => render(<UserProvider>{ui}</UserProvider>);

beforeEach(() => {
    const localStorageMock = {
        setItem: jest.fn(),
        getItem: jest.fn(() => null),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("RegistrationForm Integration", () => {
    test("renders form", () => {
        renderWithProviders(<RegistrationForm />);
        expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    test("submit button is disabled when form is invalid", () => {
        renderWithProviders(<RegistrationForm />);
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    test("submit button is enabled when form is valid", () => {
        renderWithProviders(<RegistrationForm />);

        // Remplir tous les champs avec des valeurs valides
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });

        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });

        expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
    });

    test("shows validation errors on submit with empty form", () => {
        renderWithProviders(<RegistrationForm />);
        fireEvent.submit(screen.getByTestId("form"));

        // Les validateurs renvoient des messages contenant "must"
        expect(screen.getAllByText(/must/i)).toHaveLength(6);
    });

    test("submits valid form and shows success message", () => {
        renderWithProviders(<RegistrationForm />);

        // Remplir le formulaire avec des données valides
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });

        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });

        // Soumettre
        fireEvent.submit(screen.getByTestId("form"));

        // Vérifier que setUsers a été appelé (mocké par UserProvider)
        expect(screen.getByText(/user saved successfully/i)).toBeInTheDocument();
    });

    test("triggers all validation cases via individual field validation", () => {
        renderWithProviders(<RegistrationForm />);

        // Test firstname invalide
        const firstname = screen.getByPlaceholderText("Firstname");
        fireEvent.change(firstname, { target: { value: "" } });
        fireEvent.blur(firstname);

        // Test email invalide
        const email = screen.getByPlaceholderText("Email");
        fireEvent.change(email, { target: { value: "invalid" } });
        fireEvent.blur(email);

        // Test postalCode invalide
        const postalCode = screen.getByPlaceholderText("PostalCode");
        fireEvent.change(postalCode, { target: { value: "ABC" } });
        fireEvent.blur(postalCode);

        // Test birth trop jeune
        const birthInput = screen.getByTestId("birth");
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 17);
        fireEvent.change(birthInput, { target: { value: minorDate.toISOString().split("T")[0] } });
        fireEvent.blur(birthInput);

        // City valide (ne génère pas d'erreur)
        const city = screen.getByPlaceholderText("City");
        fireEvent.change(city, { target: { value: "Paris" } });
        fireEvent.blur(city);

        // 4 erreurs attendues : firstname, email, postalCode, birth
        expect(screen.getAllByText(/must/i)).toHaveLength(4);
    });

    // Test de la branche catch dans isFormValid()
    test("isFormValid handles validation errors correctly", () => {
        renderWithProviders(<RegistrationForm />);

        // Remplir avec une date invalide → catch dans isFormValid()
        const birthInput = screen.getByTestId("birth");
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        fireEvent.change(birthInput, { target: { value: futureDate.toISOString().split("T")[0] } });

        // Vérifie que le bouton reste disabled (catch retourne false)
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    //  Test du reset complet après succès
    test("form resets completely after successful submission", () => {
        renderWithProviders(<RegistrationForm />);

        // Remplir formulaire valide
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });

        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });

        fireEvent.submit(screen.getByTestId("form"));

        // Vérifie que TOUS les champs sont vidés après reset
        expect(screen.getByPlaceholderText("Firstname")).toHaveValue("");
        expect(screen.getByPlaceholderText("Lastname")).toHaveValue("");
        expect(screen.getByPlaceholderText("Email")).toHaveValue("");
        expect(screen.getByTestId("birth")).toHaveValue("");
        expect(screen.getByPlaceholderText("City")).toHaveValue("");
        expect(screen.getByPlaceholderText("PostalCode")).toHaveValue("");

        // Bouton disabled après reset
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    // Test navigation après succès (setTimeout)
    test("navigates after successful submission", async () => {
        jest.useFakeTimers();
        renderWithProviders(<RegistrationForm />);

        // Remplir et soumettre (version courte)
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });

        fireEvent.submit(screen.getByTestId("form"));

        // Avancer le timer de 2s
        jest.advanceTimersByTime(2000);

        // Vérifie que navigate a été appelé
        expect(mockedNavigate).toHaveBeenCalledWith("/tests");

        jest.useRealTimers();
    });

    test("isFormValid catches validation errors and keeps button disabled", () => {
        renderWithProviders(<RegistrationForm />);

        // Remplir TOUS les champs sauf birth invalide
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });

        // Date future → calculateAge() lève une erreur → catch ligne 71
        const futureBirth = new Date();
        futureBirth.setFullYear(futureBirth.getFullYear() + 1);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: futureBirth.toISOString().split("T")[0] } });

        // Bouton reste disabled (catch retourne false)
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    test("executes navigation after successful submission timeout", () => {
        jest.useFakeTimers(); // IMPORTANT

        renderWithProviders(<RegistrationForm />);

        // Formulaire valide complet
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });

        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });

        fireEvent.submit(screen.getByTestId("form"));

        jest.advanceTimersByTime(2000);
        expect(mockedNavigate).toHaveBeenCalledWith("/tests");

        jest.useRealTimers();
    });


});
