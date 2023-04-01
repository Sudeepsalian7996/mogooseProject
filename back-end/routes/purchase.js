const express=require("express")

const premiumMembership=require("../controllers/purchase-membership")
const userAuth=require("../middleware/auth")

const routes=express.Router()

routes.get("/premium-membership",userAuth.userAuthontication,premiumMembership.getPremium)

routes.post("/updatePremium",userAuth.userAuthontication,premiumMembership.updatePremium)

module.exports=routes