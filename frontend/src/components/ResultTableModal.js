import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ThemeProvider } from '@mui/material/styles';
import {myTheme} from "../components/Theme"
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import "../css/GameResultModal.css"

function ResultTableModal(props) {
    const [cookies, setCookies]=useCookies(null);
    const navigate=useNavigate();
    const rows=[];
    props.players.forEach((name)=>{
      const row={name, score:props.scores[name]};
      props.isCorrect[name]==1? row["isCorrect"]="correct":row["isCorrect"]="incorrect";
      rows.push(row);
    })
    const exitGame=()=>{
      navigate("/");
    }
    let winner_str="";
    //find the winner using scores:{} and players[]
    if(props.isEnd){
      let currHighest=0;
      let currWinners=[];
      props.players.forEach(player=>{
        let score=props.scores[player];
        if(player==cookies.username){player="You";}
        if(score==currHighest){currWinners.push(player);}
        else if(score>currHighest){
          currWinners=[player];
          currHighest=score;
        }
      })
      currWinners.forEach((winner, idx)=>{
        if(idx!=currWinners.length-1){winner_str+=winner+" and ";}
        else{winner_str+=winner+" ";}
      });
      currWinners.length==1 && currWinners[0]!="You" ? winner_str+="wins!" : winner_str+="win!";
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "60%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        outline: 0,
        backgroundColor:"#F5F5DC",
        border: "0px",
        borderRadius: "10px",
        display:"flex",
        flexDirection: "column",
        alignItems: "center"
    };
    return (
    <ThemeProvider theme={myTheme}>
    <div id="gameResultModal">
        <Modal
            open={true}
            onClose={()=>{}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight:"bold", marginBottom:"1vh"}}>
              {!props.isEnd && "Score board"}
              {props.isEnd && winner_str}
            </Typography>
            <TableContainer style={{maxWidth:"80vw", maxHeight:"70vh"}} component={Paper}>
              <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" style={{fontWeight:"bold"}}>Username</TableCell>
                    <TableCell align="left" style={{fontWeight:"bold"}}>Score</TableCell>
                    <TableCell align="left" style={{fontWeight:"bold"}}>Answer for question {1}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx)=>(
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="left">{row.score}</TableCell>
                      <TableCell align="left">{row.isCorrect}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {props.isEnd && <Button variant="contained" color="myColor" size="large" style={{fontWeight:"bold", marginTop: "3vh", width:"8vw"}} onClick={exitGame}>OK</Button>}
            </Box>
        </Modal>
    </div>
    </ThemeProvider>
  );
}

export default ResultTableModal;