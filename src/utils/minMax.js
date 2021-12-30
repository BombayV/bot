module.exports = (min, max) => {
    const mininum = Math.ceil(min);
    const maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - mininum + 1)) + min;
}