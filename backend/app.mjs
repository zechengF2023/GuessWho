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

//generate a different random four-digit number as a string
const generateRoom=(roomArr)=>{
    while(1){
        let num="";
        for(let i=0;i<4;i++){
            num+=(Math.floor(Math.random()*10)).toString();
        }
        if(!(num in roomArr)){
            roomArr.push(num);
            return num;
        }
    }
}

//remove room from roomArr
const removeRoom=(roomArr, roomNum)=>{
    roomArr.splice(roomArr.indexOf(roomNum), 1);
}

const roomArr=[]; 
io.on("connection", (socket)=>{
    //when creating game room, create a room and add the socket to it
    socket.on("getRoomNumber", ()=>{
        let roomNum=generateRoom(roomArr);
        socket.join(roomNum);
        console.log("Room created. Current rooms are:",io.sockets.adapter.rooms);
        socket.emit("getRoomNumber", roomNum);
    })
    socket.on("joinRoom", (roomNum)=>{
        //if room exists: join the room, broadcast the player number
        if(io.sockets.adapter.rooms.get(roomNum)){
            socket.emit("joinRoom", 1);
            socket.join(roomNum.toString());
            io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
            console.log("join successful");
        }
        else{
            socket.emit("joinRoom", 0);
            console.log("join failed");
        }
    })
    socket.on("getPlayerNum",(roomNum)=>{
        socket.emit("getPlayerNum", io.sockets.adapter.rooms.get(roomNum)?.size);
    })
    socket.on("updatePlayerNum", (roomNum)=>{
        socket.emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
    })
    socket.on("exitRoom", (roomNumber)=>{
        socket.leave(roomNumber,()=>{
           console.log("left room.");
        });
        //TODO: decide if last player
        removeRoom(roomArr, roomNumber);
        console.log("Exited. Current rooms are:",io.sockets.adapter.rooms);
        // socket.leave(roomNumber, ()=>{
        //     removeRoom(roomArr, roomNumber);
        //     console.log("Exited. Current rooms are:",io.sockets.adapter.rooms);
        // });
    })
    socket.on("disconnect", ()=>{
        socket.leave(socket.rooms);
        console.log("Disconnected. Current rooms are:",io.sockets.adapter.rooms);
    })

})

app.post("/help",async(req, res)=>{
    let s=await addFeedback(req.body.feedback);
    if(s){res.status(200);}
    else{res.status(500);}
    res.end();
})



server.listen(process.env.PORT || 3000);
