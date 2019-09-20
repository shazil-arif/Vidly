const router = require("express").Router();
module.exports = router.get("*",(req,res)=>res.send("This URL does not exist"))
