import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url';
import cors from "cors";
import * as dotenv from 'dotenv' 
import bodyParser from "body-parser"
import {addFeedback} from "./db.mjs"
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(cors());
app.use(bodyParser.json())
// app.use(express.urlencoded({extended:false}));
dotenv.config();

app.post("/help",async(req, res)=>{
    let s=await addFeedback(req.body.feedback);
    if(s){res.status(200);}
    else{res.status(500)}
    res.end();
})

app.listen(process.env.PORT || 3000);
