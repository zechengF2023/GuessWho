import "../css/GamePage.css"
import profileImg from "../assets/profile.jpeg"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import {myTheme} from "../components/Theme"
import { ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState, useContext } from "react"
import { SocketContext } from "../context/socket";


const GamePage=()=>{
    //TODO: handle soket disconnection, user access directly
    const socket=useContext(SocketContext);
    const playerArr=["player1", "player2", "player3"];
    const [playerScores, setPlayerScores]=useState({"player1":3, "player2":4, "player3":10});
    const [input, setInput]=useState("");
    const [selection, setSelection]=useState("");
    const [phase, setPhase]=useState("waiting"); //represent waiting, answering or guessing phase of the game
    const [question, setQuestion]=useState("What is your favorite cat?");
    const [answerToGuess, setAnswerToGuess]=useState("My favorite cat is Jiujiu cat.");
    const handleInput = (event) => {
        if(event.target.value.length<180){
            setInput(event.target.value);
        }
        else{
            alert("Reached maximum character count.")
        }
    };
    const changeSelection=(evt)=>{
        setSelection(evt.target.value);
    }
    const SideBarPlayerDiv=(name, score, keyVal)=>{
        return (
            <div className="gameViewPlayerSidebar" key={keyVal}>
                <div></div>
                <img src={profileImg} alt="profileImg"></img>
                <p>{name+": "}</p>
                <p>{score}</p>
            </div>
        )
    }
    const submitAnswer=()=>{
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="gameView">
            <div id="gameViewSideBar">
                <p>Scores:</p>
                {playerArr.map((name, idx)=>(SideBarPlayerDiv(name, playerScores[name], idx)))}
            </div>
            {phase==="answering" && 
            <div id="gameAnsweringView">
                <p>{"Question: "+question}</p>
                <TextField
                    id="gameInput"
                    label="Please enter your answer here:"
                    multiline
                    rows={2}
                    onChange={handleInput}
                    value={input}
                />
                <Button variant="contained" size="large" color="myColor"  style={{fontWeight:"bold", marginTop:"20px"}} onClick={submitAnswer}>Send</Button>
            </div>}
            {phase==="guessing" &&
            <div id="gameGuessingView">
                <p>Guess who wrote this:</p>
                <p style={{color:"#808008", fontSize:"larger"}}>{answerToGuess}</p>
                <div id="gamePlayerSelectionDiv">
                    <p>Please choose one of the players:</p>
                    <RadioGroup
                        row
                        name="row-radio-buttons-group"
                        onChange={changeSelection}
                    >
                    {playerArr.map(name=>(<FormControlLabel value={name} control={<Radio />} label={name} />))}
                    </RadioGroup>
                </div>
            </div>}
        </div>
        </ThemeProvider>
    )
}

export default GamePage