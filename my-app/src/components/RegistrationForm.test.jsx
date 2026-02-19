import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {UserProvider} from "../context/UserContext";
import RegistrationForm from "./RegistrationForm";
import "@testing-library/jest-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockedNavigate,
}));

const renderWithProviders = (ui) => render(<UserProvider>{ui}</UserProvider>);
/**
 * Mock localStorage
 */
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

/**
 * Clear du mock après le test
 */
afterEach(() => {
    jest.clearAllMocks();
});

describe("RegistrationForm Integration", () => {
    test("renders form", () => {
        renderWithProviders(<RegistrationForm/>);
        expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    test("submit button is disabled when form is invalid", () => {
        renderWithProviders(<RegistrationForm/>);
        expect(screen.getByRole("button", {name: /submit/i})).toBeDisabled();
    });

    test("submit button is enabled when form is valid", () => {
        renderWithProviders(<RegistrationForm/>);
        fireEvent.change(screen.getByPlaceholderText("Firstname"), {target: {value: "Jean"}});
        fireEvent.change(screen.getByPlaceholderText("Lastname"), {target: {value: "Dupont"}});
        fireEvent.change(screen.getByPlaceholderText("Email"), {target: {value: "test@email.fr"}});
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), {target: {value: "13002"}});
        fireEvent.change(screen.getByPlaceholderText("City"), {target: {value: "Paris"}});
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), {target: {value: birth.toISOString().split("T")[0]}});
        expect(screen.getByRole("button", {name: /submit/i})).not.toBeDisabled();
    });

    test("shows validation errors on submit with empty form", () => {
        renderWithProviders(<RegistrationForm/>);
        fireEvent.submit(screen.getByTestId("form"));
        expect(screen.getAllByText(/must/i)).toHaveLength(4);
    });

    test("submits valid form and shows success message", () => {
        renderWithProviders(<RegistrationForm/>);
        fireEvent.change(screen.getByPlaceholderText("Firstname"), {target: {value: "Jean"}});
        fireEvent.change(screen.getByPlaceholderText("Lastname"), {target: {value: "Dupont"}});
        fireEvent.change(screen.getByPlaceholderText("Email"), {target: {value: "test@email.fr"}});
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), {target: {value: "13002"}});
        fireEvent.change(screen.getByPlaceholderText("City"), {target: {value: "Paris"}});
        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);
        fireEvent.change(screen.getByTestId("birth"), {target: {value: birth.toISOString().split("T")[0]}});
        fireEvent.submit(screen.getByTestId("form"));
        expect(localStorage.setItem).toHaveBeenCalledWith("users", expect.any(String));
        expect(screen.getByText(/user saved successfully/i)).toBeInTheDocument();
    });

    test("triggers all validation cases via individual field validation", () => {
        renderWithProviders(<RegistrationForm/>);

        const firstname = screen.getByPlaceholderText("Firstname");
        fireEvent.change(firstname, {target: {value: ""}});
        fireEvent.blur(firstname);

        const email = screen.getByPlaceholderText("Email");
        fireEvent.change(email, {target: {value: "invalid"}});
        fireEvent.blur(email);

        const postalCode = screen.getByPlaceholderText("PostalCode");
        fireEvent.change(postalCode, {target: {value: "ABC"}});
        fireEvent.blur(postalCode);

        const birthInput = screen.getByTestId("birth");
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 17);
        fireEvent.change(birthInput, {target: {value: minorDate.toISOString().split("T")[0]}});
        fireEvent.blur(birthInput);

        const city = screen.getByPlaceholderText("City");
        fireEvent.change(city, {target: {value: "Paris"}});
        fireEvent.blur(city);

        expect(screen.getAllByText(/must/i)).toHaveLength(3);
    });
});
