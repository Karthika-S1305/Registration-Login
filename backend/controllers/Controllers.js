
const User = require('../modal/UserModal');
const bcrypt = require('bcryptjs');

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

module.exports = {
    registerUser,
    loginUser
}