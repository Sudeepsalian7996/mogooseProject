const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    paymentId:{
        type:String
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("Order",orderSchema)

// const orderDb=sequelize.define("orderList",{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     paymentId:Sequelize.STRING,
//     orderId:Sequelize.STRING,
//     status:Sequelize.STRING
// })

// module.exports=orderDb