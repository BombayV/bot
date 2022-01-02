/**
 * Get a number between min and max
 * @param { Number } min - Max Number
 * @param { Number } max - Max number
 * @returns { Number } - Result number between min and max params
 */
exports.GetNumber = (min, max) => {
    const mininum = Math.ceil(min);
    const maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - mininum + 1)) + min;
}

/**
 *
 * @param { String } str - Text String
 * @returns { String } - Capitalized string
 */
String.prototype.Capitilize = function(str) {
    if (typeof str === 'object') {
        return JSON.stringify(this);
    } else if (typeof str === 'number') {
        str.toString();
    }

    return this[0].toUpperCase() + this.slice(1)
}

exports.Capitilize = String.prototype.Capitilize;