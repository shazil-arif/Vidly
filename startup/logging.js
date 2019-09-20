const winston = require("winston");

module.exports = () =>{
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({filename:"logfile.log",level:'error'}))

    process.on('uncaughtException',(ex)=>{
        winston.error(ex)
        winston.error(ex.message);
        process.exit(1);
    });

    process.on('unhandledRejection',(ex)=>{
        winston.error(ex)
        winston.error(ex.message)
        process.exit(1)
    });
}