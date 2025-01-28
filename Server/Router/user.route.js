import {Router} from 'express'
import { forgotPassword, getProfile, login, logout, regenerate_otp, reset, signup, update, validate_otp_email } from '../Controller/user.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
import { leetcode } from '../utils/leetcode.js'

const router = Router()

router.post('/login',login)
router.post('/signup',signup)
router.post('/logout',logout)
router.post('/update',isLoggedIn,update)
router.post('/validate',validate_otp_email)
router.post('/regenerate',regenerate_otp)
router.get('/me',isLoggedIn,getProfile)
router.post('/forgot',forgotPassword)
router.post('/reset/:resetToken',reset)
router.post("/leetcode/:id", leetcode);


export default router;