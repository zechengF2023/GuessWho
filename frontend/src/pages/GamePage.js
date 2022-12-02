import "../css/GamePage.css"
import profileImg from "../assets/profile.jpeg"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import {myTheme} from "../components/Theme"
import { ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState, useContext} from "react"
import { useLocation } from "react-router-dom";
import { SocketContext } from "../context/socket";
import GameDialogBox from "../components/GameDialogBox"
import { useCookies } from 'react-cookie';

const GamePage=()=>{
    //TODO: handle soket disconnection, user access directly
    const socket=useContext(SocketContext);
    const [cookies, setCookies]=useCookies(null);
    const location=useLocation();
    const playerArr=location.state.playerNames;
    const [playerScores, setPlayerScores]=useState(playerArr.reduce((obj, player)=>{
        obj[player]=0
        return obj
    }, {}));
    const [input, setInput]=useState("");
    const [selection, setSelection]=useState("");
    const [phase, setPhase]=useState("answering"); //represent answering or guessing phase of the game
    const [question, setQuestion]=useState("");
    const [submitted, setSubmitted]=useState(false);
    const [dialog, setDialog]=useState(false);
    const [answerToGuess, setAnswerToGuess]=useState("");
    const [time, setTime]=useState(0);
    //TODO: do not allow direct access:
    //event handlers:
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
    const submitAnswer=()=>{
        setDialog(true);
    }
    //to submit answer:
    const dialogSubmit=()=>{
        socket.emit("answer", {roomNum: cookies.room, username: cookies.username, answer:input});
        setSubmitted(true);
        setDialog(false);
    }
    const dialogNotNow=()=>{
        setDialog(false);
    }
    //to submit guess:
    const dialogSubmitGuess=()=>{
        socket.emit("guess", {roomNum: cookies.room, username: cookies.username, guess:selection});
        setSubmitted(true);
        setDialog(false);
    }
    //components:
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
    //sockets:
    socket.on("setQuestion", question=>{setQuestion(question);})
    socket.on("setPhase", phase=>{
        setSubmitted(false);
        setDialog(false);
        setSelection("");
        setInput("");
        setPhase(phase);
    })
    socket.on("setTimer",timeToSet=>{
        setTime(timeToSet);
        //if haven't submitted, autosubmit when time is up
        if(timeToSet===0){
            if(!submitted && phase==="answering"){
                socket.emit("answer", {roomNum: cookies.room, username: cookies.username, answer:input});
            }
            else if(!submitted && phase==="guessing"){
                socket.emit("guess", {roomNum: cookies.room, username: cookies.username, guess:selection});
            }
        }
    })
    socket.on("setAnswerToGuess", answer=>{
        setAnswerToGuess(answer);
    })
    socket.on("setScores", scores=>{
        console.log(scores);
        setPlayerScores(scores);
    })
    socket.on("gameEnds",()=>{
        
    })
    return (
        <ThemeProvider theme={myTheme}>
        <div id="timer">
            <p>Timer:</p>
            <p>{time+" seconds"}</p>
        </div>
        <GameDialogBox isOpen={dialog} submitClose={phase=="answering" ? dialogSubmit:dialogSubmitGuess} notNowClose={dialogNotNow}/>
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
                    onChange={!submitted&&handleInput}
                    value={input}
                />
                {!submitted && <Button variant="contained" size="large" color="myColor"  style={{fontWeight:"bold", marginTop:"20px"}} onClick={submitAnswer}>Submit</Button>}
                {submitted && <p>Waiting for other players...</p>}
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
                    {!submitted && <Button variant="contained" size="large" color="myColor"  style={{fontWeight:"bold", marginTop:"20px"}} onClick={submitAnswer}>Submit</Button>}
                    </RadioGroup>
                </div>
            </div>}
        </div>

        </ThemeProvider>
    )
}

export default GamePage