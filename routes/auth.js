const router = require("express").Router();
const {users} = require("../models/users");
const bycrypt = require("bcrypt");
const Joi = require("joi");

router.post("/api/auth",async(req,res)=>{
    let newUser = req.body;
    let {error} = validateAuthUser(newUser);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        let user = await users.findOne({email:req.body.email});
        if(!user) return res.status(400).send({
            isLoggedIn:false,
            status:`Invalid email or password`
        });

        try{
            const isValidPassword = await bycrypt.compare(req.body.password,user.password);
            if(!isValidPassword) return res.status(400).send({
                isLoggedIn:false,
                status:`Invalid email or password`
            });

            const token = user.generateAuthToken();
            res.header('x-auth-jwtToken',token).send({
                isLoggedIn:true,
                status:"Successful"
            });
        }
        catch(ex){
            return res.status(500).send({
                isLoggedIn:false,  
                status:"Unexpected Error occured",
            });
        }
    }
    catch(ex){
        return res.status(500).send({
            isLoggedIn:false, 
            status:"Unexpected Error occured", 
        })
    }    
});


const validateAuthUser = (user) =>{
    return Joi.validate(user,{
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required()
    });
}

module.exports = router;