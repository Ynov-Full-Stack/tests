/**
 * Calculate a person's age in years
 * @param {object} p An object representing a person, implementing a birthdate parameter
 * @returns {number} The age in years of p
 */
function calculateAge(p) {
    if (!p) {
        throw new Error('missing param p');
    }
    if (typeof p !== 'object' || Array.isArray(p)) {
        throw new Error('param p must be an object');
    }

    if (!('birth' in p)) {
        throw new Error('param p must have a birthdate property');
    }

    if (!(p.birth instanceof Date)) {
        throw new Error('birth must be a Date');
    }

    if (p.birth > new Date()) {
        throw new Error('birth cannot be in the future');
    }

    const today = new Date();
    let age = today.getFullYear() - p.birth.getFullYear();
    const m = today.getMonth() - p.birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < p.birth.getDate())) {
        age--;
    }

    if (age < 18) {
        throw new Error('person must be at least 18 years old');
    }

    return age;
}

export { calculateAge };