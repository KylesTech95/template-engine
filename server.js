'use strict';
const routes = require('./routes.js')
const auth = require('./auth.js')
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
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
  routes(app,myDataBase)
  auth(app,myDataBase)
  // Be sure to add this...
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
