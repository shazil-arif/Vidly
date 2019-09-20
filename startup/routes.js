const genresRouter   = require("../routes/genres");
const homeRouter     = require("../routes/home")
const customerRouter = require("../routes/customers");
const moviesRouter   = require("../routes/movies")
const invalidRoute   = require("../routes/invalid");
const rentalsRouter  = require("../routes/rentals");
const usersRouter    = require("../routes/users");
const authRouter     = require("../routes/auth");
const express        =  require("express");

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(homeRouter);
    app.use(genresRouter);
    app.use(customerRouter);
    app.use(moviesRouter);
    app.use(rentalsRouter);
    app.use(usersRouter);
    app.use(authRouter);
    app.use(invalidRoute);
}