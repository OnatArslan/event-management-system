const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);
const eventCategorie = require("./eventCategorie");

// Add associations here

// User and Event releationship
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, { foreignKey: `organizerId`, as: `events` });

// Event and Categorie releationship with eventCategorie join table
Event.belongsToMany(Categorie, {
  as: `categories`,
  foreignKey: `eventId`,
  otherKey: `categorieId`,
  through: eventCategorie,
});

Categorie.belongsToMany(Event, {
  as: `events`,
  foreignKey: `categorieId`,
  otherKey: `eventId`,
  through: eventCategorie,
});

Event.hasMany(eventCategorie, { foreignKey: `eventId` });
Categorie.hasMany(eventCategorie, { foreignKey: `categorieId` });

// Export modules centeral
module.exports = { sequelize, User, Event, Categorie, eventCategorie };
