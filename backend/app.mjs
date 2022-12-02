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
const usernameDic={}; //store all active usernames as {socket:username}
const socket_Room_Dic={}; //store socket_id: roomNum. purpose: to remove user from the game instance when disconnect. 
const roomDic={}; //key is roomNum string, value is a Game object

//create a unique username and add to usernameDic.
//return the username created.
const addUsername=(nameCounter, usernameDic, socket)=>{
    const newName="player"+nameCounter;
    usernameDic[socket.id]=newName;
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
        if(num in roomDic){continue;}
        else{
            roomDic[num]=new Game(io, username, num);
            return num;
        }
    }
}.bind(null, roomDic);

//takes 3 arguments: username, roomNum, socket
//delete the user everywhere
const removeUsr=function(roomDic, usernameDic, io, username, roomNum, socket){
    //remove from usernameDic
    delete usernameDic[socket.id];
    //remove from the Game instance(if the Game instance exists)
    roomDic[roomNum]?.removePlayer()
    //if the room exists
    if(io.sockets.adapter.rooms.get(roomNum)){
        //if no player left in the room, remove it
        if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
            removeRoom(roomNum);
        }
        //if still players in the room, broadcast to update player number
        else{
            //TODO: broadcast
            updatePlayer(socket, roomNum);
            // io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
        }
    }
    socket.leave(roomNum);
}.bind(null, roomDic, usernameDic, io);

//take 1 arg: roomNum
//remove room from roomDic
const removeRoom=function(roomDic, roomNum){
    delete roomDic[roomNum];
}.bind(null, roomDic)

//take 2 args: socket, roomNum
//send "updatePlayerNum" and "updatePlayer" signals to all clients in the room
const updatePlayer=function (socket, roomNum){
    socket.emit("updatePlayer", roomDic[roomNum].players);
    socket.broadcast.to(roomNum).emit("updatePlayer", roomDic[roomNum].players);
}

io.on("connection", (socket)=>{
    socket.leave(socket.id); //each socket is only in one room
    //------------------------- handle creating/joining room --------------------------------
    //return username if the client doesn't have a valid one, otherwise return null
    socket.on("getUsername", ()=>{
        //name is valid if socket.id is in usernameDic.
        socket.emit("getUsername", socket.id in usernameDic ? null:addUsername(userCounter,usernameDic,socket));
        userCounter++;
    })
    //when creating game room, create a room and add the socket to it
    socket.on("createRoom", (creatorName)=>{
        let roomNum=generateRoom(creatorName); 
        socket.join(roomNum);
        socket_Room_Dic[socket.id]=roomNum;
        console.log("Room created. Current rooms are:",io.sockets.adapter.rooms);
        socket.emit("createRoomResponse", roomNum);
    })
    socket.on("joinRoom", async(req)=>{
        const {username, roomNum}=req;
        //if room exists: join the room, broadcast the player number
        if(io.sockets.adapter.rooms.get(roomNum)){
            socket.join(roomNum.toString());
            socket_Room_Dic[socket.id]=roomNum;
            const game=roomDic[roomNum];
            await game.addPlayer(username);
            socket.emit("joinRoom", 1);
            updatePlayer(socket, roomNum);
            // io.to(roomNum).emit("updatePlayerNum", io.sockets.adapter.rooms.get(roomNum).size);
            console.log("Join successful. Current rooms are",io.sockets.adapter.rooms );
        }
        else{
            socket.emit("joinRoom", 0);
            console.log("join failed");
        }
    })
    socket.on("getPlayer",(roomNum)=>{
        updatePlayer(socket, roomNum);
    })
    socket.on("updatePlayer", (roomNum)=>{
        updatePlayer(socket, roomNum);
    })

    //------------------------- handle game process --------------------------------
    socket.on("startGameRequest", async(roomNum)=>{
        socket.broadcast.to(roomNum).emit('startGame');
        socket.emit('startGame');
        // io.of("/").in(roomNum).emit("startGame");
        const room=roomDic[roomNum];
        await room.startGame(1, socket);
        delete roomDic[roomNum];
    })
    socket.on("answer", async(req)=>{
        const {roomNum, username, answer}=req;
        const game=roomDic[roomNum];
        //use mutex to protect answers
        await game.answersMutex.acquire();
        game.answers[game.questionCount][username]=answer;
        game.answersMutex.release();
    })
    socket.on("guess", async(req)=>{
        const {roomNum, username, guess}=req;
        const game=roomDic[roomNum];
        await game.guessesMutex.acquire();
        game.guesses[game.questionCount][username]=guess;
        game.guessesMutex.release();
    })

    //------------------------- handle user exiting --------------------------------
    //remove username, remove room if it is the last player
    socket.on("tabClose", (req)=>{
        const {username, roomNum}=req;
        removeUsr(username,roomNum,socket);
    })
    //if user has a room stored in cookie at homepage before creating/joining a room: exit that room
    socket.on("exitRoom", ()=>{
        //remove player from Game instance and socket_Room_Dic.
        const roomNum=socket_Room_Dic[socket.id];
        delete socket_Room_Dic[socket.id];
        roomDic[roomNum]?.removePlayer(usernameDic[socket.id]);
        //if the room exists
        if(io.sockets.adapter.rooms.get(roomNum)){
            //if no player left in the room, remove it
            if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
                removeRoom(roomNum);
            }
            //if still players in the room, broadcast to update player number
            else{
                updatePlayer(socket, roomNum);
            }
        }
        socket.leave(roomNum);
        console.log("Exiting, roomDic:", roomDic);
        console.log("Exited. Current rooms are:",io.sockets.adapter.rooms);
    })
    //IMPORTANT: users will need to join the room again if disconnected.
    socket.on("disconnect", ()=>{
        //remove player from Game instance, socket_Room_Dic, and usernameDic.
        const roomNum=socket_Room_Dic[socket.id];
        delete socket_Room_Dic[socket.id];
        roomDic[roomNum]?.removePlayer(usernameDic[socket.id]);
        delete usernameDic[socket.id];
        //if the room exists
        if(io.sockets.adapter.rooms.get(roomNum)){
            //if no player left in the room, remove it
            if(io.sockets.adapter.rooms.get(roomNum)?.size==1){
                removeRoom(roomNum);
            }
            //if still players in the room, broadcast to update player number
            else{
                updatePlayer(socket, roomNum);
            }
        }
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
