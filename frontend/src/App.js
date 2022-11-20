import './App.css';
import Home from "./pages/Home"
import Help from "./pages/Help"
import CreateRoom from "./pages/CreateRoom"
import JoinRoom from "./pages/JoinRoom"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {SocketContext, socket} from './context/socket';

function App() {
  return (
    <SocketContext.Provider value={socket}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/help" element={<Help/>}/>
        <Route path="/createRoom" element={<CreateRoom/>}></Route>
        <Route path="/join" element={<JoinRoom/>}></Route>
      </Routes>
    </Router>
    </SocketContext.Provider>
  );
}

export default App;
