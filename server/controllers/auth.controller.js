import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import User from "../models/user.model.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendForgotPasswordEmail, sendResetPasswordConfirmation, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js"

export const signup = async(req,res) =>{

   try {
     const {name, email, password} = req.body
    if(!name || !email || !password)
    throw new Error("please provide all fields ie: email, password and name")
    
    const emailExists = await User.findOne({email})
    if(emailExists)
       return res.status(400).json({success:false, message: 'user already exists with this email'})

    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationToken = Math.floor(100000 +Math.random()* 900000).toString()
    const user = new User({
        email,
        name,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 //24 hours
    })
    await user.save()

    //jwt
    generateTokenAndSetCookie(res,user._id)
    
    //response
    res.status(201).json({success: true, message: 'user created successfully', user: {
        ...user._doc,
        password:""
    }})
    //send verification email
    await sendVerificationEmail(user.email, verificationToken)

    
   } catch (error) {
    res.status(400).json({success: false, message:error.message})
   }
}
export const verifyEmail = async(req,res)=>{
   
    try {
        const {code} = req.body
        const user = await User.findOne({verificationToken: code, verificationTokenExpiry: { $gt: Date.now() }})
        if(!user)
        {
           return res.status(400).json({success: false, message: 'invalid or expired code'})
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiry = undefined
        await user.save()
        
        //send welcome email
        await sendWelcomeEmail(user.email, user.name)
        
        res.status(200).json({success:true, message: "email verified successfully", user:{
            ...user._doc, password: ""
        }})
        

       
    } catch (error) {
        res.status(500).json({success:false, message: "email verification failed", error})
    }
}
export const signin =async(req,res)=>{
    const {email, password} = req.body
    try {
        //some validations
        if(!email || !password)
           return res.status(400).json({success:false, message: 'please provide all fields'})
        
        
        const user = await User.findOne({email})
        if(!user)
           return res.status(400).json({success:false, message: 'email not found!'})

        const isRightPassword = await bcryptjs.compare(password, user.password)
       if(!isRightPassword)
          return res.status(400).json({success:false, message: 'incorrect password!'})

       // set jwt token
        generateTokenAndSetCookie(res, user._id)
        res.status(200).json({success: true, message: 'logged in successfully'})

    } catch (error) {
        console.log('error in logging in', error)
        res.status(500).json({success: false, message: 'error in loggin in',})
    }
}
export const logout =async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success: true, message: 'logged out successfully'})
}
export const forgotPassword = async(req,res)=>{
   const {email} = req.body
   try {
    if(!email)
       return res.status(400).json({success:false, message: 'email is required'})
    const user = await User.findOne({email})
    if(!user)
       return res.status(400).json({success:false, message: 'user not found with this email'})

    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiry = Date.now() + 2 * 60 * 60 * 1000 // valid within 2 hours

    await user.save()

    //send forgot password email
    await sendForgotPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
    res.status(200).json({success:true, message: 'forgot password email sent to the user'})

   } catch (error) {
    console.log('something went wrong', error)
    res.status(500).json({success:false,message: 'something went wrong', error})
   }
}
export const resetPassword = async(req,res)=>{
    const {token} = req.params
    const {password} = req.body
    try {
        if(!password)
            return res.status(400).json({success:false, message: 'password is required'})
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiry: {$gt: Date.now()}
        })
        if(!user)
            return res.status(400).json({success:false, message:'invalid or expired token'})

        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpiry = undefined
        user.save();

        //send password reset confirmation email
        await sendResetPasswordConfirmation(user.email)
        res.status(200).json({success:true, message: 'password reset successfully'})
    } catch (error) {
        console.log('error in reseting password', error)
        res.status(500).json({success:false, message: 'password reset error', error})

    }
}
export const checkAuth = async (req,res)=>{

    try {

        const user = await User.findById(req.userId).select('-password')
        if(!user)
            return res.status(400).json({success:false, message: 'user not found!'})
        res.status(200).json({success:true, message:'user authorized', user})
        
    } catch (error) {
        console.log('error in checking auth',error)
        res.status(500).json({success:false, message: 'error in checking auth', error})
    }
}