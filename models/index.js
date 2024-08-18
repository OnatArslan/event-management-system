const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);

// Add associations here

// User and Event Organizer releationship
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, {
  foreignKey: `organizerId`,
  as: `events`,
});

// Event and Categorie
Event.belongsTo(Categorie, {
  foreignKey: `categorieId`,
  as: `categorie`,
  onDelete: `CASCADE`,
});

Categorie.hasMany(Event, {
  foreignKey: `categorieId`,
  as: `events`,
  onDelete: `CASCADE`,
});

// Export modules centeral
module.exports = { sequelize, User, Event, Categorie };
