import "../css/GamePage.css"
import profileImg from "../assets/profile.jpeg"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import {myTheme} from "../components/Theme"
import { ThemeProvider } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from "react"

const GamePage=()=>{
    //TODO:
    const playerArr=["player1", "player2", "player3"];
    const playerInfo={"player1":3, "player2":4, "player3":10};
    const [input, setInput]=useState("");
    const [selection, setSelection]=useState("");
    const [isGuessing, toGuessPhase]=useState(true); //represent answering or guessing phase of the game
    const handleInput = (event) => {
        if(event.target.value.length<180){
            setInput(event.target.value);
        }
        else{
            alert("Reached maximum character limit.")
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
    const question="What is your favorite cat?";
    const answerToDisplay="My favorite cat is Jiujiu cat."
    const submitAnswer=()=>{
    }
    return (
        <ThemeProvider theme={myTheme}>
        <div id="gameView">
            <div id="gameViewSideBar">
                <p>Scores:</p>
                {playerArr.map((name, idx)=>(SideBarPlayerDiv(name, playerInfo[name], idx)))}
            </div>
            {!isGuessing && <div id="gameAnsweringView">
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
            {isGuessing &&
            <div id="gameGuessingView">
                <p>Guess who wrote this:</p>
                <p style={{color:"#808008", fontSize:"larger"}}>{answerToDisplay}</p>
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