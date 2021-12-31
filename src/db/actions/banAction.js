const Ban = require('../models/banModel');

exports.GetBanned = async userId => {
    const result = await Ban.findOne({userId}).catch((err) => console.log);
    return result;
}

exports.NewBan = async (userId, adminId, reason, expires) => {
    const ban = new Ban();
    ban.userId = userId;
    ban.adminId = adminId;
    ban.reason = reason;
    ban.expires = expires;
    return await ban.save(ban);
}