const express=require("express")
const premiumMembership=require("../controllers/premium-membership")
const userAuth=require("../middleware/auth")

const router=express.Router()

router.get("/leaderBoard",userAuth.userAuthontication,premiumMembership.premiumFeature)

module.exports=router