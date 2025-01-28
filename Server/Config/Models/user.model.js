import {Schema,model} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
const userSchema = new Schema({
    role:{
        type:String,
        enum:['student','teacher','admin'],
        default:'student'
    },
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    prn:{
        type:String,
    },
    rollNo:{
        type:String,
    },
    password:{
        type:String,
    },
    division:{
        type:String,
    },
    year:{
        type:String,
    },
    classroom:{
        type:String,
    },
    forgotpasswordToken:{
        type:String,
    },
    forgotpasswordExpiry:{
        type:Date,
    },
    github:{
        type:String,
    },
    linkedIn:{
        type:String,
    },
    leetCode_userName:{
        type:String,
    },
    avatar:{
        public_id:{
            type:String,
            // required:true
        },
        secure_url:{
            type:String,
        }
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods = {
    generateJWTToken:function(){
        return jwt.sign(
            {
                id:this._id,
                role:this.role
            },
            'ua066B9lGebj243fy2GFQ1NkMMVRaEMemsrQ7zBrEXE=',
            {expiresIn:'1d'},
        )
    },
    comparePassword:async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    },
    generateResetPasswordToken:async function(){
        const resetToken = crypto.randomBytes(20).toString('hex')
        this.forgotpasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
        this.forgotpasswordExpiry = Date.now() + 15*60*1000;
        return resetToken;
    },

}

const User = model('User',userSchema)
export default User;