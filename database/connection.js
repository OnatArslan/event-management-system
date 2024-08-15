const { env } = require("process");
const { Sequelize } = require("sequelize");

// Get sequelize instances
const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {
  logging: false,
});

// Add neccessary functions (use them in server.js)

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection has been established succesfully.`);
  } catch (error) {
    console.error(`Unable to connect to the database`, error);
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(`Database synchronized succesfully.`);
  } catch (error) {
    console.error(`Error synchronizing the database.`, error);
  }
};

module.exports = { sequelize, testConnection, syncDatabase };
