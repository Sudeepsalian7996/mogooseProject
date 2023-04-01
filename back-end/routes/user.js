const express=require("express")

const routes=express.Router()

const adminPage=require("../controllers/signOrLog")

routes.post("/signup",adminPage.signup)

routes.post("/login",adminPage.login)

module.exports=routes
