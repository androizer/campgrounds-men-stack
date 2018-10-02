var mongoose = require("mongoose");
var campGround = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Mountain Goat's Rest",
        image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Family's Reunion Camping",
        image: "https://farm6.staticflickr.com/5227/5878843468_81b9ffab65.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Forest Gump Camping",
        image: "https://farm3.staticflickr.com/2746/4089581511_96cece40d5.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Cozy With Tents",
        image: "https://farm4.staticflickr.com/3185/2677193999_7490d5bcf5.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seedDB() {
    campGround.remove({}, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Campgrounds data dropped.");
            Comment.remove({}, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Comments data dropped.")
                    data.forEach(function (seed) {
                        //Create campground and its corresponding comment.
                        campGround.create(seed, function (error, campCreated) {
                            if (!error) {
                                console.log("Campground data is added to db with id: " + campCreated.id);
                                Comment.create({
                                    text: "This place is great, but I wish they would have internet! :(",
                                    author: "Akki"
                                }, function (error, commentCreated) {
                                    if (!error) {
                                        campCreated.comments.push(commentCreated._id);
                                        campCreated.save();
                                        console.log("Comment is added to respective campground db with id: " + campCreated.id);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDB;