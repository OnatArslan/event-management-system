const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`)(sequelize, DataTypes);
// Add associations here

module.exports = { User, sequelize };
