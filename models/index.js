const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
// Add associations here

// Export modules centeral
module.exports = { User, sequelize, Event };
