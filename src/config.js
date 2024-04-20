/**
 * Private data
*/
exports.Config = {
    "BOT_TOKEN": "",
    "GUILD_ID": "",
    "CLIENT_ID": "",
    "GITHUB_AUTH": "",
    "MONGO_AUTH": '',
    "JOKE_AUTH": '',
    "STATUS": "dnd",
    "DESCRIPTION": "for bad memes...",
    "COLOR": '#FE2C54',
    "ACTIVITY": 3
}

/**
 * Roles allowed to do admin commands
*/
exports.WhitelistRoles = [
    847906880868450324,
    899760864725458944
]

/**
 * Statuses
*/
exports.Statuses = {
    ['online']: 'Active',
    ['idle']: 'Inactive',
    ['invisible']: 'Hidden',
    ['dnd']: 'Do not disturb'
}

/**
 * Random responses for 8ball
*/
exports.Responses = [
    'Yes',
    'Maybe',
    'Try again later',
    'Sus',
    'No',
    'Why not'
]
