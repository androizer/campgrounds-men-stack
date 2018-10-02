var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    created: {type: Date, default: Date.now},
    // Association of Users with Comments
    // Passport gives 'req.user' which is currently logged in which have two properties,
    // namely as '_id' & 'username'. So in conjuction with those we will use them and
    // create reference association with comments.
    author: {
        id: {
            // This corresponds to '_id' of 'User' record.
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);