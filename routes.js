const bcrypt = require('bcrypt');
const passport = require('passport')


module.exports = function(app,myDataBase){
    // Be sure to change the title
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
    res.render('index', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin:true,
      showRegistration:true
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
    res.render('profile',{username:req.user.username});
  })
  app.route('/logout').get((req,res)=>{
      req.logout();
      res.redirect('/')
     })
/*OAuth require you to have at least a Client ID and a Client Secret which is a way 
for the service to verify who the authentication request is coming from and if it is valid */












     // route to register a new user.
     app.route('/register').post((req, res, next) => {
       myDataBase.findOne({ username: req.body.username }, (err, user) => {
         if (err) {
           next(err);
         } else if (user) {
           res.redirect('/');
         } else {
          const hash = bcrypt.hashSync(req.body.password,12)
           myDataBase.insertOne({
             username: req.body.username,
             password: hash
           },
             (err, doc) => {
               if (err) {
                 res.redirect('/');
               } else {
                 // The inserted document is held within
                 // the ops property of the doc
                 next(null, doc.ops[0]);
               }
             }
           )
         }
       })
     },
       passport.authenticate('local', { failureRedirect: '/' }),
       (req, res, next) => {
         res.redirect('/profile');
       }
     );

     app.route('/auth/github').get(passport.authenticate('github'))
     app.route('/auth/github/callback').get(passport.authenticate('github',{failureRedirect:'/'}),(req,res)=>{
      res.redirect('/profile')
     })
       // brcypt
     /*You will need to handle hashing in 2 key areas: 
     where you handle registering/saving a new account, and when you check to see that a password is correct on login */

     app.use((req,res,next)=>{
        res.status(404)
        .type('text')
        .send('Not Found Bro')
       })

     // ensure uthenticated function
    function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };
}