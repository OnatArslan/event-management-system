const { Sequelize, DataTypes, Model } = require(`sequelize`);

const { sequelize } = require(`../database/connection`);

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    timestamps: true,
    tableName: `comments`,
    modelName: `Comment`,
  }
);

module.exports = Comment;
