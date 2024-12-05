var express = require('express');
var router = express.Router();
const passport = require("passport");
const User = require('../models/User.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Novia UAS' });
});
router.get('/login', function(req, res, next) {
  if(req.session){
    res.render('auth/login',{ user: req.session.user });
  }else{
    res.render('auth/login',{ user: [] });
  }
  

});


router.get('/register', function(req, res, next) {

  res.render('registerForm', null);

});



//POST Methods

router.post('/submit-login-form', function(req, res, next) {

  const username = req.body.username;

  const password = req.body.password;


  passport.authenticate("local", (err, user, info) => {

    if (err) {

      // Something went bad authenticating user

      return next(err);

    }


    if (!user) {

      // Unauthorized, `info` contains the error messages if needed.

      res.render('login', { user: 'Wrong password or username' });

    }


    // save user in session: req.user

    req.login(user, (err) => {

      if (err) {

        // Session save went bad

        return next(err);

      }

      

      // Session save ok, we are now logged in and `req.user` is now set

      // When we redirect we need to put the handlebars object on the app.locals

      // res.locals only remebers the current request cycle.

      res.app.locals.user = user.username; 

      res.redirect('/');

    });


  })(req, res, next); //This means authenticate() returns a middleware function object, which you can evoke with (req, res, next) parameters to continue the app's request-response cycle.

        


});


// Same route as get because the form do not set an action

router.post('/register', function(req, res, next) {

  const username = req.body.username;

  const password = req.body.password;

  const email = req.body.email;

 

  User.register(new User({username, email}), password, (error, user) => {

    if(error) {

      // Here it is ok to re-render, not to redirect because we do not need to change page!

      return res.render("registerForm", {error} );

    }


    // We could use the default handlers, here we see the full custom handling

    // if our application would like to do some special things

    const authenticator = passport.authenticate("local", (error,user,info) =>  {

      if (error) {

        // Something went bad authenticating user

        return next(error);

      }

    

      if (!user) {

        // Unauthorized, `info` contains the error messages if needed.

      // When we redirect we need to put the handlebars object on the app.locals

      // res.locals only remebers the current request cycle.

      // Here it is ok to re-render, not to redirect because we do not need to change page!

        res.render('registerForm', {error:info} );

        return;

      }

    

      // save user in session: req.user

      req.login(user, (err) => {

        if (err) {

          // Session save went bad

          return next(err);

        }

        

        // Session save ok, we are now logged in and `req.user` is now set

        // In this example we have to set our own username also. Change to what you use.

        res.app.locals.user = user.username; 

        res.redirect('/');

      });

    });


    // ==>  Here we run the authenticator

    authenticator(req,res,next);

  });

});


module.exports = router;
