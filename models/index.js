const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);

// Add associations here

// User and Event releationship
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, { foreignKey: `organizerId`, as: `events` });

// Event and Categorie releationship with eventCategorie join table

// Export modules centeral
module.exports = { sequelize, User, Event, Categorie };
