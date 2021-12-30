const fs = require('fs');

const GetFiles = (dir, suffix) => {
    const fileSuffix = suffix || '.js'
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    let commandData = []
    for (const file of files) {
        if (file.isDirectory()) {
            commandData = [
                ...commandData,
                ...GetFiles(`${dir}${file.name}/`, fileSuffix)
            ]
        } else if (file.name.endsWith(fileSuffix)) {
            const cmd = require(`../commands/${dir.split('commands/')[1]}${file.name}`);
            commandData.push(cmd);
        }
    }
    return commandData;
};

module.exports = GetFiles;