//ask the backend for a room number.
import "../css/CreateRoom.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import Button from '@mui/material/Button';
import { SocketContext } from "../context/socket";
import { io } from "socket.io-client";

function CreateRoom(){
    const socket=useContext(SocketContext);
    const {state}=useLocation();
    const roomNumber=state.roomNumber;
    const [playerNum, setPlayerNum]=useState("");
    socket.emit("updatePlayerNum", roomNumber);
    socket.on("updatePlayerNum",(playerNum)=>{
        setPlayerNum(playerNum);
    })
    const startGame=async()=>{
        
    }
    
    return (
        <ThemeProvider theme={myTheme}>
        <div id="createPageView">
            <HeaderBar></HeaderBar>
            <div id="createCenterDiv">
                <div id="createContentDiv">
                    {/* <div id="createRoomNumberDiv"> */}
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