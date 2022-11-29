//ask the backend for a room number.
import "../css/CreateRoom.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { SocketContext } from "../context/socket";
import { useCookies } from "react-cookie";

function CreateRoom(){
    const socket=useContext(SocketContext);
    const location=useLocation();
    const [cookies, setCookies]=useCookies(["room"]);
    const roomNumber=cookies.room;
    const [playerNum, setPlayerNum]=useState(null);
    const navigate=useNavigate();
    //prevent user direct access and validate room exists. 
    useEffect(()=>{
        if(location.state==null){
            alert("Please create or join a room.");
            navigate("/");
        }
        else if(!cookies.room){
            alert("The room has been closed.");
            navigate("/");
        }
    },[location.room, location.state])
    //validate socket connection
    useEffect(()=>{
        if(location.state && !socket.connected){
            alert("Connection lost. Reconnecting...")
        }
    },[socket])
    
    //only requesting player number on first render
    useEffect(()=>{
        // if(socket.connected && location.state){
            console.log("sending request");
            socket.emit("getPlayerNum", roomNumber);
        // }
    },[socket]);
    socket.on("getPlayerNum", (playerNumber)=>{
        console.log("received: ", playerNumber);
        setPlayerNum(playerNumber)
    });
    socket.on("updatePlayerNum",(playerNumber)=>{if(playerNumber!==playerNum){setPlayerNum(playerNumber)}});
    socket.on("startGame", ()=>{});
    const startGame=async()=>{
        console.log(typeof(cookies.room));
        // socket.emit("startGameRequest", cookies.room);
        // navigate("/game");
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="createPageView">
            <HeaderBar></HeaderBar>
            <div id="createCenterDiv">
                <div id="createContentDiv">
                    <p className="myText">Your room number is:</p>
                    <p className="myText">{roomNumber}</p>
                    <div id="createPlayerNumDiv">
                        <p className="myText" style={{alignSelf:"flex-start"}}>Number of players in the room:</p>
                        <p className="myText">{playerNum}</p>
                    </div>
                    <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginTop:"50px"}} onClick={startGame}>Start</Button>
                </div> 
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default CreateRoom;