const { Sequelize, DataTypes, Model } = require(`sequelize`);

const { sequelize } = require(`../database/connection`);

class Comment extends Model {}

Comment.init(
  {},
  {
    sequelize,
    paranoid: true,
    timestamps: true,
    tableName: `comments`,
    modelName: `Comment`,
  }
);
