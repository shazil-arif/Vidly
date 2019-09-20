const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    isGold:{
        type:Boolean,
        default:false
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("customer",Schema);