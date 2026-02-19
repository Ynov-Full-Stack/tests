// validator.js

/**
 * Valide un champ de type nom/prénom
 * @param {string} value
 * @param {string} fieldLabel "Lastname" ou "Firstname"
 * @returns {boolean}
 */
function validateNameField(value, fieldLabel) {
    if (value === undefined || value === null) {
        throw new Error(`${fieldLabel.toLowerCase()} must be a string`);
    }

    if (typeof value !== 'string') {
        throw new Error(`${fieldLabel.toLowerCase()} must be a string`);
    }

    if (/[<>]/.test(value)) {
        throw new Error(`${fieldLabel.toLowerCase()} contains forbidden characters`);
    }

    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'’-]+$/;

    if (!regex.test(value.trim()) || value.trim() === '') {
        throw new Error(`${fieldLabel.toLowerCase()} must only contain letters, accents, spaces or hyphens`);
    }

    return true;
}

/**
 * Validate postal code
 * @param {string} code A string representing a postal code
 * @returns {boolean}
 */
function validatePostCode(code) {
    if (typeof code !== 'string') {
        throw new Error('post code must be a string');
    }
    if (!/^[0-9]{5}$/.test(code)) {
        throw new Error('post code must be a string with five digits');
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
 * Utilisée par tes tests unitaires
 * @param {string} lastname
 * @param {string} firstname
 * @returns {boolean}
 */
function validateIdentity(lastname, firstname) {
    validateNameField(lastname, 'Lastname');
    validateNameField(firstname, 'Firstname');
    return true;
}

/**
 * Validate lastname seul (pour le formulaire)
 * @param {string} lastname
 * @returns {boolean}
 */
function validateLastname(lastname) {
    return validateNameField(lastname, 'Lastname');
}

/**
 * Validate firstname seul (pour le formulaire)
 * @param {string} firstname
 * @returns {boolean}
 */
function validateFirstname(firstname) {
    return validateNameField(firstname, 'Firstname');
}

export {
    validatePostCode,
    validateEmail,
    validateIdentity,
    validateLastname,
    validateFirstname
};
