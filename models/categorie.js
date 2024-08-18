const { Sequelize, DataTypes, Model, UUIDV4 } = require(`sequelize`);

const { sequelize } = require("../database/connection");

class Categorie extends Model {}

Categorie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: `categories`,
    modelName: `Categorie`,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: [`name`],
      },
    ],
  }
);

module.exports = Categorie;
