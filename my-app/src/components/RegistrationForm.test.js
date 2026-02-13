import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";

beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
});

describe("RegistrationForm Integration", () => {

    test("renders form", () => {
        render(<RegistrationForm />);
        expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    test("shows validation errors", () => {
        render(<RegistrationForm />);

        fireEvent.submit(screen.getByTestId("form"));

        expect(screen.getAllByText(/must/i).length).toBeGreaterThan(0);
    });

    test("submits valid form and saves to localStorage", () => {
        render(<RegistrationForm />);

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

        const birth = new Date();
        birth.setFullYear(birth.getFullYear() - 20);

        fireEvent.change(
            screen.getByTestId("birth"),
            { target: { value: birth.toISOString().split("T")[0] } }
        );

        fireEvent.submit(screen.getByTestId("form"));

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "user",
            expect.any(String)
        );
    });

});
