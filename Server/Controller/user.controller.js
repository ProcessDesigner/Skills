import User from "../Config/Models/user.model.js";
import AppError from "../utils/AppError.js";
import sendEmail from "../utils/sendMail.js";
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'
const cookieOption = {
    httpOnly:true,
    secure:true,
    maxAge:7*24*24*24*1000
}


const login = async(req,res,next)=>{
    try {
        
        const {email,password} = req.body;
        console.log(req.body)
        if(!email||!password){
            return next(new AppError('AllFields aare required',500));
        }
        const user = await User.findOne({email});
        if(!user || !user.comparePassword(password)){
            return next(new AppError('User not Authorized or password didnt match',503));
        }
        const token = user.generateJWTToken()
        res.cookie('token',token,cookieOption)
        return res.status(200).json({
            success:true,
            message:'User logged in succesfully',
            user
        })
    } catch (error) {
        console.log(error)
        return next(new AppError(error,504))
    }
}
const signup = async(req,res,next)=>{
    try {
        
        const {name,email,prn,rollNo,password,role,branch,division,year} = req.body;
        console.log(req.body)

        if(role === "student"){
            if(!name||!email||!prn||!rollNo||!password||!role||!branch||!division||!year){
                return next(new AppError('AllFields aare required',500));
            }
            const userExists = await User.findOne({ email });
            if (userExists) {
                return next(new AppError("User already exists. Please log in.", 400));
            }
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpToken = bcrypt.hashSync(otp, 10);

            res.cookie("otpToken", otpToken, { httpOnly: true, maxAge: 10 * 60 * 1000 }); 
            res.cookie("tempUser", { name,email,prn,rollNo,password,role,branch,division,year }, { httpOnly: true });

            await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);
            return res.status(200).json({
                success:true,
                message:`otp sent to ${email}`,
            }); 
        }
        else if(role === "teacher"){
            if(!name||!email||!password||!role){
                return next(new AppError('AllFields aare required',500));
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                return next(new AppError("User already exists. Please log in.", 400));
            }
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpToken = bcrypt.hashSync(otp, 10);

            res.cookie("otpToken", otpToken, { httpOnly: true, maxAge: 10 * 60 * 1000 }); 
            res.cookie("tempUser", { name,email,password,role }, { httpOnly: true });

            await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

            return res.status(200).json({
                success:true,
                message:`otp sent to ${email}`,
                
            }); 
        }
    } catch (error) {
        console.log(error)
        return next(new AppError(error,502))
    }
}

const regenerate_otp = async (req, res, next) => {
    try {
        const tempUser = req.cookies?.tempUser;
        if (!tempUser) {
            return next(new AppError("No pending user data found. Please sign up first.", 400));
        }

        const { email } = tempUser;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpToken = bcrypt.hashSync(otp, 10);

        res.cookie("otpToken", otpToken, { httpOnly: true, maxAge: 10 * 60 * 1000 }); 

        await sendEmail(email, "Your Regenerated OTP", `Your new OTP is ${otp}`);

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email.",
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const validate_otp_email = async (req, res, next) => {
    const { otp } = req.body;
    console.log("This is otp",otp)
    const otpToken = req.cookies.otpToken; 
    const tempUser = req.cookies.tempUser; 

    if (!otpToken || !tempUser) {
        return next(new AppError("OTP expired or user details missing", 400));
    }

    try {
        const isOtpValid = bcrypt.compareSync(otp, otpToken);

        if (!isOtpValid) {
            return next(new AppError("Invalid OTP", 400));
        }
        const { name,email,prn,rollNo,password,role,branch,division,year } = tempUser;
        // const hashedPassword = bcrypt.hashSync(password, 10);
        
        if(role==='student'){
            const user = await User.create({
                name,
                email,
                prn,
                rollNo,
                password,
                branch,
                division,
                year,
                role
            })
            
            if (!user) {
                return next(new AppError("Failed to register user", 500));
            }
    
            await user.save();
            res.clearCookie("otpToken");
            res.clearCookie("tempUser");
    
            const token = await user.generateJWTToken();
            res.cookie("token", token, { httpOnly: true });
    
            return res.status(200).json({
                success: true,
                message: "User registered successfully",
                user,
            });
        }
        else if(role==='teacher'){
            const user = await User.create({
                name,
                email,
                password,
                role
            })
            
            if (!user) {
                return next(new AppError("Failed to register user", 500));
            }
    
            await user.save();
            res.clearCookie("otpToken");
            res.clearCookie("tempUser");
    
            const token = await user.generateJWTToken();
            res.cookie("token", token, { httpOnly: true });
    
            return res.status(200).json({
                success: true,
                message: "User registered successfully",
                user,
            });
        }
    } catch (error) {
        console.log(error)
        return next(new AppError(error.message, 502));
    }
};



const logout = async(req,res,next) =>{
    res.cookie('token',null,{
        httpOnly:true,
        secure:true,
        maxAge:0
    })

    res.status(200).json({
        success:true,
        message:'User logged out succesfully'
    })
}


const getAllStudentss = async(req,res,next)=>{
    const student = User.find();
    res.status(200).json({
        success:true,
        message:'All Students fetched',
        student
    })
}

const getProfile = async(req, res, next) => {
    const id = req.user.id;
    const user = await User.findById(id).lean();

    if (!user) {
        return next(new AppError('User not found', 502));
    }

    // Optional: if you need to stringify the user object before sending it
    const userString = JSON.stringify(user);

    res.status(200).json({
        success: true,
        message: `User with ID: ${id}`,
        user: userString // Send the stringified version of user
    });
}


const forgotPassword = async(req,res,next) =>{
    const {email} = req.body;
    console.log(req.body)
    if(!email){
        return next(new AppError('Email is required',500));
    }

    const user = await User.findOne({email})

    if(!user){
        return next(new AppError('User not found',501));
    }

    const resetToken = await user.generateResetPasswordToken()
    await user.save()

    const resetPasswordUrl =  `http://localhost:5173/reset-password/${resetToken}`;
    console.log(resetPasswordUrl)
    const message = `${resetPasswordUrl}`
    const subject = `Reset password url for your account with email ${email}`

    try {
        await sendEmail(email,subject,message)

        res.status(200).json({
            success:true,
            message:'reset url send to your mail'
        })
    } catch (error) {
        console.log(error)
        return next(new AppError(error,405))
    }
}

const reset = async(req,res,next) =>{
    const {resetToken} = req.params;
    const {password} = req.body;

    try {
        
        const forgotpasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
        const user = await User.findOne({
            forgotpasswordToken,
            forgotpasswordExpiry: {$gt:Date.now()}
            
        })
        if (!user) {
            return next(new AppError('User not found, please try again', 500));
        }
        user.password = password
        user.forgotpasswordToken = undefined
        user.forgotpasswordExpiry = undefined
        await user.save()
    
        res.status(200).json({
            success:true,
            message:'Password changed succesfully'
        })
    } catch (error) {
        console.log(error)
        return next(new AppError(error,504))
    }

}

const update = async(req,res,next)=>{
    const {id} = req.user;
    const {name,email,prn,rollNo,password,classroom,leetCode_userName,linkedIn,github} = req.body;
    const user = await User.findById(id);
    if(!user){
        return next(new AppError('user not found',505));
    }
    if(name){
        user.name = name 
    }
    if(email){
        user.email = email 
    }
    if(prn){
        user.prn = prn 
    }
    if(name){
        user.rollNo = rollNo 
    }
    if(password){
        user.password = password 
    }
    if(classroom){
        user.classroom = classroom 
    }
    if(leetCode_userName){
        user.leetCode_userName = leetCode_userName 
    }
    if(linkedIn){
        user.linkedIn = linkedIn 
    }
    if(github){
        user.github = github 
    }

    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(file.path,{
                folder:'SKILL UO',
            })
            if(result){
                user.avatar.public_id = result.public_id
                user.avatar.secure_url = result.secure_url
            }
        } catch (error) {
            return next(new AppError('Failed to add image',502))
        }
    }
    await user.save();

}

export{
    login,
    signup,
    regenerate_otp,
    validate_otp_email,
    getProfile,
    forgotPassword,
    reset,
    logout,
    update,
    getAllStudentss
}
