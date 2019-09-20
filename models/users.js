const mongoose = require("mongoose");
const Joi      = require("joi");
const jwt      = require("jsonwebtoken");
const config   = require("config");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id:this.id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
}

module.exports.users = mongoose.model('user',userSchema)

module.exports.validateUser = (user) =>{
    return Joi.validate(user,{
        name:Joi.string().min(3).max(255).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required(),
        isAdmin:Joi.boolean().required()
    });
}