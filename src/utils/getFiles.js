const fs = require('fs');

/**
 *
 * @param { String } dir - Path of commands directory
 * @param { String } suffix - Example: .js/.ts
 * @returns { Array } - Array with all the command data
 */
const GetFiles = (dir) => {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    let commandData = []
    for (const file of files) {
        if (file.isDirectory()) {
            commandData = [
                ...commandData,
                ...GetFiles(`${dir}${file.name}/`)
            ]
        } else {
            if (file.name.endsWith('.txt')) {
                commandData.push(`../commands/${dir.split('commands/')[1]}${file.name}`);
            } else {
                const cmd = require(`../commands/${dir.split('commands/')[1]}${file.name}`);
                commandData.push(cmd);
            }
        }
    }
    return commandData;
};

module.exports = GetFiles;