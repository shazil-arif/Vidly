const router = require("express")();

module.exports = router.get("/",(req,res)=>{
    res.send("Welcome to Vidly");
});