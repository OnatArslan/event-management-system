const { Sequelize, DataTypes, Model } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Title cannot be empty`,
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coordinates: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: `Event`,
    tableName: `events`,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: [`title`, `date`],
      },
    ],
  }
);

module.exports = Event;
