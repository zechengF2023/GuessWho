import mongoose from "mongoose";
import * as dotenv from 'dotenv' 
dotenv.config();
(async()=>{await mongoose.connect(process.env.DB_CONNECTION_STR, {}, (err)=>{if(err)console.log(err);});})()
//user schema
const UserSchema=new mongoose.Schema({
    name: {type:String,required: true},
    password: {type: String,required: true},
    wins: {type: Number, required:true, default: 0}
})
mongoose.model("User", UserSchema);
const User=mongoose.model("User");

//question schema
const QuestionSchema=new mongoose.Schema({
    content: {type:String,required: true}
})
const Question=mongoose.model("Question", QuestionSchema);
// const Question=mongoose.model("Question");

//feeback schema
const FeedbackSchema=new mongoose.Schema({
    content: {type:String,required: true}
})
// mongoose.model("Feedback", FeedbackSchema)
const Feedback=mongoose.model("Feedback", FeedbackSchema);

async function addFeedback(feedback){
    const fb=new Feedback({content: feedback});
    const savedFb=await fb.save();
    console.log(savedFb);
    if(savedFb===fb){return true;}
    else{return false;}
}

// conn.close();
export {addFeedback} 