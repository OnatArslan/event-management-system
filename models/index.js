const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);
const Review = require(`./review`);
const Comment = require(`./comment`);

// Add associations here

// User and Event Organizer releationship (One to Many)
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, {
  foreignKey: `organizerId`,
  as: `events`,
});

// User and Comment releationship (One to Many)
Comment.belongsTo(User, {
  foreignKey: `userId`,
  as: `owner`,
  onDelete: `CASCADE`,
});
User.hasMany(Comment, {
  foreignKey: `userId`,
  as: `comments`,
  onDelete: `CASCADE`,
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
