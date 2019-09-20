const mongoose = require("mongoose");

//create the constructor/"data interface variable" and export it 
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
module.exports.genres = mongoose.model('genre',schema);
module.exports.genreSchema = schema;


