const { Sequelize, DataTypes, Model } = require(`sequelize`);
const { sequelize } = require(`../database/connection`);

const bcrypt = require("bcrypt");

class User extends Model {}

User.init(
  {
    // Fields
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [4, 20],
          msg: `Username length must be between 4 and 20 characters`,
        },
        isAlphanumeric: {
          args: true,
          msg: `Username must contain only letters and numbers`,
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: `This field must contain a valid email address`,
        },
        notEmpty: {
          args: true,
          msg: `Email cannot be empty`,
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 30],
          msg: "Password must be between 8 and 30 characters",
        },
        isComplex(value) {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
          if (!regex.test(value)) {
            throw new Error(
              "Password must include uppercase, lowercase, number, and special character"
            );
          }
        },
      },
    },
    passwordConfirmation: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isEqual(value) {
          if (this.password.toString() !== value.toString()) {
            throw new Error(`Password confirmation does not match password`);
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: [`user`, `organizer`, `admin`],
      defaultValue: `user`,
    },
    profileInfo: {
      type: DataTypes.TEXT,
      defaultValue: `Fresh user :)`,
    },
  },
  {
    // Options
    sequelize, // sequelize object must be in options
    modelName: `User`,
    tableName: `users`,
    timestamps: true,
    paranoid: true,
    // This default scope for other users try to get user info
    defaultScope: {
      attributes: {
        exclude: [`password`],
      },
    },
    scopes: {
      withAll: {
        attributes: { include: `*` },
      },
    },
    indexes: [
      {
        unique: true,
        fields: [`username`],
      },
    ],
  }
);

User.beforeCreate(async (user, options) => {
  const plainPassword = user.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  user.password = hashedPassword;
  // user.save({ validate: false });
  // This is not neccessary
});

User.beforeUpdate(async (user, options) => {
  if (user.changed(`password`)) {
    const plainPassword = user.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    user.password = hashedPassword;
  }
});

module.exports = User;
