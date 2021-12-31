String.prototype.Capitilize = function(str) {
    if (typeof str === 'object') {
        return JSON.stringify(this);
    } else if (typeof str === 'number') {
        str.toString();
    }

    return this[0].toUpperCase() + this.slice(1)
}

module.exports = String.prototype.Capitilize;