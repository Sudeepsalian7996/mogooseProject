const express=require("express")

const routes=express.Router()

const manageExpense=require("../controllers/manageExpense")
const userAuth=require("../middleware/auth")

routes.post("/add-expense",manageExpense.addExpense)

routes.get("/get-expense",userAuth.userAuthontication,manageExpense.getExpense)

routes.delete("/delete-expense/:id",manageExpense.deleteExpense)

routes.get("/download",userAuth.userAuthontication,manageExpense.download)

routes.get("/pagination",userAuth.userAuthontication,manageExpense.paginateExpenses)

module.exports=routes
