
const expensedatabase=require("../models/expensedb")
const userdb=require("../models/signupdb");
const downloaddb=require("../models/downloaddb")
const AWS=require("aws-sdk")
require("dotenv").config()

var totalamtdb;
//Adding the expense to the database
exports.addExpense=async(req,res)=>{
    try{
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category
        const userId=req.body.userId
        
        const data=new expensedatabase({
            amount:amount,
            description:description,
            category:category,
            userId:userId
        })
        await data.save()
    
    const user=await userdb.find({_id:userId})
    const totalSum=Number(user[0].totalAmount)+Number(amount)
    await userdb.findOneAndUpdate({_id:userId},{totalAmount:totalSum})
    res.json({newExpense:data,message:"expense added successfully"})
    }
    catch(err){
        console.log("addExpense error-->",err)
        res.json({Error:err})
    }
}
let expenseId;
//Fetching all the expenses from the database
exports.getExpense=async(req,res)=>{

    try{
        totalamtdb=req.user
        expenseId=req.user[0]._id  //array of elements we are going to get
        const data=await expensedatabase.find({"userId":expenseId})
        res.json({allExpenses:data})
    }catch(err){
        console.log("error in fetching data from database")
        res.json({Error:err})
    }
}

//deleting the expense from the database
exports.deleteExpense=async(req,res)=>{
    try{
        const deleteExpenseId=req.params.id
        
       await expensedatabase.findByIdAndRemove({"_id":deleteExpenseId})

    }catch(err){
        console.log("error in delete expense database")
        res.json({Error:err})
    }
}

//download expense
exports.download=async (req,res)=>{
    try{

    const response=await expensedatabase.find({userId:req.user[0]._id})
       const stringifiedExpense=JSON.stringify(response)
       const userId=req.user[0]._id
       
       const filename=`expense${userId}/${new Date()}.txt`
       const fileurl=await uploadtoS3(stringifiedExpense,filename)
       res.json({url:fileurl,success:true})
    }catch(err){
        console.log("error in download file-->",err)
        res.json({Error:err})
    }
}

//upload the expense to AWS S3

async function uploadtoS3(data,filename){
    try{
        const BUCKET_NAME="sudeepexpensetrackerapp"
        const IAM_USER_KEY=process.env.IAM_USER_KEY
        const IAM_USER_SECRETE_KEY=process.env.IAM_USER_SECRETE_KEY
    
        let s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRETE_KEY
        })
       
            var params={
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:data,
                ACL:"public-read"
            }
          
           return new Promise((resolve,reject)=>{
                s3bucket.upload(params,(err,S3success)=>{
                    if(err){
                        reject("something went wrong in AWS")
                    }else{
                        resolve(S3success.Location)     
                    }
                })
            })
    }catch(err){
        res.json({Error:err,success:false})
        console.log("error in uploading..",err)
    }
  
}

//paginate expenses
exports.paginateExpenses=async(req,res)=>{
    try{
        const page=req.query.page
        const pagesize=req.query.pagesize
        const limits=+pagesize
    
    const data=await expensedatabase.find({"userId":req.user[0]._id}).skip((page-1)*pagesize).limit(limits)
    res.json({Data:data})
    }catch(err){
        console.log("pagination error BE-->",err)
        res.json({Error:err})
    }
}