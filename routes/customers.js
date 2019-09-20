const customer = require("../models/customers");
const router = require("express").Router();
const Joi = require("joi");
const isAuthenticated = require("../middleware/auth");


//get all customers
router.get("/api/customers",async(req,res)=>{
    try{
        let customers = await customer.find({});
        res.status(200).send(customers)
    }
    catch(ex){
        res.status(500).send("Unexpected error occured")
    }
});

//get specific customer
router.get("/api/customers/:id",async (req,res)=>{
    let id = req.params.id
    try{
        let retrievedCustomer = await customer.findById(id);
        !retrievedCustomer ? res.status(404).send(`Customer with id: ${id} does not exist`) : res.status(200).send(retrievedCustomer);       
    }
    catch(ex){
        res.status(404).send(`Customer with id: ${id} does not exist`)
    }
});

//make new customer
router.post("/api/customers",isAuthenticated,async(req,res)=>{
    // let id = req.params.id;
    let customerInfo = req.body;
    const {error} = validateCustomer(customerInfo);
    if(error){
        res.status(400).send("Name and Phone number are required")
    }
    else{
        let newCustomer = new customer(customerInfo);
        try{
            let result = await newCustomer.save();
            res.status(200).send(result);
        }
        catch(ex){
            res.status(500).send("Unexpected error saving customer");
        }
    }
});

//edit any customer
router.put("/api/customers/:id",isAuthenticated, async (req,res)=>{
    let id = req.params.id;

    let customerInfo = req.body;
    const {error} = validateCustomer(customerInfo);
    if(error){
        res.status(400).send("Name and Phone number are required to update customer")
    }
    else{
        try{
            let result = await customer.findByIdAndUpdate(id,customerInfo);
            // res.status(200).send(result);
            res.send(result);
        }
        catch(ex){
            res.status(400).send(`Customer with id : ${id} does not exist`)
        }
    }
});

//delete a customer
router.delete("/api/customers/:id",isAuthenticated, async (req,res)=>{
    let id = req.params.id;
    
    try{
        let result = await customer.findByIdAndDelete(id);
        res.status(200).send(result)
    }
    catch(ex){
        res.status(500).send(`Customer with id: ${id} does not exist`)
    }
})

const validateCustomer = (customer) =>{
    const schema = {
        name:Joi.string().required(),
        phone:Joi.string().required()
    }
    return Joi.validate(customer,schema)
}

module.exports=router