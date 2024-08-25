const { Sequelize, DataTypes } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

// Import models here
const User = require(`./user`);
const Event = require(`./event`);
const Categorie = require(`./categorie`);
const Review = require(`./review`);
const Comment = require(`./comment`);
const EventUser = require(`./eventUser`);
const UserFollower = require(`./userFollower`);
// Add associations here

// User and Event Organizer releationship (One to Many)
Event.belongsTo(User, { foreignKey: `organizerId`, as: `organizer` });
User.hasMany(Event, {
  foreignKey: `organizerId`,
  as: `organizedEvents`,
});

// User and Event releationship (Many to Many) for join events
Event.belongsToMany(User, {
  foreignKey: `eventId`,
  through: EventUser,
  as: `participants`,
});

User.belongsToMany(Event, {
  foreignKey: `userId`,
  through: EventUser,
  as: `joinedEvents`,
});

User.hasMany(EventUser, { foreignKey: `userId` });
EventUser.belongsTo(User, { foreignKey: `userId` });

Event.hasMany(EventUser, { foreignKey: `eventId` });
EventUser.belongsTo(Event, { foreignKey: `eventId` });

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

// User and User releationship (Follow unfollow)
User.belongsToMany(User, {
  foreignKey: `followerId`,
  as: `followings`,
  through: UserFollower,
});
User.belongsToMany(User, {
  foreignKey: `followingId`,
  as: `followers`,
  through: UserFollower,
});
User.hasMany(UserFollower, { foreignKey: `followerId` });
UserFollower.belongsTo(User, { foreignKey: `followerId` });
User.hasMany(UserFollower, { foreignKey: `followingId` });
UserFollower.belongsTo(User, { foreignKey: `followingId` });

// Export modules centeral
module.exports = {
  User,
  Event,
  Categorie,
  Review,
  Comment,
  UserFollower,
  EventUser,
};
