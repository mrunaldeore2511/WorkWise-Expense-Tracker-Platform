const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.signup = async(req, res) => {

    try{

        const {firstName, lastName, email,password, confirmPassword, role} = req.body;
        console.log("SIGNUP BODY: ", req.body);
        if(!firstName || !lastName || !email || !password || !confirmPassword || !role){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        if(password !== confirmPassword){
            return res.status(409).json({
                success: false,
                message: "Password and confirm password must be same",
            }) 
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(500).json({
                success: false,
                message: "User already exist. Please Login to continue",
            })
        }

        const allowedRoles = ["Student", "Freelancer", "Traveller"];
        if(!allowedRoles.includes(role)){
            return res.status(500).json({
                success: false,
                message: "Undefined role",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);     
       
        const newUser = await User.create({
            firstName, lastName, email,password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message : "Sign Up sucessfull"
        })

    }
    catch(err){
        return res.status(405).json({
            success: false,
            message: "Sign up fail",
            error: err
        })
    }
}

exports.login = async(req, res) => {

    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(405).json({
                success: false,
                message: "All the details are required",
            })
        }

        const existingUser = await User.findOne({email: email});
        console.log("existingUser: ", existingUser)
        if(!existingUser){
            return res.status(405).json({
                success: false,
                message: "User does not exist. Please sign up",
            })    
        }

        
        if(await bcrypt.compare(password, existingUser.password)){
            const token = jwt.sign(
                {email: existingUser.email, id: existingUser._id, role: existingUser.role},
                process.env.JWT_SECRET,
                {
                    expiresIn:"24h"
                }
            );

            existingUser.token = token;
            existingUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token, 
                existingUser,
                message: "Login Successful"
            })

        }
        else{
            return res.status(405).json({
                success: false,
                message: "Password Incorrect",
            }) 
        }

    
    }
    catch(err){
        return res.status(405).json({
            success: false,
            message: "Login fail",
            error: err
        })
    }
}

exports.resetPassword = async(req, res) => {

    try{

        const { token } = req.params;
        console.log("RESET PASSWORD REQ: ", req.body)
        const {password, confirmPassword} = req.body;

        if(!token || !password || !confirmPassword){
            return res.status(401).json({
                success: false,
                message: "All details are required"
            })
        }

        if( password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Both the password must be same"
            })
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(405).json({
            success: false,
            message: "Fail to reset Password",
            error: err
        })  
    }
}

exports.forgotPassword = async (req, res) => {
  try {

    console.log("Forgot Password resquest body", req.body)
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found. Please sign up" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const transporter =  nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth:{
            user:process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });

    await transporter.verify().then(() => {
        console.log("Ready to send emails");
    }).catch((err) => {
        console.log(err);
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const response = await transporter.sendMail({
      from: `Support Team <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 10 minutes.</p>
      `,
    });


    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
      data:response,
      link: resetLink
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: "Forgot password failed" ,error:err.message});
  }
};

exports.logout = async(req, res) => {

    try{

        const userId = req.user.id;
        console.log("userId: ", userId);
        await User.findByIdAndUpdate(userId, {token: ""});
        
        res.clearCookie("token", {
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch(err){
        return res.status(405).json({
            success: false,
            message: "Fail to logout",
            error : err
        })
    }
}