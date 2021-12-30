const Roles = require('../config.js').WhitelistRoles;
module.exports = userRoles => {
    if (!userRoles) return false;
    let hasPerms = false;
    for (const userRole of userRoles) {
        for (const role of Roles) {
            if (role == userRole) {
                hasPerms = true;
                break;
            };
        };
    };
    return hasPerms;
}