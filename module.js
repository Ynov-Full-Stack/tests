/**
 * Calculate a person's age in years
 * @param {object} p An object representing a person, implementing a birthdate parameter
 * @returns {number} The age in years of p
 */
function calcuteAge(p){
    let dateDiff = new Date(Date.now() - p.birth.dateTime())
    let age = Math.abs(dateDiff.getUTCFullYear() - 1970)
    return( age)
}