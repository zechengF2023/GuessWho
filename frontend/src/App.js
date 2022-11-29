import './App.css';
import Home from "./pages/Home"
import Help from "./pages/Help"
import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import GamePage from "./pages/GamePage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {SocketContext, socket} from './context/socket';
import { useCookies, CookiesProvider } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie]=useCookies(null);
  window.addEventListener("beforeunload", (evt) =>{
    socket.emit("removeUsername", cookies.username);
    removeCookie("username");
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
