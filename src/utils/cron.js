const Ban = require('../db/models/banModel');

const UpdateBans = async (client) => {
    const query = {
        // $lt == less than
        expires: { $lt: new Date() }
    };

    // Search if ban has expired
    const result = await Ban.find(query);
    if (result?.length < 1) return;

    // Iterate through result array with user being the value
    for (const user of result) {
        // Destructure user
        const { guildId, userId } = user;

        //Search if guild exists
        const guild = await client.guilds.fetch(guildId);
        if (!guild) continue;

        // Unban user
        const unBan = await guild.members.unban(userId, 'Ban has expired!').catch((err) => console.log(err));
        if (unBan) {
            console.log(`${userId} was unbanned`)
        }
    }

    // Delete user from db
    const unBanned = await Ban.deleteMany(query).catch((err) => console.log(err))
    if (unBanned) {
        console.log('Everything has been deleted');
    }
}

module.exports = (client) => {
    setInterval(() => {
        UpdateBans(client);
    }, 1000 * 60);
};