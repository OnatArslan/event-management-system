const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);

// Add associations here

// User and Event releationship
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, {
  foreignKey: `organizerId`,
  as: `events`,
  onDelete: `CASCADE`,
});

// Event and Categorie
Event.belongsTo(Categorie, { foreignKey: `categorieId`, as: `categorie` });
Categorie.hasMany(Event, { foreignKey: `categorieId`, as: `events` });

// Export modules centeral
module.exports = { sequelize, User, Event, Categorie };
