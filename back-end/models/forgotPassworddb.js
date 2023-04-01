const mongoose=require("mongoose");
const uuid=require("uuid")

const Schema=mongoose.Schema;

const forgotPasswordSchema=new Schema({
    _id: { type: String, default: function genUUID() {
        uuid.v1()
    }},
    isactive:{
        type:Boolean
    },
    userId:{
        type:Schema.Types.ObjectId
    }
}) 
module.exports=mongoose.model("Forgot",forgotPasswordSchema)
// const forgotPassword=sequelize.define("forgotPassword",{
//     id:{
//         type:Sequelize.UUID,
//         allowNull:false,
//         primaryKey:true
//     },
//     isactive:Sequelize.BOOLEAN
// })

// module.exports=forgotPassword