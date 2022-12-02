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


//-------------------IMPORTANT-------------------
//ASSUME clients will always remain connected. Otherwise they will need to rejoin the room.
function WaitingRoom(){
    const socket=useContext(SocketContext);
    const location=useLocation();
    const [cookies, setCookie]=useCookies(null);
    const roomNumber=cookies.room;
    const [playerNames, setPlayerNames]=useState([]);
    const navigate=useNavigate();
    //prevent direct access and validate room exists. 
    useEffect(()=>{
        if(location.state==null){
            alert("Please create or join a room.");
            navigate("/");
        }
        else if(!cookies.room){
            alert("The room has been closed.");
            navigate("/");
        }
    },[cookies.room, location.state])
    //validate socket connection
    useEffect(()=>{
        if(location.state && !socket.connected){
            alert("Connection lost. Please join the room again.")
            navigate("/");
        }
    },[socket])
    
    //only requesting player number on first render
    useEffect(()=>{
        if(socket.connected && location.state){
            socket.emit("getPlayer", roomNumber);
        }
    },[socket]);
    const startGame=()=>{
        socket.emit("startGameRequest", cookies.room);
    }
    socket.on("getPlayer", (playerNames)=>{setPlayerNames(playerNames)});
    socket.on("updatePlayer",(playerNames)=>{setPlayerNames(playerNames)});
    socket.on("startGame", ()=>{navigate("/game", {state:{playerNames}});})
    return (
        <ThemeProvider theme={myTheme}>
        <div id="createPageView">
            <HeaderBar></HeaderBar>
            <div id="createCenterDiv">
                <div id="createContentDiv">
                    <p className="myText">Your room number is:</p>
                    <p className="myText">{roomNumber}</p>
                    <div id="createPlayerNumDiv">
                        <p className="myText" style={{alignSelf:"flex-start"}}>{playerNames.length+(playerNames.length>1? " players": " player")+" in the room:"}</p>
                        <p className="myText">{playerNames.reduce((str, name)=>{return str+name+" "},"")}</p>
                    </div>
                    <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginTop:"50px"}} onClick={startGame}>Start</Button>
                </div>
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default WaitingRoom;