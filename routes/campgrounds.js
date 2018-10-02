var express         = require("express"),
    router          = express.Router(),
    methodOverride  = require("method-override"),
    Camps           = require("../models/campground"),
    middleware      = require("../middleware")

// Use method override to use some more http protocols like put, delete etc.
router.use(methodOverride("_method"))

// ================
// CAMPGROUND ROUTES
// ================

router.get("/campgrounds", middleware.isUserLoggedIn, function (req, res) {
    Camps.find({}, function (error, campArray) {
        if (error) {
            console.log("Error occured while retrieving campData from DB");
            console.log(error);
        } else {
            console.log("Getting all campgrounds")
            res.render("campgrounds\\index", { campData: campArray});
        }
    });
});

router.post("/campgrounds", function (req, res) {
    // This will get the name of input from where this page is called.
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        }
        newCamp = { name: name, image: image, description: desc, author: author };
    Camps.create(newCamp, function (error, newCamp) {
        if (error) {
            console.log("Error updating DB with this new element");
            console.log(error);
        } else {
            // Render back to campgrounds (get) request.
            req.flash("success", "Successfuly created campground.")
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new", middleware.isUserLoggedIn, function (req, res) {
    res.render("campgrounds\\new");
});

router.get("/campgrounds/:id", middleware.isUserLoggedIn, function (req, res) {
    // This populate and exec will help us the populate the comments inside the campground data
    // and execute the query. Initially it was only the id's it was holding. So in order to refer
    // id with corresponding comments id's, we use this.
    console.log("Binding campgrounds with comments model");
    Camps.findById(req.params.id).populate("comments").exec(function (error, camp) {
        if (error) {
            console.log("Error while populating campgrounds.")
            console.log(error);
        } else {
            res.render("campgrounds\\show", { campground: camp });
        }
    });
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // Authorization
    Camps.findById(req.params.id, function(error, campFound) {
        if (!error) {
            res.render("campgrounds\\edit", {campground : campFound})
        }        
    })
})

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Camps.findByIdAndUpdate(req.params.id, req.body.updated, function(error, updatedCamp) {
        if (!error) {
            req.flash("success", "Successfully updated the campground.")
            res.redirect("/campgrounds/" + req.params.id)            
        }
    })
})

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Camps.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            console.log(error)
            req.flash("error", "Something went wrong while deleting this campground.")
            res.redirect("back")
        } else {
            req.flash("success", "Successfully deleted the campground.")
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;