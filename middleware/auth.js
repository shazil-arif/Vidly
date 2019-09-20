const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req,res,next) => {
    const token = req.header('x-auth-jwtToken');
    if(!token) return res.status(401).send("Access denied. No token provided")
    
    try{
        //the decoded payload contains what was originally encrypted an object containing the user's id
        const decodedPayload = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decodedPayload; //we set a user field equal to the object containing the id
        next();
    }
    catch(ex){
        return res.status(400).send("Bad Request. Invalid Token")
    }
}