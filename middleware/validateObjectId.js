const mongoose = require("mongoose");

module.exports = (req,res,next) =>{
    !mongoose.Types.ObjectId.isValid(req.params.id) ? res.status(404).send(`Object id : ${req.params.id} not found`) : next();
}