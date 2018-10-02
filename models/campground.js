var mongoose = require("mongoose");

// Building schema for the yelp_camp
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,

    // Put a reference to author model into campSchema using ObjectID
    // The actual data won't persist untill we use populate() method with retrieval.
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // Put a reference to comment model into campSchema using ObjectID
    // The actual data won't persist untill we use populate() method with retrieval.
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            // ref will points to name of the model to which it refers
            ref: "Comment"
        }
    ]
});

// Compile the Schema to Model
module.exports = mongoose.model("Camp", campSchema);