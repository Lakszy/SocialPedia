import Post from "../models/post";
import User from "../models/user";

// 201 creating something
// 200 successfull request



// CREATE
export const createPost = async (req, res) =>{

    try{
        const {userId, description, picturePath} = req.body;
        const newPost = new Post({
            userId,
            firstName :userId.firstName,
            lastName :userId.lastName,
            location:userId.location,
            description,
            userPicturepath: userId.picturePath,
            picturePath,
            likes:{},
            comments: []
        })


        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    }
    catch(err){
        res.status(404).json({message: err.message})
    }
}



// Read
export const getFeedPosts = async (req,res ) =>{
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({message: err.message})
    }
}

export const getUserPost = async (req,res) => {

    try{
      const {userId} = req.params;
      const post = await Post.find({userId});
      res.status(200).json(post);

    }
    catch(err){
        res.status(404).json({message: err.message})
    }
}


// Update
export const likePost = async (req,res ) => {
    try{
    const {id} = req.params;
    const {userId} = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

if (isLiked){
    post.likes.delete(userId);
}
else{
    post.liikes.set(userId, true);
}

const updatePost = await Post.findByIdAndUpdate(
    id,
    {likes:post.likes},
    {new:true}
);
res.status(200).json(updatedPost)
    }
    catch(err){
        res.status(404).json({message : err.message});
    }

}




