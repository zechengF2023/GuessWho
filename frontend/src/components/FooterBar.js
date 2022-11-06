import Button from '@mui/material/Button';
import {myTheme} from "./Theme"
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import "../css/Footer.css"
function Footer(){
    const navigate=useNavigate();
    const helpOnClick=()=>{
        navigate("/help");
    }
    return(
        <ThemeProvider theme={myTheme}>
            <div id="footerDiv">
                <Button variant="contained" color="myColor" size="large" className="footerButton" style={{fontWeight:"bold"}}>About</Button>
                <Button variant="contained" color="myColor" size="large" className="footerButton" style={{fontWeight:"bold"}} onClick={helpOnClick}>Help (first form is here)</Button>
            </div>
        </ThemeProvider>
    )
}
export default Footer;