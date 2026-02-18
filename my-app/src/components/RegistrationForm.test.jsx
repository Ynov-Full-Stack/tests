import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";
import '@testing-library/jest-dom';


/**
 * Mock localStorage
 */
beforeEach(() => {
    const localStorageMock = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
    });
});

/**
 * Clear du mock après le test
 */
afterEach(() => {
    jest.clearAllMocks();
});


describe("RegistrationForm Integration", () => {
    // Vérification du rendu du formulaire
    test("renders form", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("form")).toBeInTheDocument();
    });
    // Vérification du bouton disable en premier lieu
    test("submit button is disabled when form is invalid", () => {
        render(<RegistrationForm />);
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    // Vérification du bouton valid lorsque formulaire rempli
    test("submit button is enabled when form is valid", () => {
        render(<RegistrationForm />);
        // Remplir TOUS les champs
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("Postal Code"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });
        expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
    });

    // Vérification de l'affichage des erreurs lorsque formulaire invalide
    test("shows validation errors on submit with empty form", () => {
        render(<RegistrationForm />);
        fireEvent.submit(screen.getByTestId("form"));
        expect(screen.getAllByText(/must/i)).toHaveLength(4);
    });

    // Vérification de l'enregistrement du formulaire dans localStorage'
    test("submits valid form and shows success message", () => {
        render(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "Jean" } });
        fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Dupont" } });
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@email.fr" } });
        fireEvent.change(screen.getByPlaceholderText("Postal Code"), { target: { value: "13002" } });
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } });
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), { target: { value: birth.toISOString().split("T")[0] } });
        fireEvent.submit(screen.getByTestId("form"));
        expect(localStorage.setItem).toHaveBeenCalledWith("user", expect.any(String));
        expect(screen.getByText(/user saved successfully/i)).toBeInTheDocument();
    });

    // Vérification de la validation des champs individuels
    test("triggers all validation cases via individual field validation", () => {
        render(<RegistrationForm />);

        // 1. case "firstname"/"lastname"
        const firstname = screen.getByPlaceholderText("Firstname");
        fireEvent.change(firstname, { target: { value: "" } });
        fireEvent.blur(firstname);

        // 2. case "email"
        const email = screen.getByPlaceholderText("Email");
        fireEvent.change(email, { target: { value: "invalid" } });
        fireEvent.blur(email);

        // 3. case "postalCode"
        const postalCode = screen.getByPlaceholderText("Postal Code");
        fireEvent.change(postalCode, { target: { value: "ABC" } });
        fireEvent.blur(postalCode);

        // 4. case "birth"
        const birthInput = screen.getByTestId("birth");
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 17);
        fireEvent.change(birthInput, { target: { value: minorDate.toISOString().split("T")[0] } });
        fireEvent.blur(birthInput);

        // 5. default: - city
        const city = screen.getByPlaceholderText("City");
        fireEvent.change(city, { target: { value: "Paris" } });
        fireEvent.blur(city);

        // Vérification : tous les cases sont exécutés
        expect(screen.getAllByText(/must/i)).toHaveLength(4);
    });

});
