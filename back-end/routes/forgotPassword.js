const express=require("express")
const forgotPassword=require("../controllers/forgotsib")
const userAuth=require("../middleware/auth")

const routes=express.Router()

routes.post("/forgotpassword",forgotPassword.forgotpassword)

routes.get("/resetpassword/:id",forgotPassword.resetpassword)

routes.get("/updatepassword/:resetpassword",forgotPassword.updatepassword)

module.exports=routes
