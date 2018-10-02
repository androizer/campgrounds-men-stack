var express     = require("express"),
    router      = express.Router(),
    Camps       = require("../models/campground"),
    Comment     = require("../models/comment"),
    // Express will automatically require 'index.js' file from a directory.
    // So no need to mentioning it explicitly.
    // middleware is requiring from a 'index.js' file inside 'middleware' directory.
    middleware  = require("../middleware")

// ================
// COMMENT ROUTES
// ================

// Logic for rendering new comment form.
router.get("/campgrounds/:id/comments/new", middleware.isUserLoggedIn, function (req, res) {
    // check if the id is legal or not.
    Camps.findById(req.params.id, function (error, campground) {
        if (error) {
            res.send(error);
        } else {
            res.render("comments\\new", { campground: campground });
        }
    });
});

// Logic for adding new comment into db.
router.post("/campgrounds/:id/comments", middleware.isUserLoggedIn, function (req, res) {

    Camps.findById(req.params.id, function (error, campFound) {
        if (error) {
            res.send(error);
        } else {
            console.log("Campground before adding: " +campFound);
            Comment.create(req.body.comment, function (error, commentCreated) {
                if (error) {
                    console.log(error)
                    req.flash("error", "Oops! Something went wrong while creating comment.")
                    res.redirect("back")
                } else {
                    // Comment is created and the author object will be assigned particular values
                    // from 'req.user' provided by passport.
                    commentCreated.author.id = req.user._id;
                    commentCreated.author.username = req.user.username;
                    // Save the comment.
                    commentCreated.save();
                    // This saved comment's '_id' is pushed to campFound and hence saved.
                    campFound.comments.push(commentCreated._id);
                    campFound.save();
                    console.log("Campground after adding: " +campFound);
                    req.flash("success", "Successfully added new comment.")
                    res.redirect("/campgrounds/" + campFound._id);
                }
            });
        }
    });
});

// Logic for editing comment in edit form.
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){

    Comment.findById(req.params.comment_id, function(error, foundComment) {
        if (error) {
            req.redirect("back")
        } else {
            res.render("comments\\edit", {comment : foundComment, campgroundID: req.params.id})
        }
    })
})

// Logic for updating comment into db.
router.post("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment) {
        if (error) {
            console.log("Error occured while updating comment")
            req.flash("error", "Something went wrong while updating comment.")
            res.redirect("back")
        } else {
            req.flash("success", "Successfully updated the comment.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Logic for deleting comment from db.
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(error) {
        if (error) {
            console.log("Error while removing comment from database.")
            req.flash("error", "Something went wrong while removing comment.")
            res.redirect("back")
        } else {
            req.flash("success", "Successfully deleted the comment.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router;