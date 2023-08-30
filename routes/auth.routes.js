const express = require('express');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require("../models/User.model");

const router = express.Router();

const saltRounds = 10;


// GET /signup (display form)
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
})


// POST /signup (process form)
router.post("/signup", (req, res, next) => {
    /*
    
    x get data from "req.body"
    x generate salt
    x generate hash
    x prepare an object
    x User.create(obj)
    
    */

    const {email, password} = req.body;

    if(!this.email || !password){
      res.status(400).render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }
    
    // validation: pw strength
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }


    bcryptjs.genSalt(saltRounds)
        .then( salt => bcryptjs.hash(password, salt))
        .then( hash => {
            const newUser = {
                email: email,
                passwordHash: hash
            }

            return User.create(newUser);
        })
        .then( userFromDB => {
          //acount created successfully
            res.redirect("/user-profile")
        })
        .catch( error => {
            console.log("error creating user account... ", error);
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(400).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(400).render('auth/signup', { errorMessage: "Validation error. Email needs to be unique" });
            } else {
                console.log("it failed but not a mongoose error....")
                next(error);
            }
        })

})
router.get("/user-profile",(req, res, next)=>{
  res.render("auth/user-profile")
})
module.exports = router;
