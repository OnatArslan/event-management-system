const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
// Add associations here

Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, { foreignKey: `organizerId`, as: `events` });

// Export modules centeral
module.exports = { User, sequelize, Event };
