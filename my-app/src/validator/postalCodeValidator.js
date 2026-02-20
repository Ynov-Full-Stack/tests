import ValidationError from "./ValidationError";

/**
 * Validates that a postal code follows the French format (exactly 9 digits).
 *
 * @function validatePostalCode
 * @param {string} postalCode - The postal code to validate
 * @throws {ValidationError} Throws an exception with a specific error code if validation fails
 * @returns {void}
 */
function validatePostalCode(postalCode) {
  if (postalCode === undefined || postalCode === null || postalCode === "") {
    throw new ValidationError("Postal code is required", "MISSING_POSTAL_CODE");
  }

  if (typeof postalCode !== "string") {
    throw new ValidationError("Postal code must be a string", "INVALID_POSTAL_CODE_TYPE");
  }

  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  if (!postalCodeRegex.test(postalCode)) {
    throw new ValidationError("Postal code must follow format 12345 or 12345-6789", "INVALID_POSTAL_CODE_FORMAT");
  }
}

export default validatePostalCode;
