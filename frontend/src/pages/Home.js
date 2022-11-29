import "../css/Home.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import Button from '@mui/material/Button';
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import {SocketContext} from "../context/socket"
import { useCookies } from 'react-cookie';

//TODO: if multiple pages exist on the same browser, close previous sockets?
function Home(){
    const socket=useContext(SocketContext);
    const [cookies, setCookie, removeCookie]=useCookies(null);
    const navigate=useNavigate();
    useEffect(()=>{
        //get username
        if(!cookies.username){
            socket.emit("getUsername");
        }
        //if current in a room: exit the room and set room to null
        if(cookies.room){
            socket.emit("exitRoom", cookies.room);
            removeCookie("room");
        }
    },[])
    socket.on("getUsername", (name)=>{
        console.log(name);
        setCookie("username", name);
    });
    const createRoom=async()=>{
        //backend create a room number. -1 if no available room
        socket.emit("getRoomNumber");

        //TODO: send username...
        socket.on("getRoomNumber", (roomNumber)=>{
            setCookie("room", roomNumber);
            navigate("/createRoom",{state:{roomNumber}});
        })
    }
    const joinRoom=()=>{
        navigate("/join");
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="homePageView">
            <HeaderBar username={cookies.username}></HeaderBar>
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