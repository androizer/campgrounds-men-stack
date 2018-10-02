var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    localMongoose   = require("passport-local-mongoose"),
    camps           = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/users"),
    seedDB          = require("./seeds"),
    flash           = require("connect-flash"),
    app             = express()

// Various routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    authRoutes          = require("./routes/authorization")

// Using body parser.
app.use(bodyParser.urlencoded({ extended: true }));

// Setting view engine as 'ejs'.
app.set("view engine", "ejs");

// Make public directory to use stylesheets and custom js files.
// __dirname corresponds to the location from where this very file
// is executing.
app.use(express.static(__dirname + "/public"));

// Use of flash messages.
app.use(flash())

// These configuration should be in the same exact order.
{
    // Express Session configuration.
    app.use(require("express-session")({
        // secret property will be used to encode and decode the sessions.
        secret: "This text will be used to hash password",
        resave: false,
        saveUninitialized: false
    }))

    // Passport mandatory configuration.
    {
        // Passport authentication
        app.use(passport.initialize())
        // Persistent login sessions
        app.use(passport.session())
    }
}

// Reading the session, taking the data from session and convert the encoded one.
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to get the current username that is logged in and send it all the routes templates.
// 'currentUser' in 'res.locals.currentUser' acts as a global variable whose scope is through out
// the template.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    res.locals.errorMessage = req.flash("error")
    res.locals.successMessage = req.flash("success")
    next()
})

// Using routes
app.use(campgroundRoutes)
app.use(commentRoutes)
app.use(authRoutes)

// Connect to MongoDB Server
mongoose.connect("mongodb://localhost/yelp-camp-v10");

// Calling the function from seeds.js file which will add sample campgrounds and comments.
// seedDB();

// Listen to localhost at 3000 port.
app.listen(3000, function () {
    console.log("Yelp Camp App is started!!");
});