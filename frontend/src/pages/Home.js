import "../css/Home.css"
import {myTheme} from "../components/Theme"
import HeaderBar from "../components/HeaderBar"
import Button from '@mui/material/Button';
import FooterBar from "../components/FooterBar"
import { ThemeProvider } from '@mui/material/styles';
function Home(){
    return (
        <ThemeProvider theme={myTheme} id="theme">
        <div id="homePageView">
            <HeaderBar></HeaderBar>
            <div id="homeContentDiv">
                <div id="homeButtonDiv">
                    <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold", marginBottom:"50px"}}>Create a room</Button>
                    <Button variant="contained" color="myColor" size="large" className="homeButton" style={{fontWeight:"bold"}}>Join a room</Button>
                </div>
            </div>
            <FooterBar></FooterBar>
        </div>
        </ThemeProvider>
    )
}

export default Home