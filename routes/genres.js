const router = require("express").Router();
const {genres} = require("../models/genres");
const isAuthenticated = require("../middleware/auth")
const isAdmin = require("../middleware/admin");
const validatedObjectId = require('../middleware/validateObjectId')

//get all genres
router.get("/api/genres",async (req,res)=>{
    try{
        let retrievedGenres = await genres.find({}); //empty object will get all, note that we still need to pass an empty object as an argument
        return res.status(200).send(retrievedGenres);
    }
    catch(ex){
        console.log(ex);
    }
});

//get specific genre
router.get("/api/genres/:id",validatedObjectId,async (req,res)=>{
    //lookup course using id
    let genre = await genres.findById({_id:req.params.id});    
    return !genre ? res.status(404).send(`The genre with id : ${req.params.id} does not exist`) : res.status(200).send(genre)
});

//create a new genre
router.post("/api/genres",isAuthenticated,async (req,res)=>{
    let body = req.body.name;
    if(body && body.lenth > 5){
        const newGenre = new genres({name:body});
        try{
            let result = await newGenre.save();
            return res.status(200).send(result);
        }
        catch(ex){
            return res.status(500).send("There was an error saving the genre")
        }
    }
    else{
        return res.status(400).send("Name property is required to add a genre");
    }
});


//edit existing genre
router.put("/api/genres/:id",validatedObjectId,isAuthenticated,async (req,res)=>{
    let newName = req.body.name;
    if(newName){
        try{
            let genre = await genres.findByIdAndUpdate(req.params.id,{name:newName});
            let result = await genre.save();
            return res.status(200).send(result);
        }
        catch(ex){
            return res.status(500).send('An unexpected internal error occured');
        }
    }
    else{
        return res.status(400).send("A name is required to update the genre");
    }
});

//delete existing genre
router.delete("/api/genres/:id",[isAuthenticated,isAdmin], async(req,res)=>{
    //lookup course using id
    try{
        let result = await genres.findByIdAndDelete(req.params.id);
        return res.send(result);
    }
    catch(ex){
        return res.status(404).send(`The genre with id : ${req.params.id} does not exist`);
    }
});


module.exports=router;