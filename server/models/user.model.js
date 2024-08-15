import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    name:{
        type:String,
        required:[true,'name is required']
    },
    lastLogin:{
        type:Date,
        default: new Date(Date.now())
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordTokenExpiry:Date,
    verificationToken:String,
    verificationTokenExpiry:Date,
},{timestamps: true})

const User = mongoose.models.User || mongoose.model('User',userSchema)
export default User;