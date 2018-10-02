var mongoose        = require("mongoose");
    localMongoose   = require("passport-local-mongoose")

userSchema = new mongoose.Schema({
    username: String,
    password: String
})

// This will help in managing hash, salt etc.
userSchema.plugin(localMongoose)

module.exports = mongoose.model("User", userSchema)