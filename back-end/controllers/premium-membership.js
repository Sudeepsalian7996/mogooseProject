const User=require("../models/signupdb")
const Expense=require("../models/expensedb")
const expense=require("../models/expensedb")
const sequelize = require("../util/database")

exports.premiumFeature=async(req,res,next)=>{
    try{
    const leaderBoardofUser=await User.find().select("name totalAmount").sort({totalAmount:-1})
        res.json(leaderBoardofUser)
    }catch(err){
        console.log('error in premiumFeature-->',err)
        res.json({Error:err})
    }
}