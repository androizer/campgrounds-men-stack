var Comment = require("../models/comment")
var Camps = require("../models/campground")
var middleWareObject = {}

middleWareObject.checkCommentOwnership = 

// Authorization middleware on comment edit and delete (get and post)
function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            if (error) {
                req.flash("error", error.message)
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "Oops! Something went wrong.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need proper ownership to perform this task.")
        res.redirect("back")
    }
}

middleWareObject.checkCampgroundOwnership = 
// Authorization on campground edit and delete (get and post)
function (req, res, next) {
    if (req.isAuthenticated()) {
        Camps.findById(req.params.id, function(error, foundCampground) {
            if (error) {
                req.flash("error", error.message)
                res.redirect("back")
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "Oops! You don't have authorization to do so.")
                    res.redirect("/campgrounds/" + req.params.id)
                }
            }         
        })
    } else {
        req.flash("error", "You need proper ownership to perform this task.")
        res.redirect("back")
    }
}

middleWareObject.isUserLoggedIn = 
// Authentication middleware if the user is logged in or not.
function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash("error", "Please login, in order to perform the desired task.")
        res.redirect("/login")
    }
}

module.exports = middleWareObject;