import express from "express";
import { checkAuth, forgotPassword, logout, resetPassword, signin, signup, verifyEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)
router.post('/signup', signup)
router.post('/verify-email', verifyEmail)
router.post('/signin', signin)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword) // send forgot password email with a link to reset password
router.post('/reset-password/:token', resetPassword) // handling reset password link


export default router
