import "../css/Home.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import Button from '@mui/material/Button';
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {SocketContext} from "../context/socket"
import { useCookies } from 'react-cookie';

//TODO: if multiple pages exist on the same browser, close previous sockets?
function Home(){
    const socket=useContext(SocketContext);
    const [cookies, setCookies]=useCookies(["room"]);
    //if current in a room: exit the room and set room to null
    if(cookies.room){
        console.log("trying to exit");
        socket.emit("exitRoom", cookies.room);
        setCookies("room", null);
    }
    const navigate=useNavigate();
    const createRoom=async()=>{
        //backend create a room number. -1 if no available room
        socket.emit("getRoomNumber","");
        socket.on("getRoomNumber", (roomNumber)=>{
            setCookies("room", roomNumber);
            navigate("/createRoom",{state:{roomNumber}});
            // alert("Maximum room number reached. Please try again later...")
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