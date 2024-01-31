const express =require("express")
require("dotenv").config()
const session=require("express-session")
const userModel= require('./model/model')
require("./dbConfig")
const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth2").Strategy
const router=require("./router/router")
const port = process.env.port
const app =express()
app.use(express.json())
app.use(session({

   secret: process.env.secret,
    resave: process.env.resave,
    saveUninitialized: process.env.saveUninitialized,
    cookies: {secure:false}
}))
//initialize passport
app.use(passport.initialize())
//integrate passport with our session auth
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientsecret,
    callbackURL: process.env.callbackURL,
 

    //passReqToCallback   : true
  },
 async (request, accessToken, refreshToken, profile, done) =>{
    let user = await userModel.findOne({email: profile.email})
    if (!user) {
        user = await userModel.create({
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email, 
            isVerified: profile.verified,
            profilePicture: profile.picture,
    
        })
        return done(null, user)
    } else {
        return done(null, profile)
    }
    
     
      return done(null, profile);
    
  }
)); 

passport.serializeUser((user, done)=>{
    return done(null, user)
})


passport.deserializeUser((user, done)=>{
    return done(null, user)
})


app.use(router)

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})
