import "../css/Help.css"
import Header from "../components/HeaderBar"
import Footer from "../components/FooterBar"
import {myTheme} from "../components/Theme"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function Help(){
    const navigate=useNavigate();
    const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={()=>{navigate("/");}}>
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />Home
    </Link>,     
    <Typography key="2" color="text.primary">Help</Typography>];
    const [feedback, setFeedback] = useState("");
    const handleChange = (event) => {
        if(event.target.value.length<180){
            setFeedback(event.target.value);
        }
    };
    const submit=async()=>{
        if(feedback.length==0){
            alert("Cannot submit empty response.");
            return;
        }
        console.log(process.env.REACT_APP_BACKEND);
        const res=await axios.post(`${process.env.REACT_APP_BACKEND}/help`, {feedback});
        if(res.status==200){
            alert("Thank you for your response!")
            navigate("/");
        }
        else{
            alert("An error occured. Please try again later...");
        }
    }
    return(
    <ThemeProvider theme={myTheme}>
    <div id="helpPage">
        <Header/>
        <div id="helpPageContent">
        <div id="breadCrumbs">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </div>
        <div id="helpQuestions">
            <h2 id="helpQuestionTitle">Frequently asked questions: </h2>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>How to play this game?</Typography>
                </AccordionSummary>
            <AccordionDetails>
            <Typography>
                Use your mouse and keyboard. 
            </Typography>
            </AccordionDetails>
        </Accordion>
        <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>How do I win?</Typography>
                </AccordionSummary>
            <AccordionDetails>
            <Typography>
                By making correct guesses. 
            </Typography>
            </AccordionDetails>
        </Accordion>
        <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>How to report bugs?</Typography>
                </AccordionSummary>
            <AccordionDetails>
            <Typography>
                There is no bug. 
            </Typography>
            </AccordionDetails>
        </Accordion>
        </div>
        <div id="helpMessage">
            <h2>Send us a message:</h2>
            <div id="helpMessageContent">
                <TextField
                    id="helpPageUserFeedback"
                    label="Please enter your message here:"
                    multiline
                    rows={2}
                    onChange={handleChange}
                    value={feedback}
                />
                <div id="helpSubmitBtn">
                <Button variant="contained" size="large" color="myColor"  style={{fontWeight:"bold", marginBottom:"50px"}} onClick={submit}>Send</Button>
                </div>
            </div>
        </div>
        </div>
        <Footer/>
    </div>
    </ThemeProvider>
)}


export default Help