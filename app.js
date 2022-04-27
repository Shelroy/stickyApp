//jshint esversion:
require('dotenv').config();
const express = require ("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const { resolveSoa } = require("dns");
const mongoose = require("mongoose");
const { MongoDBNamespace } = require("mongodb");
const session = require ("express-session");
const path = require('path');
const uri = process.env.MONGODB_URI;

// FOR PRODUCTION EVENROMENT
// const session = require ("cookie-session");
const passport =  require("passport");
// this module will salt and hash our passwords
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const date = require (__dirname + "/date.js");
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;

const MongoStore = require('connect-mongo');

const cors = require("cors");
const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new JwtStrategy(options, (payload,done)=>{
    
    User.findOne({ _id:payload.sub})
    .then((user)=>{
        if(user){
            return done (null, user);
        }
else {
    return done (null, false);
}
    })
    .catch(err => done(err, null));
    
});
module.exports = (passport) =>{
    passport.use(strategy);
}

const app = express();
let day = date();

app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
// allows the client and server to communicate on different ports 

app.use(cors());

// Use mongoose to connect to database.


mongoose.connect(process.env.DB_INFO);

// mongoose.connect("mongodb://localhost:27017/userDB");



// create database schema 
const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    googleId : String
});

const notesSchema = new mongoose.Schema({
    note_user_id:String,
    title : String,
    content : String

})
// use to hash and salt our passwords
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Use Schema to create USER Model, this will allow use to add users to this model

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

const Note = new mongoose.model("Note", notesSchema);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// setup our session
app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized:true,
    expires: 36000000,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
    store: MongoStore.create({mongoUrl:provess.env.MONGODB_URI})
}));


// tell our app to use passport and initialize the passport package
app.use(passport.initialize());
// tell the app to use passport to setup session
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use(require('./routes'));


// inset notes into database 
app.post("/add", (req, res) =>{
        const {userID} = require("./routes/users");
        
        const newNote = new Note({

        note_user_id :userID,

        title:req.body.title,
        content:req.body.content
        })

Note.insertMany(newNote, (err)=>{
if(err){
    console.log(err);
}else{
    console.log("success");
}
})
})
app.get("/select", function(req,res){
    const {userID} = require("./routes/users");
    Note.find({note_user_id: userID}, (err, foundNotes)=>{
    if(err){
        console.log(err);
    }else{
        res.send(JSON.stringify(foundNotes))    

}
})
});

app.post("/delete", function (req,res){
    const noteID = req.body.id;
    Note.findByIdAndRemove(noteID, function(err){
        if(!err){
            console.log("Successfully deleted Item");
        }
    });
});
// get all the documents from D


app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/budget");
  });

app.get("/login", function(req,res){
    res.render("login",{
        currentDate:day
        
    });
});
app.get("/register", function(req,res){
    res.render("register",{
        currentDate:day
    });
});
// checks to see if user is authenticated then redirect them to the home pafe
app.get("/budget", function(req,res){
    if(req.isAuthenticated()){
        res.render("budget",{
            currentDate:day
        });
    }else{
        res.redirect("/login")

    }
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");

});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    }

// app.use(express.static(`${__dirname}/client/build`));


let port = process.env.PORT || 5000;
// let port =  5000;


app.listen(port, function(){
    console.log("Server started successfully.");
});
