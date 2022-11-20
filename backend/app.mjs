import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url';
import cors from "cors";
import * as dotenv from 'dotenv' 
import bodyParser from "body-parser"
import { Server } from "socket.io";
import { createServer } from "http";
import {addFeedback} from "./db.mjs"
import { join } from 'path';
const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
const server=createServer(app);
const io=new Server(server,{cors: {
    origin: `${process.env.FRONTEND_ADDRESS}`,
    methods: ["GET", "POST"]
}});

//TODO: modify addRoom algorithm
const addRoom=(roomArr)=>{
    if(roomArr.length>1){return -1;}
    else{
        const newRoomNum=1234;
        roomArr.push(newRoomNum);
        return newRoomNum.toString();
    }
}
const roomArr=[]; //[socketRoomNum, roomNum];
io.on("connection", (socket)=>{
    //when creating game room, create a room and add the socket to it
    socket.on("getRoomNumber", ()=>{
        let roomNum=addRoom(roomArr)
        if(roomNum==-1){socket.emit("getRoomNumber",-1);}
        else{
            socket.join(roomNum);
            socket.leave(socket.id);
            socket.emit("getRoomNumber", roomNum);
            console.log("rooms:", socket.rooms);
        }
    })
    socket.on("joinRoom", (roomNum)=>{
        //if room exists: join the room, broadcast the player number
        if(io.sockets.adapter.rooms.get(roomNum)){
            socket.emit("joinRoom", 1);
            socket.join(roomNum.toString());
            console.log("join successful");
        }
        else{
            socket.emit("joinRoom", 0);
            console.log("join failed");
        }
    })
    socket.on("updatePlayerNum", (roomNum)=>{
        socket.emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
    })
    socket.on("disconnect", ()=>{
        socket.leave(socket.rooms);
    })

})

app.post("/help",async(req, res)=>{
    let s=await addFeedback(req.body.feedback);
    if(s){res.status(200);}
    else{res.status(500);}
    res.end();
})



server.listen(process.env.PORT || 3000);
