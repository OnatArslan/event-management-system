const { Sequelize, DataTypes, Model, UUIDV4 } = require(`sequelize`);

const { sequelize } = require("../database/connection");

class eventCategorie extends Model {}

eventCategorie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = eventCategorie;
