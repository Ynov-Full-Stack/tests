import validatePostalCode from "./postalCodeValidator";

/**
 * @function validatePostalCode
 * Tests for US postal codes (5 digits or 5 digits + 4)
 */
describe("validatePostalCode - US postal code validation (12345 or 12345-6789)", () => {

  describe("Valid cases - Correct US postal codes", () => {
    it("should accept a 5-digit ZIP code", () => {
      expect(() => validatePostalCode("31428")).not.toThrow();
      expect(() => validatePostalCode("12345")).not.toThrow();
    });

    it("should accept ZIP+4 format", () => {
      expect(() => validatePostalCode("31428-2261")).not.toThrow();
      expect(() => validatePostalCode("12345-6789")).not.toThrow();
    });
  });

  describe("Invalid cases - Incorrect formats", () => {
    it("should reject postal code with less than 5 digits", () => {
      expect(() => validatePostalCode("1234")).toThrow();
      expect(() => validatePostalCode("1")).toThrow();
    });

    it("should reject postal code with more than 5 digits without dash", () => {
      expect(() => validatePostalCode("123456")).toThrow();
      expect(() => validatePostalCode("1234567")).toThrow();
    });

    it("should reject malformed ZIP+4", () => {
      expect(() => validatePostalCode("12345-678")).toThrow();
      expect(() => validatePostalCode("1234-6789")).toThrow();
      expect(() => validatePostalCode("12345-67890")).toThrow();
    });

    it("should reject postal code with letters", () => {
      expect(() => validatePostalCode("12A45")).toThrow();
      expect(() => validatePostalCode("12345-67B9")).toThrow();
    });

    it("should reject postal code with special characters", () => {
      expect(() => validatePostalCode("1234_5")).toThrow();
      expect(() => validatePostalCode("1234 5")).toThrow();
      expect(() => validatePostalCode("12345.6789")).toThrow();
    });
  });

  describe("Edge cases and validation errors", () => {
    it("should reject empty string", () => {
      expect(() => validatePostalCode("")).toThrow(
          expect.objectContaining({ code: "MISSING_POSTAL_CODE" })
      );
    });

    it("should reject null or undefined", () => {
      expect(() => validatePostalCode(null)).toThrow(
          expect.objectContaining({ code: "MISSING_POSTAL_CODE" })
      );
      expect(() => validatePostalCode()).toThrow(
          expect.objectContaining({ code: "MISSING_POSTAL_CODE" })
      );
    });

    it("should reject non-string types", () => {
      expect(() => validatePostalCode(12345)).toThrow(
          expect.objectContaining({ code: "INVALID_POSTAL_CODE_TYPE" })
      );
      expect(() => validatePostalCode({ zip: "12345" })).toThrow(
          expect.objectContaining({ code: "INVALID_POSTAL_CODE_TYPE" })
      );
      expect(() => validatePostalCode(["12345"])).toThrow(
          expect.objectContaining({ code: "INVALID_POSTAL_CODE_TYPE" })
      );
    });

    it("should reject postal code with leading/trailing spaces", () => {
      expect(() => validatePostalCode(" 12345")).toThrow();
      expect(() => validatePostalCode("12345 ")).toThrow();
      expect(() => validatePostalCode(" 12345 ")).toThrow();
    });

    it("should reject negative numbers as string", () => {
      expect(() => validatePostalCode("-12345")).toThrow();
    });

    it("should reject postal code with tab or newline", () => {
      expect(() => validatePostalCode("123\t45")).toThrow();
      expect(() => validatePostalCode("123\n45")).toThrow();
    });
  });

});