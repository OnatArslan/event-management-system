const { Sequelize, DataTypes, Model } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

class Event extends Model {}

Event.init(
  {},
  {
    sequelize,
    modelName: `Event`,
    tableName: `events`,
    timestamps: true,
  }
);
