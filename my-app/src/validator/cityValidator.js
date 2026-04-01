import ValidationError from "./ValidationError";

/**
 * Validates that a city field is not empty
 *
 * @param {string} city
 * @throws {ValidationError}
 */
function validateCity(city) {
    if (typeof city !== "string" || !city || city.trim() === "") {
        throw new ValidationError("City must not be empty", "MISSING_CITY");
    }
}

export default validateCity;