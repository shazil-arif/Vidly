const router = require("express").Router();
const {rentals} = require("../models/rentals");
const {validateRental} = require("../models/rentals");
const customers = require("../models/customers");
const movies = require("../models/movies");
const isAuthenticated = require("../middleware/auth")

//get all rentals
router.get('/api/rentals', async(req,res)=>{
    try{
        let retrievedRentals = await rentals.find({}).sort('-dateOut');
        if (!retrievedRentals) return res.send("An error occured");
        retrievedRentals.length === 0 ? res.send("No Current rentals") : res.status(200).send(retrievedRentals);
    }
    catch(ex){
        return res.status(500).send("Unexpected Error occured");
    }
});

//get specific rental
router.get('/api/courses/:id', async(req,res)=>{
    let id = req.params.id;
    try{
        let rental = await rentals.findById(id);
        !rental ? res.send(`Rental with id: ${id} does not exist`) : res.status(200).send(rental);
    }
    catch(ex){
        return res.status(404).send(`Rental with id: ${id} does not exist`)
    }
})

//create new rental
router.post('/api/rentals',isAuthenticated,async(req,res)=>{
    //a user will only send their customer id and a movie id to create a rental
    let newRental = req.body;
    let {error} = validateRental(newRental);
    if(error) return res.status(400).send(error.details[0].message);

    let customer,movie;
    try{
        customer = await customers.findById(req.body.customerId);
        movie = await movies.findById(req.body.movieId);

        if(!customer) return res.status(404).send(`Customer with id : ${req.body.customerId} does not exist`);
        if(!movie) return res.status(404).send(`Movie with id : ${req.body.movieId} does not exist`)
    }
    catch(ex){
        return res.send("Unexpected error occured, the customer id or movie id may have been invalid")
    }

    if (movie.numberInStock === 0) return res.send(`${movie.title} is out of stock`)

    let rental = new rentals({
        customer: {
            _id: customer._id,
            name: customer.name, 
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try{
        let result = await rental.save();
        if(!result) return res.status(500).send("Unexpected error saving")

        movie.numberInStock--;

        await movie.save();
        return res.send(result);
    } 
    catch(ex){
        return res.status(500).send("Unexpected Error saving")
    }
});

module.exports = router;