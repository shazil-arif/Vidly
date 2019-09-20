const router = require("express").Router();
const isAuthenticated = require("../middleware/auth")
const movies = require("../models/movies");
const {genres} = require("../models/genres");
const Joi = require("joi");


//get all movies
router.get("/api/movies",async(req,res)=>{
    try{
        let retrievedMovies = await movies.find({});
        return retrievedMovies.length > 0 ? res.status(200).send(retrievedMovies) : res.status(200).send("No movies to show")
    }
    catch(ex){
        return res.status(500).send("Unexpected error fetching movies...Please retry")
    }
});

//get specific movie
router.get("/api/movies/:id", async(req,res)=>{
    let id = req.params.id;
    try{
        let movie = await movies.findById(id);
        return !movie ? res.status(404).send(`Movie with id: ${id} does not exist`) : res.status(200).send(movie);       
    }
    catch(ex){
        return res.status(404).send(`Movie with id: ${id} does not exist`)
    }
});

router.post("/api/movies", isAuthenticated,async(req,res)=>{
    //in this route we have to validate the clients request
    //once it is validated we also have to take the genre id and verify if it matches a genre and get its name
    let newMovie = req.body;
    let {error} = validateMovie(newMovie,false);

    if(error) return res.status(400).send(error.details[0].message);

    //get the genre from the genreId
    let retrievedGenre;
    try{
        retrievedGenre = await genres.findById(req.body.genreId);
        if (!retrievedGenre) return res.status(404).send("Invalid genre");
        let movie = new movies({
            title:req.body.title,
            genre:{
                _id:retrievedGenre.id,
                name:retrievedGenre.name
            },
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
        });
        
        try{
            let result = await movie.save();
            return res.status(200).send(result);
        }
        catch(ex){
            return res.status(500).send("Unexpected error adding movie");
        }
    }
    catch(ex){
        return res.status(404).send("Invalid Genre")
    }
});

router.put("/api/movies/:id",isAuthenticated,async(req,res)=>{
    //similar logic to post route
    let newMovie = req.body;

    let {error} = validateMovie(newMovie,true);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //note that result will contain the object that is updated, NOT the updated object itself
        const result = await movies.findByIdAndUpdate(req.params.id,newMovie);

        return (!result) ? res.status(404).send(`Movie with id : ${req.params.id} does not exist`) : res.status(200).send(result);
    }
    catch(ex){
        return res.send("Unexpected error. Please retry")
    }
});

router.delete("/api/movies/:id", isAuthenticated,async(req,res)=>{
    let id = req.params.id;
    try{
        let result = await movies.findByIdAndDelete(id);
        return !result ? res.status(404).send(`Movie with id: ${id} does not exist`) : res.status(200).send(result);     
    }
    catch(ex){
        return res.status(404).send(`Movie with id: ${id} does not exist`)
    }
})

const validateMovie = (movie,isPutRequest) =>{
    let genreIdValue;
    isPutRequest ? genreIdValue = Joi.objectId() : genreIdValue =  Joi.objectId().required();
    return Joi.validate(movie,{
        title:Joi.string().required(),
        numberInStock:Joi.string().default(0),
        dailyRentalRate:Joi.number().min(0).max(255).required(),
        genreId:genreIdValue
    });
}

module.exports = router;