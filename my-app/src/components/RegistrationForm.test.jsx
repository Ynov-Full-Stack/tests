import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProvider } from "../context/UserContext";
import RegistrationForm from "./RegistrationForm";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("../validator", () => ({
    validatePostCode: jest.fn(() => {}),
    validateEmail: jest.fn(() => {}),
    validateIdentity: jest.fn(() => {}),
}));

jest.mock("../validator/cityValidator", () => ({
    __esModule: true,
    default: jest.fn(() => {}),
}));

jest.mock("axios");
const mockedAxios = axios;

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const renderWithProviders = (ui) =>
    render(
        <MemoryRouter>
            <UserProvider>{ui}</UserProvider>
        </MemoryRouter>
    );

describe("RegistrationForm - Tests Complets", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedAxios.get.mockResolvedValue({
            data: [
                { id: 1, email: "dupont@test.com", name: "Jean", username: "jdupont" },
            ],
        });
    });

    test("renders form", async () => {
        renderWithProviders(<RegistrationForm />);
        await waitFor(() => {
            expect(screen.getByTestId("form")).toBeInTheDocument();
        });
    });

    test("submit button disabled when form is invalid", () => {
        renderWithProviders(<RegistrationForm />);
        expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });

    test("submit button enabled when form is valid", async () => {
        renderWithProviders(<RegistrationForm />);
        fireEvent.change(screen.getByPlaceholderText("Name"), {
            target: { value: "Jean Dupont" },
        });
        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "jdupont2" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "jean@test.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("City"), {
            target: { value: "Paris" },
        });
        fireEvent.change(screen.getByPlaceholderText("PostalCode"), {
            target: { value: "75001" },
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /submit/i })
            ).not.toBeDisabled();
        });
    });

    test("shows validation errors for empty fields", async () => {
        renderWithProviders(<RegistrationForm />);
        ["Name", "Username", "Email", "City", "PostalCode"].forEach((field) => {
            fireEvent.blur(screen.getByPlaceholderText(field));
        });

        await waitFor(() => {
            expect(
                screen.getByText("Name must not be empty")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Username must not be empty")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Email must not be empty")
            ).toBeInTheDocument();
            expect(
                screen.getByText("City must not be empty")
            ).toBeInTheDocument();
            expect(
                screen.getByText("PostalCode must not be empty")
            ).toBeInTheDocument();
        });
    });

    describe("API Integration (200/400/500)", () => {
        test("POST 201 - succès", async () => {
            mockedAxios.post.mockResolvedValue({ status: 201, data: { id: 2 } });

            renderWithProviders(<RegistrationForm />);
            fireEvent.change(screen.getByPlaceholderText("Name"), {
                target: { value: "Jean Dupont" },
            });
            fireEvent.change(screen.getByPlaceholderText("Username"), {
                target: { value: "jdupont2" },
            });
            fireEvent.change(screen.getByPlaceholderText("Email"), {
                target: { value: "jean@test.com" },
            });
            fireEvent.change(screen.getByPlaceholderText("City"), {
                target: { value: "Paris" },
            });
            fireEvent.change(screen.getByPlaceholderText("PostalCode"), {
                target: { value: "75001" },
            });

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /submit/i })
                ).not.toBeDisabled();
            });

            fireEvent.click(screen.getByRole("button", { name: /submit/i }));

            await waitFor(() => {
                expect(mockedAxios.post).toHaveBeenCalled();
                expect(
                    screen.getByText("User saved successfully!")
                ).toBeInTheDocument();
            });
        });

        test("POST 400 - Email déjà utilisé", async () => {
            renderWithProviders(<RegistrationForm />);
            fireEvent.change(screen.getByPlaceholderText("Name"), {
                target: { value: "Jean" },
            });
            fireEvent.change(screen.getByPlaceholderText("Username"), {
                target: { value: "jdupont" },
            });
            fireEvent.change(screen.getByPlaceholderText("Email"), {
                target: { value: "dupont@test.com" },
            });
            fireEvent.change(screen.getByPlaceholderText("City"), {
                target: { value: "Paris" },
            });
            fireEvent.change(screen.getByPlaceholderText("PostalCode"), {
                target: { value: "75001" },
            });

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /submit/i })
                ).not.toBeDisabled();
            });

            fireEvent.click(screen.getByRole("button", { name: /submit/i }));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "Cet email est déjà utilisé"
                );
            });
        });

        test("POST 500 - Serveur indisponible", async () => {
            mockedAxios.post.mockRejectedValue({ response: { status: 500 } });

            renderWithProviders(<RegistrationForm />);
            fireEvent.change(screen.getByPlaceholderText("Name"), {
                target: { value: "Jean Dupont" },
            });
            fireEvent.change(screen.getByPlaceholderText("Username"), {
                target: { value: "jdupont3" },
            });
            fireEvent.change(screen.getByPlaceholderText("Email"), {
                target: { value: "crash@test.com" },
            });
            fireEvent.change(screen.getByPlaceholderText("City"), {
                target: { value: "Paris" },
            });
            fireEvent.change(screen.getByPlaceholderText("PostalCode"), {
                target: { value: "75001" },
            });

            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /submit/i })
                ).not.toBeDisabled();
            });

            fireEvent.click(screen.getByRole("button", { name: /submit/i }));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    /erreur serveur|réessayer plus tard/i
                );
            });
        });
    });
});
