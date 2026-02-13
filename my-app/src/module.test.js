import {calculateAge} from './module';

/**
 * @function calculateAge
 */
describe('calculateAge Unit Test Suites', () => {
    it('should return an age >= 18 years old', () => {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        const p = { birth: eighteenYearsAgo };
        expect(calculateAge(p)).toBe(18);
    });

    it('should throw an error if person is under 18', () => {
        const seventeenYearsAgo = new Date();
        seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);
        expect(() => calculateAge({ birth: seventeenYearsAgo })).toThrow('person must be at least 18 years old');
    });

    it('should return a correct age', () => {
        const axel = {
            birth: new Date("07/25/1993")
        }
        expect(calculateAge(axel)).toEqual(32);
    });

    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow('missing param p');
    });

    it('should be an object', () => {
        expect(() => calculateAge(42)).toThrow('param p must be an object');
        expect(() => calculateAge('test')).toThrow('param p must be an object')
        expect(() => calculateAge([])).toThrow('param p must be an object');
    })

    it('should have an argument', () => {
        expect(calculateAge).toBeDefined();
    })

    it('should throw if p object does not have birthdate property', () => {
        expect(() => calculateAge({})).toThrow('param p must have a birthdate property');
    })

    it('should throw if birth is not a Date object', () => {
        expect(() => calculateAge({ birth: '2000-01-01' })).toThrow('birth must be a Date');
        expect(() => calculateAge({ birth: 123456789 })).toThrow('birth must be a Date');
        expect(() => calculateAge({ birth: null })).toThrow('birth must be a Date');
        expect(() => calculateAge({ birth: {} })).toThrow('birth must be a Date');
    });

    it('should throw if birth is in the future', () => {
        expect(() => calculateAge({ birth: new Date('2030-01-01') }))
            .toThrow('birth cannot be in the future');
    });

    it('should calculate age correctly for 29 February birthdays', () => {
        const leapBirthday = new Date('2004-02-29');
        const age = calculateAge({ birth: leapBirthday });
        expect(age).toBeGreaterThanOrEqual(18);
    });
});
