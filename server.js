const dotenv = require("dotenv");
dotenv.config();

const sequelize = require(`./sequelize`);

const app = require(`./app`);

// Sync Database
async function testDB() {
  try {
    await sequelize.authenticate({});
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testDB(); // This code will test the connection

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
