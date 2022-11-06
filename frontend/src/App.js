import './App.css';
import Home from "./pages/Home"
import Help from "./pages/Help"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/help" element={<Help/>}/>
      </Routes>
    </Router>
  );
}

export default App;
