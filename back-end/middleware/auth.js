const User=require("../models/signupdb")
const jwt=require("jsonwebtoken")


exports.userAuthontication=async (req,res,next)=>{
  try{
      const token=req.header("Authorization")
    const user=jwt.verify(token,"32204kahfkbkkcy9429hshksky2939hcsd")
    const data=await User.find({"_id":user.userId})
    req.user=data
    next()
  }catch(err){
    console.log("error in auth",err)
    res.json({Error:err})
  }
  
}