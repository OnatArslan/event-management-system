const { Sequelize, DataTypes, Model, UUIDV4 } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

class EventUser extends Model {}

EventUser.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: `EventUser`,
    tableName: `event_user`,
  }
);

module.exports = EventUser;
