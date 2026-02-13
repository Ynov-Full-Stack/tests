import {validateEmail, validatePostCode, validateIdentity} from "./validator";

/**
 *  @function validatePostCode
 */
describe('validatePostCode Test Suites', () => {
    it('should have the correct format', () => {
        const code = '13002'

        expect(validatePostCode(code)).toBe(true);
    });

    it('should return throw for an invalid postal code', () => {
        expect(() => validatePostCode('ABCDE')).toThrow('post code must be a string with five digits');
        expect(() => validatePostCode('130021')).toThrow('post code must be a string with five digits');
        expect(() => validatePostCode('13 002')).toThrow('post code must be a string with five digits');
        expect(() => validatePostCode('')).toThrow('post code must be a string with five digits');
    });

    it('should return throw a "post code must be a string"', () => {
        expect(() => validatePostCode(null)).toThrow('post code must be a string');
        expect(() => validatePostCode(13002)).toThrow('post code must be a string');
    });
});

/**
 * @function validateEmail
 */
describe('validateEmail Test Suites', () => {
    it('should have the correct email format', () => {
        const email = 'email@email.fr'
        expect(validateEmail(email)).toBe(true);
    })
    it('should throw an error for an invalid email format', () => {
        expect(() => validateEmail('emailemail.fr'))
            .toThrow('email must be a valid email address');

        expect(() => validateEmail('email@'))
            .toThrow('email must be a valid email address');

        expect(() => validateEmail('email@email'))
            .toThrow('email must be a valid email address');

        expect(() => validateEmail(''))
            .toThrow('email must be a valid email address');
    });

    it('should throw an error if email is not a string', () => {
        expect(() => validateEmail(null))
            .toThrow('email must be a string');

        expect(() => validateEmail(123))
            .toThrow('email must be a string');
    });
})

/**
 * @function validateIdentity
 */
describe('validateIdentity Test Suites', () => {

    it('should return true for a valid identity', () => {
        expect(validateIdentity('Dupont', 'Jean')).toBe(true);
        expect(validateIdentity('D’Amboise', 'Élodie')).toBe(true);
        expect(validateIdentity('Jean-Pierre', 'Marie-Claire')).toBe(true);
        expect(validateIdentity('Jean-Pierre', 'Dupont')).toBe(true);
        expect(validateIdentity('Marie Claire', 'Françoise')).toBe(true);
        expect(validateIdentity('Fonell', 'Loïse')).toBe(true);
    });

    it('should throw an error for invalid lastname', () => {
        expect(() => validateIdentity('Dupont3', 'Jean'))
            .toThrow('lastname must contain only letters, accents, spaces or hyphens');
        expect(() => validateIdentity('<script>', 'Jean'))
            .toThrow('lastname contains forbidden characters');
    });

    it('should throw an error for invalid firstname', () => {
        expect(() => validateIdentity('Dupont', 'Jean3'))
            .toThrow('firstname must contain only letters, accents, spaces or hyphens');
        expect(() => validateIdentity('Dupont', '<script>'))
            .toThrow('firstname contains forbidden characters');
    });

    it('should throw an error for non-string values', () => {
        expect(() => validateIdentity(null, 'Jean'))
            .toThrow('lastname must be a string');
        expect(() => validateIdentity('Dupont', null))
            .toThrow('firstname must be a string');
    });

});