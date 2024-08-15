import jwt from 'jsonwebtoken'
export const generateTokenAndSetCookie = (res, userId)=>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET, {  //(payload, secret, options)
        expiresIn: "7d"
    })
    res.cookie("token", token, {
        httpOnly: true, //to prevent attacks || not to access by js
        samesite: "strict", // to prevent attacks
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token;
}