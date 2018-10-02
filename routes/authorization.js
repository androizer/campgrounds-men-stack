var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/users")

// Landing page
router.get("/", function (req, res) {
    res.render("landing");
    // res.redirect("/campgrounds")
});

// ====================
// AUTHORIZATION ROUTES
// ====================

// Register form
router.get("/register", function(req, res) {
    res.render("users\\register")
}) 

router.post("/register", function(req, res) {
    // Register method will simply add the username to the User database, but the raw password
    // is not a secure way to store. So we will pass it as a seperate argumennt so that secret
    // string will hash it and stores it in the database and the collection of bunch of random
    // numbers and characters. 
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("/register")
        } else {
            // Authenticate method will log the user in and save the session and use the local
            // strategy. Strategies like: local, twitter, facebook, google etc. 
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to YelpCamp " + user.username)
                res.redirect("/campgrounds")
            })
        }
    })
})

// Login form
router.get("/login", function(req, res) {
    res.render("users\\login")
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), function(req, res) {
    req.flash("success", "Welcome to YelpCamp " + req.body.username)
    res.redirect("/campgrounds")
})

router.get("/logout", function(req, res) {
    req.logout()
    req.flash("success", "Successfully logged you out.")
    res.redirect("/")
})

module.exports = router;