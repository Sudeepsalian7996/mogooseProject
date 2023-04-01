const signupdb=require("../models/signupdb")
const encrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

//sign up page
exports.signup=async(req,res)=>{
   try{
      const name=req.body.name
      const email=req.body.email
      const password=req.body.password
      if(email==="" || password==="" || name===""){
         return res.json({success:false,message:"Fill all the fields"})
      }
      if(password.length<8){
        return res.json({success:false,message:"password must contains atleast 8 characters"})
      }
      encrypt.hash(password,10,async(err,hash)=>{
         if(err){
            console.log("encryption error-->",err)
            
         }
         
          const emailUnique=await signupdb.find({"email":email})
          console.log("mongodb email checking-->",emailUnique)   

         if(emailUnique.length!==0){
            return res.json({success:false,message:"user already exist,change the Email"})
         }

           const data= new signupdb({
            name:name,
            email:email,
            password:hash 
           })
           await data.save()
           res.json({success:true,message:"SignUp successfull,Login to enter a page"})
      })
   
   }catch(err){
      console.log("signup err")
      res.json({success:false,message:"User already exist..please signup with new Email and Password"})
   }
  
}

//creating tokens
function createToken(id,premium){
   return jwt.sign({userId:id,isPremium:premium},"32204kahfkbkkcy9429hshksky2939hcsd")
}

//Login page
exports.login=async(req,res)=>{
   try{
      const email=req.body.email
      const password=req.body.password
      if(email==="" || password===""){
         return res.json({message:"Email or password missing"})
      }

      const emaildb=await signupdb.find({"email":email})
      if(emaildb.length>0){
         encrypt.compare(password,emaildb[0].password,(err,result)=>{
            if(err){
               throw new Error("Something went wrong in decypting password")
            }
            
            if(result===true){
               res.json({success:"login Successfully Done",token:createToken(emaildb[0].id,emaildb[0].premium)})
               
            } else{
               res.json({message:"Password is incorrect.."})
            }
         })
      }
     else{
         res.json({message:"User does not exist"})
      }
 
   }catch(err){
      console.log("error in login BE")
      res.json({Error:err})
   }
}

