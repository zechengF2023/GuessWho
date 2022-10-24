import mongoose from "mongoose";
import * as dotenv from 'dotenv' 
dotenv.config()
const conn=mongoose.createConnection(process.env.DB_CONNECTION_STR);
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
mongoose.model("Question", QuestionSchema);
const Question=mongoose.model("Question");

mongoose.connection.close();