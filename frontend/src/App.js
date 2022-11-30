import './App.css';
import Home from "./pages/Home"
import Help from "./pages/Help"
import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import GamePage from "./pages/GamePage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {SocketContext, socket} from './context/socket';
import { useCookies, CookiesProvider } from "react-cookie";
import { useBeforeunload } from 'react-beforeunload';

function App() {
  const [cookies, setCookie, removeCookie]=useCookies(null);
  //if user closes the tab:
  // useBeforeunload((evt)=>{
  //   socket.emit("tabClose", {username: cookies.username, roomNum: cookies.room});
  //   removeCookie("username");
  //   removeCookie("room");
  // });
  window.addEventListener("beforeunload", (evt) =>{
    socket.emit("tabClose", {username: cookies.username, roomNum: cookies.room});
    removeCookie("username");
    removeCookie("room");
  });

  return (
    <CookiesProvider>
    <SocketContext.Provider value={socket}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/help" element={<Help/>}/>
        <Route path="/createRoom" element={<CreateRoom/>}></Route>
        <Route path="/join" element={<JoinRoom/>}></Route>
        <Route path="/game" element={<GamePage/>}></Route>
      </Routes>
    </Router>
    </SocketContext.Provider>
    </CookiesProvider>
  );
}

export default App;
