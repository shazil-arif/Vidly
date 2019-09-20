const router = require("express").Router();
const {users,validateUser} = require("../models/users");
const _ = require("lodash");
const bycrypt = require("bcrypt");
const isAuthenticated = require("../middleware/auth");

router.get('/api/users/me',isAuthenticated,async(req,res)=>{
    try{
        let user = await users.findById(req.user._id);
        if(user){
            user = _.pick(user,['email','name','isAdmin'])
            return res.status(200).send(user);
        }
        return res.status(500).send('Unexpected error occured');
    }
    catch(ex){
        console.log(ex);
        return res.status(500).send('Unexpected error occured');
    }
})

router.post("/api/users",async(req,res)=>{
    let newUser = req.body;
    let {error} = validateUser(newUser);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        let user = await users.findOne({email:newUser.email});
        if(user) return res.status(400).send(`User with email : ${newUser.email} already exists`);
      
        try{
            user = new users(_.pick(req.body, ['name', 'email', 'password']));

            const salt = await bycrypt.genSalt(10);
            user.password = await bycrypt.hash(user.password,salt);

            let result = await user.save();
            if(!result) return res.status(500).send("Unexpected error saving user");

            const token = user.generateAuthToken();
            res.header('x-auth-jwtToken',token).send(_.pick(result,['name','email','_id']));
        }
        catch(ex){
            return res.status(500).send("Unexpected error. Please retry")
        }
    }
    catch(ex){
        return res.status(500).send("Unexpected Error finding user")
    }    
});

module.exports = router;