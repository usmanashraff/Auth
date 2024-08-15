
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailTrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (userEmail, verificationToken)=>{

    const recipient = [{
        email: userEmail
    }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to:recipient,
            subject:"verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category:"Email Verification"
        })
        console.log("verification email sent successfully", response)
    } catch (error) {
        console.log("error in sending verification email", error)
        throw new Error(`error in sending verification email ${error}`)
    }
}
export const sendWelcomeEmail = async(email, name)=>{

    const recipient = [{
        email,
    }]
     try {
    await mailTrapClient.send({
        from: sender,
        to: recipient,
        template_uuid: "9ab4db48-a986-4a81-b547-b715987fc864",
        template_variables: {
        "company_info_name": "Auth company",
        "name": name
        },
    })
     console.log("welcome email sent")
    } catch (error) {
        console.log('error in sending welcome email', error)
        // throw new Error(`error in sending welcome email ${error}`)
    }
}
export const sendForgotPasswordEmail = async(email,url)=>{

    const recipient = [{
        email
    }]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to:recipient,
            subject: 'reset your passoword',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
            category:'forgot password'
        })
        console.log('forgot password email sent', response)
    } catch (error) {
        console.log('error in sending reset email', error)
    }
}
export const sendResetPasswordConfirmation = async(email)=>{
    const recipient = [{
        email
    }]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to:recipient,
            subject: 'reset password confirmation',
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'password reset confirmation'
        })
        console.log('password reset confirmation sent', response)
    } catch (error) {
        console.log('error in sending password reset confirmation email', error)
    }
}