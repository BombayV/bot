const { connect, connection } = require('mongoose');
const { MONGO_AUTH } = require('../config').Config;

// Checks for a connection
const manager = connection;
manager.on('connected', function() {
    console.log(`Database connected!\nState: ${this.readyState}\nTable Name: ${this.name}`);
});

manager.on('disconnected', function(){
    console.log(`Database disconnected!\nState: ${this.readyState}\nTable Name: ${this.name}`);
})

/**
 * Connects to database
 */
exports.CreateConnection = async () => {
    await connect(
        MONGO_AUTH, {
            dbName: 'bot',
            keepAlive: true
        }
    )
}