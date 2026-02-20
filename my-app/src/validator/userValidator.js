import validatePostalCode from "./postalCodeValidator";
import validateIdentity from "./identityValidator";
import validateEmail from "./emailValidator";
import validateCity from "./cityValidator";


/**
 * Validates a complete user form with all required fields.
 * This is the main validation function that orchestrates all individual validations.
 *
 * @function validateUser
 * @param {Object} userData - The user data object to validate
 * @param {string} userData.name - The user's first name
 * @param {string} userData.username - The user's last name
 * @param {string} userData.email - The user's email address
 * @param {string} userData.postalCode - The user's postal code
 * @param {string} userData.city - The user's city
 * @returns {boolean} Returns true if all validations pass, false otherwise
 *
 * @example
 * const userData = {
 *   name: "Jean",
 *   username: "Jean Dupont",
 *   email: "jean.dupont@example.com",
 *   postalCode: "75001"
 *   city: "Paris"
 * };
 * const isValid = validateUser(userData); // returns true
 */
function validateUser(userData) {
  try {
    // Validate that userData is provided and is an object
    if (!userData || typeof userData !== "object" || Array.isArray(userData)) {
      return false;
    }

    // Validate all required fields using individual validation functions
    validateIdentity(userData.name);
    validateIdentity(userData.username);
    validateEmail(userData.email);
    validateCity(userData.city);
    validatePostalCode(userData.postalCode);

    // All validations passed
    return true;
  } catch (error) {
    // Any validation error results in returning false
    return false;
  }
}

export default validateUser;
