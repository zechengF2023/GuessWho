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
    console.log("page rendered");
    useEffect(()=>{
        if(location.state==null){
            alert("Please create or join a room.");
            navigate("/");
        }
        //validate socket connection
        else if(!cookies.room){
            alert("The room has been closed.");
            navigate("/");
        }
    },[location.room, location.state])
    
    // if(!socket.connected){
    //     alert("Connection lost. Reconnecting...")
    // }
    
    //only requesting player number on first render
    useEffect(()=>{
        console.log("sending request");
        socket.emit("getPlayerNum", roomNumber);
    },[])  
    socket.on("getPlayerNum", (playerNumber)=>{
        if(playerNumber!==playerNum){
            setPlayerNum(playerNumber)
        }
    });
    socket.on("updatePlayerNum",(playerNumber)=>{if(playerNumber!==playerNum){setPlayerNum(playerNumber)}});
    const startGame=async()=>{
        
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