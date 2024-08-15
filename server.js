const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require(`./app`);
const { testConnection, syncDatabase } = require(`./database/connection`);
const sequelize = require(`./database/connection`);

// Test Database connection and server here
// Actually this block of code is neccessary for server and database connection
testConnection()
  .then(() => {
    syncDatabase();
  })
  .then(() => {
    const server = http.createServer(app);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to start server`, error);
  });
