
const User = require('../modal/UserModal');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const registerUser = async(req, res) =>{
    const { name, email, password} = req.body;
    try{
        if(!name || !email || !password){
            return res.status(404).json({message:"All fields are required"});
        }
        let user = await User.findOne({email});

        if(user){
            return res.status(400).send( "User already registered");
        }

         user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        await user.save();
        return res.status(201).send('User created successfully');
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
    if(!email || !password){
        return res.status(404).json({message:"Email and Password is required"})
    }

    const user = await User.findOne({email});
   
    if(!user){
        return res.status(404).json({message: "Email not found"});
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({message: "Password is invalid"});
    }

    return res.status(200).json({message: 'Login successfull'});
    }catch(error){
    return res.status(500).json('Internal server error');
    }
}

const otpStore = {};

const forgotPassword = async(req, res) =>{
    const {email} = req.body;
    try{
        if(!email){
            return res.status(400).json("Email is required");
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000,
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes`
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({message: 'OTP sent to your email'});

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const verifyOTP = async(req, res) =>{
    const { email, otp }= req.body;
    
    if(!otpStore[email]){
        return res.status(400).json({message: "OTP expired"});
    }
    const {otp: storedOtp, expires} = otpStore[email];

    if(Date.now()> expires){
        return res.status(400).json({message: "OTP Expired, Please request a new one"});
    }

    if(parseInt(otp) !== storedOtp){
        return res.status(400).json({message: "Please enter a correct OTP"})
    }

    return res.status(200).json({message: "OTP Verified Successfully"});
}

const resetPassword = async(req, res) =>{
    const { email, newPassword, confirmPassword } = req.body;

    try{
        if(!otpStore[email]){
            return res.status(400).json({message: "OTP Verification required before resetting password"});
        }
        if(newPassword !== confirmPassword ){
            return res.status(400).json({message: "Password is required"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            {email},
            {password: hashedPassword},
            {new: true}
        )

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        delete otpStore[email];

        res.status(200).json({message: "Passwor has been reset successfully"});
    }catch(error){
        res.status(500).json({message: "Error resetting Password"})
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword
}