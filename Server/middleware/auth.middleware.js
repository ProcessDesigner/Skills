import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken'
const isLoggedIn = async(req,res,next) =>{
    try {
        const {token} = req.cookies;
        if(!token){
            return next (new AppError('User not found',505))
        }

        const userDetails = await jwt.verify(token,'ua066B9lGebj243fy2GFQ1NkMMVRaEMemsrQ7zBrEXE=')
        console.log("user token verified successfully:", userDetails);

        req.user = userDetails
        
        next()
    } catch (error) {
        console.log(error)
        return next (new AppError(error,505))
    }
}
const isTeacher = async(req,res,next)=>{
    try {
        const {token}  = req.cookies
        if(!token){
            return next(new AppError('User not found',501));
        }
        const userDetails = jwt.verify(
            token,'ua066B9lGebj243fy2GFQ1NkMMVRaEMemsrQ7zBrEXE='
        ) 
        if (!userDetails.role || userDetails.role !== 'teacher') {
            return next(new AppError('Access denied: Not a teacher', 403));
        }
        req.user = userDetails;
        next()

    } catch (error) {
        return next(new AppError(error,404));
    }
}
export {
    isLoggedIn,
    isTeacher
}