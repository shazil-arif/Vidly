const express        = require("express");
const app            = express();
const initMongoDB    = require("./startup/db");
const initRoutes     = require("./startup/routes");
const useLogger      = require("./startup/logging");
const appConfig      = require("./startup/config");
const validation     = require("./startup/validation");
const winston        = require("winston");

useLogger();
validation();
appConfig();
initMongoDB();
initRoutes(app);
  
const port = process.env.PORT || 3000
const server = app.listen(port, ()=> winston.info(`Running on port ${port}`));

module.exports = server;