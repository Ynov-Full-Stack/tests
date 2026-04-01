import validateCity from "./cityValidator";
import ValidationError from "./ValidationError";

describe("validateCity", () => {
    describe("Valid cases", () => {
        it("should accept non-empty city names", () => {
            expect(() => validateCity("Paris")).not.toThrow();
            expect(() => validateCity("New York")).not.toThrow();
            expect(() => validateCity("São Paulo")).not.toThrow();
            expect(() => validateCity("東京")).not.toThrow();
        });

        it("should accept city with spaces", () => {
            expect(() => validateCity("Los Angeles")).not.toThrow();
            expect(() => validateCity("Porto-Novo")).not.toThrow();
        });

        it("should accept single letter city names", () => {
            expect(() => validateCity("A")).not.toThrow();
            expect(() => validateCity("I")).not.toThrow();
        });

        it("should trim whitespace before validation", () => {
            expect(() => validateCity(" Paris ")).not.toThrow();
            expect(() => validateCity("   Tokyo   ")).not.toThrow();
        });
    });

    describe("Invalid cases", () => {
        it("should throw ValidationError for null", () => {
            expect(() => validateCity(null)).toThrow(ValidationError);
            expect(() => validateCity(null)).toThrow("City must not be empty");
        });

        it("should throw ValidationError for undefined", () => {
            expect(() => validateCity(undefined)).toThrow(ValidationError);
            expect(() => validateCity(undefined)).toThrow("City must not be empty");  // ✅ undefined
        });

        it("should throw ValidationError for empty string", () => {
            expect(() => validateCity("")).toThrow(ValidationError);
            expect(() => validateCity("")).toThrow("City must not be empty");         // ✅ ""
        });

        it("should throw ValidationError for string with only whitespace", () => {
            expect(() => validateCity("   ")).toThrow(ValidationError);
            expect(() => validateCity("\n\t")).toThrow(ValidationError);
            expect(() => validateCity("  \n\t  ")).toThrow(ValidationError);
        });

        it("should throw ValidationError for whitespace-only strings with message", () => {
            expect(() => validateCity("   ")).toThrow("City must not be empty");
        });
    });


    describe("Edge cases", () => {
        it("should handle non-string inputs", () => {
            expect(() => validateCity(123)).toThrow(ValidationError);
            expect(() => validateCity({})).toThrow(ValidationError);
            expect(() => validateCity([])).toThrow(ValidationError);
        });

        it("should throw exactly ValidationError class", () => {
            expect(() => validateCity("")).toThrow(ValidationError);
        });
    });
});
