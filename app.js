var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require("passport");
const mongoose = require('mongoose');
const User = require("./models/User.js");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// session setup

app.use(session({

  secret: "oursupersecretsecret",

  resave: true,

  saveUninitialized: true

}));

// Passport setup

app.use(passport.initialize());

app.use(passport.session());

passport.use(User.createStrategy()); // See the explanation in the moodle documentatio!

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());



//mogo setup
//mongodb://localhost:27017/testDB
const dbHost = '127.0.0.1'; //'127.0.0.1' is the local machine IP, you can also use the string 'localhost'

const dbPort = '27017' // standard port that MongoDB server service is listening to.

const dbName = 'webnotesDB';

const connectionUrl = 'mongodb://' + dbHost + ':' + dbPort; // creates the string 'mongodb://localhost:27017'

const dbURI = connectionUrl + '/' + dbName;

// Connect to the database and seed the database with some users

let theDatabaseConnection =null; // If needed we can access it through this variabel, need to check if not null of course

mongoose.connect(dbURI)

  .then( () => {

    console.log('Mongoose connected to ' + dbURI);

    theDatabaseConnection = mongoose.connection;

    theDatabaseConnection.on('disconnected', () => {

        console.log('Mongoose disconnected');

    });


    // Initialize database

    const users = User.find({});

    users.then( (userDocs) => {

        if(userDocs.length == 0) {

            /* REGISTER SOME USERS */

            User.register({username:'admin', active: false}, 'admin');

            User.register({username:'quest', active: false}, 'quest');

            User.register({username:'user', active: false}, 'user');

        }

    });

  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
