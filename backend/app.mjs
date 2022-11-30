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
import {Game} from "./game.mjs";
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

//data storage
let userCounter=0; //used to create username
const usernameArr=[]; //store all active usernames
const roomDic={}; //key is roomNum string, value is a Game object

const generateName=(nameCounter, nameArr)=>{
    const newName="player"+nameCounter;
    nameArr.push(newName);
    return newName;
}

//takes 1 arg: username
//generate a different random four-digit number as a string, create a game object using creator's name and room number, and push it to roomDic
const generateRoom=function(roomDic,username){
    while(1){
        let num="";
        for(let i=0;i<4;i++){
            num+=(Math.floor(Math.random()*10)).toString();
        }
        if(roomDic.getOwnProeprtyNames && (num in roomDic.getOwnPropertyNames)){
            continue;
        }
        else{
            roomDic[num]=new Game(io, username, num);
            return num;
        }
    }
}.bind(null, roomDic);

//takes 3 arguments: username, roomNum, socket
//delete the user everywhere
const removeUsr=function(roomDic, usernameArr, io, username, roomNum, socket){
    //remove from usernameArr
    const idxToRemove=usernameArr.indexOf(username);
    if(idxToRemove!=-1){usernameArr.splice(idxToRemove,1);}
    //remove from the Game instance(if the Game instance exists)
    roomDic[roomNum]?.removePlayer()
    //if the room exists
    if(io.sockets.adapter.rooms.get(roomNum)){
        //if no player left in the room, remove it
        if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
            console.log("not broadcasting");
            removeRoom(roomNum);
        }
        //if still players in the room, broadcast to update player number
        else{
            console.log("broadcasting");
            io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
        }
    }
    socket.leave(roomNum);
}.bind(null, roomDic, usernameArr, io);

//take 1 arg: roomNum
//remove room from roomDic
const removeRoom=function(roomDic, roomNum){
    delete roomDic[roomNum];
}.bind(null, roomDic)


io.on("connection", (socket)=>{
    socket.leave(socket.id);
    //------------------------- handle creating/joining room --------------------------------
    socket.on("getUsername", ()=>{
        socket.emit("getUsername", generateName(userCounter,usernameArr));
        userCounter++;
    })
    //when creating game room, create a room and add the socket to it
    socket.on("createRoom", (creatorName)=>{
        let roomNum=generateRoom(creatorName); 
        socket.join(roomNum);
        console.log("Room created. Current rooms are:",io.sockets.adapter.rooms);
        socket.emit("createRoomResponse", roomNum);
    })
    socket.on("joinRoom", (req)=>{
        const {username, roomNum}=req;
        //if room exists: join the room, broadcast the player number
        if(io.sockets.adapter.rooms.get(roomNum)){
            socket.emit("joinRoom", 1);
            socket.join(roomNum.toString());
            io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
            roomDic[roomNum].addPlayer(username);
            console.log("Join successful. Current rooms are",io.sockets.adapter.rooms );
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

    //------------------------- handle game process --------------------------------
    socket.on("startGameRequest", (roomNum)=>{
        console.log(io);
        io.to(roomNum).emit("startGame");
        const room=roomDic[roomNum];
        room.startGame();
    })
    socket.on("answer", (req)=>{
        const {roomNum, username, answer}=req;
        const game=roomDic[roomNum];
        game.answers[game.questionNum][username]=answer;
    })






    

    //------------------------- handle user exiting --------------------------------
    //remove username, remove room if it is the last player
    socket.on("tabClose", (req)=>{
        console.log("received!");
        console.log(socket);
        const {username, roomNum}=req;
        removeUsr(username,roomNum,socket);
    })
    //if user has a room stored in cookie at homepage before creating/joining a room: exit that room
    socket.on("exitRoom", (roomNum)=>{
        //remove player from Game instance
        roomDic[roomNum]?.removePlayer();
        //if the room exists
        if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
            //if no player left in the room, remove it
            if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
                removeRoom(roomNum);
            }
            //if still players in the room, broadcast to update player number
            else{
                io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
            }
        }
        socket.leave(roomNum);
        console.log("Exited. Current rooms are:",io.sockets.adapter.rooms);
    })
    //IMPORTANT: users will need to join the room again if disconnected.
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
