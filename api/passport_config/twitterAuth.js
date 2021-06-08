const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const fs = require('fs');

const User = require('../users/users.model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use("sign-up-twitter",new TwitterStrategy(
    {
      consumerKey: process.env.API_KEY,
      consumerSecret: process.env.API_SECRET_KEY,
      callbackURL: `https://karmic-koala-backend.vercel.app/auth/twitter/login`
    },
    async (token, tokenSecret, profile, done) => {
      const id = JSON.parse(fs.readFileSync('../id.json'))._id;
      const user = await User.findOneAndUpdate({_id:id},{tokenTwitter:token,tokenSecretTwitter:tokenSecret});// si existe en la base de datos

      if (user) {
        console.log('AKi twitter y user')
        done(null, user)
      } else {
        console.log('AKi twitter y 404')
        done(null, false)
      }
      
    }
  )
);
  