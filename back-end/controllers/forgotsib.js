const sib=require("sib-api-v3-sdk")
const uuid=require("uuid")
const encrypt=require("bcrypt")
const user=require("../models/signupdb")
const forgotpassword=require("../models/forgotPassworddb")
require("dotenv").config()


exports.forgotpassword=async(req,res)=>{
    try{
        const email=req.body.email   
        const userFound=await user.find({email:email})
        if(userFound){
            // console.log(userFound.__proto__)
                const id=uuid.v4()
                // await userFound.createForgotPassword({
                //         id,
                //         isactive:true
                // })
                const createForgot=new forgotpassword({
                    _id:id,
                    isactive:true,
                    userId:userFound[0]._id
                })
                await createForgot.save()
                const client=sib.ApiClient.instance
            
                const apiKey=client.authentications['api-key']
                apiKey.apiKey=process.env.SENDINBLUE_API_KEY
                
                const transEmailApi=new sib.TransactionalEmailsApi()
            
                const sender={
                    email:"sudeepsalian7996@gmail.com"
                }
            
                const receivers=[
                    {
                        email:email
                    }
                ]
            
            const data= await transEmailApi.sendTransacEmail({
                    sender,
                    to:receivers,
                    subject:"this is the test subject",
                    htmlContent:`
                    <a href="http://localhost:5200/password/resetpassword/${id}">Reset password</a>
                    `
                })
        
                console.log(data)
                res.json({forgotdata:data,success:true})
        }else{
            console.log("user doesn't exist")
            res.json({message:"user doesnt exist",success:false})
        }
       
    }catch(err){
        console.log("error in forgot password-->",err)
        res.json({Error:err})
    }

}

exports.resetpassword=async (req,res)=>{
    try{
        const id=req.params.id
        const forgotPassword1=await forgotpassword.find({_id:id})
        if(forgotPassword1){
        const data=await forgotpassword.findOneAndUpdate({_id:id},{isactive:false})
      
                        res.send(`<html>
                                         <script>
                                             function formsubmitted(e){
                                                 e.preventDefault();
                                                 console.log('called')
                                             }
                                         </script>
                                         <style>
                                         body{
                                            justify-content: center;
                                            text-align: center;   
                                        }
                                        input{
                                            border-radius: 15px;
                                            padding: 25px;
                                            margin-bottom: 10px;
                                            width:60%
                                        }
                                        button{
                                            color: white;
                                            background-color: rgb(73, 188, 73);
                                            padding: 10px 28px;
                                            text-align: center;
                                            font-family: inherit;
                                            font-weight: bold;
                                            font-size: large;
                                            border-radius: 20px;   
                                        }
                                        header{
                                            background-color: rgb(20, 117, 156);
                                            color: white;
                                            padding-top:86px ;
                                            margin-bottom:15px;
                                            height: 300px
                                        }
                                        label{
                                            font-family: inherit;
                                            font-size: 30px;
                                         }
                                         </style>
                                         <body>
                                            <header>
                                                <h1>Enter your New Password<h1>
                                            </header>
                                         <form action="/password/updatepassword/${id}" method="get">
                                             <label for="newpassword">Enter New password</label>
                                             <input name="newpassword" type="password" required></input><br><br>
                                             <button>reset password</button>
                                         </form>
                                         </body>
                                     </html>`
                                     )
                        res.end()
        }
    }catch(err){
        console.log("reset password error")
        res,json({Error:err})
    }
}

exports.updatepassword=async (req,res)=>{
    try{
        const { newpassword } = req.query;
        const {resetpassword}=req.params
        const findUser=  await forgotpassword.find({_id:resetpassword})
        const data=await user.find({_id:findUser[0].userId})
       if(data){
        encrypt.hash(newpassword,10,async(err,hash)=>{
            if(err){
                res.json({Error:err})
            }     
            const data2=await user.findOneAndUpdate({_id:data[0]._id},{password:hash}) 
             res.json({data:data2})
        })
    }
    }catch(err){
        console.log("update passwor error-->",err)
        res.json({Error:err})
    }
   
}