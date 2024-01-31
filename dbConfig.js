const mongoose=require("mongoose")

require("dotenv").config()
mongoose.connect(process.env.db).then(()=>{
    console.log("Db connection established")
}).catch((error)=>{
    console.log(error+"Unable to connect") 
})
