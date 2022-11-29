import "../css/JoinRoom.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from '@mui/material/Button';
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";

function JoinRoom(){
    const navigate=useNavigate();
    const [roomNumber, setRoomNumber]=useState("");
    const [cookies, setCookies]=useCookies(["room"]);
    const enterNumber=(evt)=>{
        setRoomNumber(evt.target.value.replace(/\D/g, ''));
    }
    
    //send number to backend for validation, navigate to room if success
    const joinRoom=async()=>{
        const socket=io(`${process.env.REACT_APP_BACKEND}`);
        socket.emit("joinRoom", roomNumber);
        socket.on("joinRoom", (res)=>{
            if(res){
                setCookies("room", roomNumber);
                navigate("/createRoom",);
            }
            else{alert("The room no longer exists.")}
        })
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="joinPageView">
            <HeaderBar></HeaderBar>
            <div id="joinCenterDiv">
                <div id="joinContentDiv">
                    {/* <div id="createRoomNumberDiv"> */}
                        <div id="joinRoomDiv" style={{marginTop: "60px"}}>
                        <p className="myText">Please enter room number:</p>
                        <input type="text" value={roomNumber} onChange={enterNumber}></input>
                        </div>
                        <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginTop:"50px"}} onClick={joinRoom}>Join</Button>
                </div> 
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default JoinRoom;