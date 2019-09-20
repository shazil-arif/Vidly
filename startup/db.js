const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = () =>{  
    const dbConnection = config.get('database')
    console.log(typeof dbConnection)  
    mongoose.connect(dbConnection,{useNewUrlParser:true})
    .then(()=>winston.info(`Successfully connected to host ${dbConnection}`))

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
}