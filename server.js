'use strict';
const { ObjectID } = require('mongodb');
const LocalStrategy = require('passport-local')
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session')
const passport = require('passport')
const punycode = require('punycode');

const app = express();
// express session
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true,
  cookie:{secure:false}
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','pug')
app.set('views','./views/pug')
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// database connection reply
myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  // Be sure to change the title
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin:true
    });
  });

  // routes
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  })
  app.route('/profile').get(ensureAuthenticated, (req,res) => {
    res.render('profile');
 });



  app.route('/profile').get((req,res) => {
    res.render('profile');
  })

  // Serialization and deserialization here...
// serializeUser & deserializeUser
passport.serializeUser((user,done)=>{
  done(null,user._id)
})
passport.deserializeUser((id,done)=>{
  findById
  myDB.findOne({_id:new ObjectID(id)},(err,done)=>{
    done(null,doc)
  })

})

// localstrategy
passport.use(new LocalStrategy((username,password,done)=>{
  myDataBase.findOne({username:username},(err,user)=>{
    console.log(`User ${username} attempted to log in.`);
    // if(err)return done(err)
    // if(!user)return done(null,false)
    // if(password!==user.passwprd) return done(null,false)
    let res;
    switch(true){
      case err:
        res=done(err);
        break;
      case !user:
        res=done(null,fase);
        break;
      case password!==user.password:
        res = done(null,false);
        break;
      default:
        res = done(null,user)
        break;
    }
    return res
  })
  }))
  // Be sure to add this...
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});

// ensure uthenticated function
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
