const { DataTypes, Model, Sequelize, UUIDV4 } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

class UserFollower extends Model {}

UserFollower.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    followerId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(`pending`, `approved`, `rejected`),
      defaultValue: `pending`,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: `UserFollower`,
    tableName: `user_follower`,
  }
);

module.exports = UserFollower;
