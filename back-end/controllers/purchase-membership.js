const Razorpay=require("razorpay")
const orderDb=require("../models/orderdb")
const  usersdb=require("../models/signupdb")
const jwt=require("jsonwebtoken")

exports.getPremium=async (req,res,next)=>{
    try{
        const Razor=new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
        })
        const amount=2000
        Razor.orders.create({amount,currency:"INR"},async(err,order)=>{
            if(err){
                throw new Error("Error while starting order")
            }
        
            const data=new orderDb({
                orderId:order.id,
                status:"PENDING",
                userId:req.user[0]._id
            })
            await data.save()
            res.json({order,key_id:Razor.key_id})
        })
    }catch(err){
        console.log("Razor pay error",err)
        res.json({Error:err})
    }
}
function createToken(id,premium){
    return jwt.sign({userId:id,isPremium:premium},"32204kahfkbkkcy9429hshksky2939hcsd")
 }

exports.updatePremium=async(req,res,next)=>{
    try{
        const paymentid=req.body.payment_id
        const orderid=req.body.order_id
        const result=await orderDb.find({"orderId":orderid})
        if(paymentid===null){
            res.json({message:"payment is failed"})
          return  orderDb.updateOne({"paymentId":paymentid,"status":"FAILED"})
        }
        function updateTable(result){
           return new Promise((resolve)=>{
                resolve(orderDb.updateOne({"paymentId":paymentid,"status":"SUCCESS"}))
           }) 
        }
        function updateUserTable(){
            return new Promise((resolve)=>{
               resolve(usersdb.findOneAndUpdate({_id:req.user[0]._id},{"premium":true}))
            })
        }
        Promise.all([updateTable(result),updateUserTable()]).then(()=>{
            res.json({success:true,token:createToken(req.user.id,true)})
        })
    }catch(err){
        console.log("error in update transaction",err)
        res.json({Error:err})
    }
 
}