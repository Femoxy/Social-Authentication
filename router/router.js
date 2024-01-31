const router=require("express").Router()
const {createUser,homepage, logIn, logOUT}=require("../controller/userController")

const passport=require("passport")
router.get("/",homepage)
router.post("/signup",createUser)
router.get("/sociallogin", async(req, res)=>{
    res.redirect("http://localhost:4455/auth/google")
})
router.post('/signOUT', logOUT)
 
//const passport = require('passport')

router.get("/auth/google", passport.authenticate("google", {scope:["email", "profile"]}))

router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect:"/auth/google/success",
   failureRedirect:"/auth/google/failure"
}))

//router.get("/auth/google/callback", socialAuth)

router.get("/auth/google/success", (req, res)=>{
    const username=req.user.email

    req.session.user={username}
    res.json("User authenticated")

    //console.log(req.session.user.username)
    console.log(req.user)
})

 
module.exports=router
