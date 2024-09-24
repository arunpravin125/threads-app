import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        maxLength:500
    },
    img:{
        type:String,
    },
    likes:{
        // array of user ids|| [if likes added by number of userId count]
        type:[mongoose.Schema.Types.ObjectId],// likes and unlike according user id push and push method
        ref:"User",
        default:[]
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            text:{
                type:String,
                required:true
            },
            userProfilePic:{
                type:String,

            },
            username:{
                type:String
            }
        }
    ]

},{
    timestamps:true
})

const Post = mongoose.model("Post",postSchema);

export default Post;