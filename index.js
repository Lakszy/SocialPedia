import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; 
import postRoutes from "./routes/posts.js"; 
import { fileURLToPath } from "url";
import { futimesSync } from "fs";
import { error } from "console";
import {createPost} from "./controllers/post.js";
import {register} from "./controllers/auth.js";
import { verify } from "crypto";
import { verifyToken } from "./middleware/auth.js";
import { create } from "domain";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app=express();
app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


// File Storage
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);  
    }
});

const upload =multer({storage});

// Routes With Files
// update the uploaded pic into public/assets locally
app.post("/auth/register", upload.single("picture"), register);
// this will get picture and upload it into the files
app.post("/posts", verifyToken , upload.single("picture"), createPost);


// Routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);


// Mongoose setup
const PORT =process.env.PORT || 6001;
// incase our specified port doesnt work(in this case 3001)
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,


}).then(()=>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); 
     
})
.catch((error => console.log(`${error} did not connect`)));

