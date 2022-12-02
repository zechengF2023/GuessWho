import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {myTheme} from "../components/Theme"
import { ThemeProvider } from '@emotion/react';


//pass in the event handler for "submit" and "not now" button
export default function GameDialogBox(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={myTheme}>
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.isOpen}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure you want to submit?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You cannot modify your answer once submit. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" style={{fontWeight:"bold"}} color="myColor" autoFocus onClick={props.submitClose}>
            Submit
          </Button>
          <Button variant="contained" style={{fontWeight:"bold"}} color="myColor" onClick={props.notNowClose} autoFocus>
            Not now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </ThemeProvider>
  );
}