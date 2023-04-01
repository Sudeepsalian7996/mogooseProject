const express=require("express")
const fs=require("fs")
const path=require("path")
const bodyParser=require("body-parser")
const cors=require("cors")
const helmet=require("helmet")
const compress=require("compression")
const morgan=require("morgan")
const mongoose=require("mongoose")
require("dotenv").config()

const signup=require("./routes/user")
const expenseDetail=require("./routes/expense")
const purchase=require("./routes/purchase")
const premium=require("./routes/premium")
const password=require("./routes/forgotPassword")


const User=require("./models/signupdb")
const Expense=require("./models/expensedb")
const Order=require("./models/orderdb")
const ForgotPassword=require("./models/forgotPassworddb")
const Download=require("./models/downloaddb")
const { Stream } = require("stream")

const app=express()
app.use(cors())
app.use(helmet())
app.use(compress())

const infoInFile=fs.createWriteStream(path.join(__dirname,"request.log"),{flags:"a"})

app.use(morgan("combined",{stream:infoInFile}))

app.use(bodyParser.json())

app.use("/user",signup)

app.use("/expense",expenseDetail)

app.use("/purchase",purchase)

app.use("/premium",premium)

app.use("/password",password)

app.use((req,res)=>{
    // console.log(req.url)
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

//create relations
// User.hasMany(Expense)
// Expense.belongsTo(User)

// User.hasMany(Order)
// Order.belongsTo(User)

// User.hasMany(ForgotPassword)
// ForgotPassword.belongsTo(User)

// User.hasMany(Download)
// Download.belongsTo(User)


mongoose.connect("mongodb+srv://sudeep:$alian7996@cluster0.ud57cmy.mongodb.net/expenseTracker?retryWrites=true&w=majority")
.then(()=>{
    app.listen(5200)
})
.catch((err)=>console.log("sync err-->",err))