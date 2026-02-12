/**
 * Validate postal code
 * @param {string} code A string representing a postal code
 * @returns {boolean}
 */
function validatePostCode(code) {
    if (typeof code !== 'string') {
        throw new Error('post code must be a string')
    }
    if (!/^[0-9]{5}$/.test(code)) {
        throw new Error('post code must be a string with five digits')
    }

    return true;
}

/**
 * Validate email
 * @param {string} email A string representing an email
 * @returns {boolean}
 */
function validateEmail(email) {
    if (typeof email !== 'string') {
        throw new Error('email must be a string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error('email must be a valid email address');
    }

    return true;
}

/**
 * Validate identity: lastname + firstname
 * @param {string} lastname A string representing a lastname
 * @param {string} firstname A string representing a firstname
 * @returns {boolean}
 */
function validateIdentity(lastname, firstname) {

    function validateField(value, fieldName) {
        if (typeof value !== 'string') {
            throw new Error(`${fieldName} must be a string`);
        }

        if (/[<>]/.test(value)) {
            throw new Error(`${fieldName} contains forbidden characters`);
        }

        // Lettres + accents + espaces + tirets
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'’-]+$/;

        if (!regex.test(value) || value.trim() === '') {
            throw new Error(`${fieldName} must contain only letters, accents, spaces or hyphens`);
        }

        return true;
    }

    validateField(lastname, 'lastname');
    validateField(firstname, 'firstname');

    return true;
}

export {validatePostCode, validateEmail, validateIdentity}