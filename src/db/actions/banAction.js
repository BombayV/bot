const Ban = require('../models/banModel');

/**
 *
 * @param { String } userId
 * @returns { Object } - Is user banned
 */
exports.GetBanned = async userId => {
    const result = await Ban.findOne({userId}).catch((err) => console.log);
    return result;
}

/**
 *
 * @param { String } guildId
 * @param { String } userId
 * @param { String } adminId
 * @param { String } reason
 * @param { Boolean } perma
 * @param { Date } expires
 * @returns { Object } - Was ban successful
 */
exports.NewBan = async (guildId, userId, adminId, reason, perma, expires) => {
    const ban = new Ban();
    ban.guildId = guildId
    ban.userId = userId;
    ban.adminId = adminId;
    ban.reason = reason;
    ban.perma = perma;
    ban.expires = expires;
    return await ban.save(ban);
}