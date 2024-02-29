const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local')
const passport = require('passport')
const { ObjectID } = require('mongodb')


module.exports = function(app,myDataBase){

  //__________________________________________________________________
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
      // my authentication strategy (switch statement)
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
          case !bcrypt.compareSync(password,user.password):
          res = done(null,false)
          break;
        default:
          res = done(null,user)
          break;
      }
      return res
    })
    }))
}