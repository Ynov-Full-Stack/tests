import validateUser from "./userValidator";

let today;
beforeEach(() => {
  today = new Date();
});

/**
 * @function validateUser
 */
describe("validateUser - Complete user form validation", () => {
  describe("Valid cases - Complete valid user data", () => {
    it("should return true for a valid user with all correct fields", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "jean.dupont@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(true);
    });

    it("should return true for a user with complex valid names", () => {
      const userData = {
        name: "Marie-Hélène",
        username: "O'Connor",
        email: "marie.oconnor@company.fr",
        city: "Paris",
        postalCode: "13001",
      };

      expect(validateUser(userData)).toBe(true);
    });

  })
  describe("Invalid cases - Missing or null user data", () => {
    it("should return false when userData is null", () => {
      expect(validateUser(null)).toBe(false);
    });

    it("should return false when userData is undefined", () => {
      expect(validateUser(undefined)).toBe(false);
    });

    it("should return false when userData is not an object", () => {
      expect(validateUser("not an object")).toBe(false);
      expect(validateUser(123)).toBe(false);
      expect(validateUser(true)).toBe(false);
    });

    it("should return false when userData is an array", () => {
      expect(validateUser([])).toBe(false);
      expect(validateUser(["Jean", "Dupont"])).toBe(false);
    });

    it("should return false when userData is an empty object", () => {
      expect(validateUser({})).toBe(false);
    });
  });

  describe("Invalid cases - Invalid name", () => {
    it("should return false when name is missing", () => {
      const userData = {
        username: "Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when name is empty", () => {
      const userData = {
        name: "",
        username: "Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when name is too short", () => {
      const userData = {
        name: "J",
        username: "Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when name contains numbers", () => {
      const userData = {
        name: "Jean123",
        username: "Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when name contains XSS attempt", () => {
      const userData = {
        name: "<script>alert('XSS')</script>",
        username: "Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });
  });

  describe("Invalid cases - Invalid username", () => {
    it("should return false when username is missing", () => {
      const userData = {
        name: "Jean",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when username is empty", () => {
      const userData = {
        name: "Jean",
        username: "",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when username contains special characters", () => {
      const userData = {
        name: "Jean",
        username: "Dupont@123",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });
  });

  describe("Invalid cases - Invalid email", () => {
    it("should return false when email is missing", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when email is empty", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when email format is invalid", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "invalid-email",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when email has no @", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "testexample.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when email has XSS attempt", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "<script>@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      expect(validateUser(userData)).toBe(false);
    });
  });

  describe("Invalid cases - Invalid postalCode", () => {
    it("should return false when postalCode is missing", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when postalCode is empty", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when postalCode has wrong length", () => {
      const userData1 = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "1234",
      };

      const userData2 = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "123456",
      };

      expect(validateUser(userData1)).toBe(false);
      expect(validateUser(userData2)).toBe(false);
    });

    it("should return false when postalCode contains letters", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "7500A",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when postalCode is not a string", () => {
      const userData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: 75001,
      };

      expect(validateUser(userData)).toBe(false);
    });
  });

  describe("Invalid cases - Multiple invalid fields", () => {
    it("should return false when multiple fields are invalid", () => {
      const userData = {
        name: "A",
        username: "D",
        email: "invalid-email",
        city: "P",
        postalCode: "123",
      };

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when all fields are missing", () => {
      const userData = {};

      expect(validateUser(userData)).toBe(false);
    });

    it("should return false when all fields are empty strings", () => {
      const userData = {
        name: "",
        username: "",
        email: "",
        city: "",
        postalCode: "",
      };

      expect(validateUser(userData)).toBe(false);
    });
  });

  describe("Type checking and edge cases", () => {
    it("should return boolean type", () => {
      const validData = {
        name: "Jean",
        username: "Jean Dupont",
        email: "test@example.com",
        city: "Paris",
        postalCode: "75001",
      };

      const result = validateUser(validData);
      expect(typeof result).toBe("boolean");
    });

    it("should always return boolean, never throw exceptions", () => {
      const invalidData = {
        name: "<script>",
        username: null,
        email: 123,
        city: [],
        postalCode: [],
      };

      expect(() => validateUser(invalidData)).not.toThrow();
      expect(typeof validateUser(invalidData)).toBe("boolean");
    });

    it("should handle partial data gracefully", () => {
      const partialData = {
        name: "Jean",
        username: "Dupont",
      };

      expect(validateUser(partialData)).toBe(false);
    });
  });
});
