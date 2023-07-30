import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


// Register function
export const register = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } =req.body;

        
        // for salting i.e multilayer hashing
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);



        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            // password:passwordHash
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*1000),
            impressions: Math.floor(Math.random()*1000),
        });
        const savedUser = await newUser.save();
        // if new user is created we give conformation to frontend(201) 
        res.status(201).json(savedUser);
        
    } catch(err){
        // if error is ocurred conformation to frontend (500)
        res.status(500).json({error : err.message});

    }
};




/* Logging IN*/
export const login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        const user =await User.findOne({email:email});
        if (!user) return res.status(400).json({msg:"User Doesnt exist"});

        const isMatch =await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({msg:"Invalid Credentials"});


const token =jwt.sign({id: user._id}, process.env.JWT_SECRET);
delete user.password;
res.status(200).json({token, user});

    }
    catch(err){
       res.status(500).json({error:err.message});
    }
};