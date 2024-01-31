const Joi=require("joi")
const userModel=require("../model/model")
const bcrypt=require("bcrypt")
const passport=require('passport')


exports. homepage=async(req,res)=>{try {

    if(req.session.user){
       
        const user=await userModel.findOne({email:req.session.user.username})
    res.json(`Welcome, ${user.firstName} ${user.lastName}, feel free to explore my api `)
    }
    else{
        res.json("you are not authenticated,please log in to perform this action")  
    }
    console.log(req.session)
} catch (error) {
   res.json(error.message) 
} 
    
}


exports. createUser=async(req,res)=>{
    try {
//valide users
const validateSchema=Joi.object({

    firstName:Joi.string().required().min(3).max(30).regex(/^[a-zA-Z]+$/).messages(
        {  "String.pattern.base":"KIndly  use alphabet alone "}
    ),
    
lastName:Joi.string() .required().min(3).max(30).regex(/^[a-zA-Z]+$/).messages(
    {  "String.pattern.base":"KIndly  use alphabet alone "}
),
passWord:Joi.string() .min(6).required().max(30).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).messages(
    {  "String.pattern.base":" password must contain uppercase,lowercase and special character  "}
),
email:Joi .string().email().required(),
 
gender:Joi.string().valid("male","female")
    

})
        

const data={

firstName:req.body.firstName,
lastName:req.body.lastName,
email:req.body.email.toLowerCase(),
passWord:req.body.passWord,
gender:req.body.gender

}
//validate my data
 
const {error}=validateSchema.validate(data)


if(error){
  return res.json(error.details[0].message)
} 
const hashedPassWord= await bcrypt.hashSync(req.body.passWord,await bcrypt.genSalt(10))
//hash my password

console.log(data.passWord)

data.passWord=hashedPassWord


const createduser=await userModel.create(data)

res.status(200).json({
message:"Success",
status:true,
data:createduser

}) 
    } catch (error) {
        res.status(500).json(error.message)
    }
}


exports.logIn =async(req, res)=>{
    try {
        const {email, passWord} = req.body
        const checkUser = await userModel.findOne({email})
        if(!checkUser){
            return res.status(404).json('User not Found')
        }
        const checkPassword =await bcrypt.compareSync(passWord, checkUser.passWord)
        if(!checkPassword){
            return res.status(400).json('Incorrect password')
        }
const username=checkUser.email
        req.session.user = { username}
        res.status(201).json({
            message: 'Login Successful',
            checkUser
        })
     
    } catch (error) {
        res.status(500).json(error.message)
    }
}

//exports.socialAuth=

 //exports.callBack = 

exports.logOUT = (req, res) => {
    req.session.destroy()
    res.json({success: true, message: 'Logged out successfully'})
}