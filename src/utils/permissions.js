const Roles = require('../config.js').WhitelistRoles;

/**
 *
 * @param { Array } userRoles - Roles of specified user
 * @returns { Boolean } - Returns if user has perms
*/
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