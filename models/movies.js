const mongoose = require("mongoose");
const {genreSchema} = require("./genres");
module.exports = mongoose.model('movie',new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:255
    },
    numberInStock:{
        type:Number,
        default:0,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    genre:{
        type:genreSchema,
        required:true
    }
}));