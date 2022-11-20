import "../css/Home.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import Button from '@mui/material/Button';
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { io } from "socket.io-client";
import {SocketContext} from "../context/socket"

function Home(){
    const socket=useContext(SocketContext);
    const navigate=useNavigate();
    const createRoom=async()=>{
        //backend create a room number. -1 if no available room
        socket.emit("getRoomNumber","");
        socket.on("getRoomNumber", (roomNumber)=>{
            if(roomNumber!=-1){
                navigate("/createRoom",{state:{roomNumber}});
            }
            else{alert("Maximum room number reached. Please try again later...")}
        })
    }
    const joinRoom=()=>{
        navigate("/join");
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="homePageView">
            <HeaderBar></HeaderBar>
            <div id="homeCenterDiv">
                <div id="homeContentDiv">
                    <div id="homeButtonsDiv">
                        <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginBottom:"50px"}} onClick={createRoom}>Create a room</Button>
                        <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold"}} onClick={joinRoom}>Join a room</Button>
                    </div>
                </div>
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default Home