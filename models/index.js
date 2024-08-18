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
  as: `organizedEvents`,
});

// Event and Categorie releationship (One to Many)
Event.belongsTo(Categorie, {
  foreignKey: `categorieId`,
  as: `category`,
  onDelete: `CASCADE`,
});

Categorie.hasMany(Event, {
  foreignKey: `categorieId`,
  as: `categorizedEvents`,
  onDelete: `CASCADE`,
});

// User and Comment releationship (One to Many)
Comment.belongsTo(User, {
  foreignKey: `userId`,
  as: `author`,
  onDelete: `CASCADE`,
});
User.hasMany(Comment, {
  foreignKey: `userId`,
  as: `userComments`,
  onDelete: `CASCADE`,
});

// User and Review releationship (One to Many)
Review.belongsTo(User, {
  foreignKey: `userId`,
  as: `reviewer`,
  onDelete: `CASCADE`,
});
User.hasMany(Review, {
  foreignKey: `userId`,
  as: `userReviews`,
  onDelete: `CASCADE`,
});

// Event and Review releationship (One to Many)
Review.belongsTo(Event, {
  foreignKey: `eventId`,
  as: `reviewedEvent`,
  onDelete: `CASCADE`,
});
Event.hasMany(Review, {
  foreignKey: `eventId`,
  as: `eventReviews`,
  onDelete: `CASCADE`,
});

// Event and Comment releationship (One to Many)
Comment.belongsTo(Event, {
  foreignKey: `eventId`,
  as: `commentedEvent`,
  onDelete: `CASCADE`,
});
Event.hasMany(Comment, {
  foreignKey: `eventId`,
  as: `eventComments`,
  onDelete: `CASCADE`,
});

// Comment and Comment releationship (One to Many)
Comment.belongsTo(Comment, {
  foreignKey: `parentCommentId`,
  as: `parent`,
  onDelete: `CASCADE`,
});
Comment.hasMany(Comment, {
  foreignKey: `parentCommentId`,
  as: `replies`,
  onDelete: `CASCADE`,
});

// Export modules centeral
module.exports = { sequelize, User, Event, Categorie, Review, Comment };
