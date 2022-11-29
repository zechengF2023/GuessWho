
import "../css/HeaderBar.css"
import Tooltip from '@mui/material/Tooltip';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
function HeaderBar(props){
    return (
        <div id="headerBar">
            <div id="headerContent">
                <p id="headerGameTitle">Guess Who🐱</p>
                <div id="headerGameUsername">
                    <p>{"Welcome to the game,"}</p>
                    <p style={{color:"#808008"}}>{props.username}</p>
                </div>
            </div>

            {/* <div id="headerIcons">
                <Tooltip title="login" id="headerLoginIcon">
                    <LoginIcon fontSize="large"></LoginIcon>
                </Tooltip>
                <Tooltip title="settings">
                    <SettingsIcon fontSize="large"></SettingsIcon>
                </Tooltip>
                <Tooltip title="profile">
                    <Avatar alt="user" src=""/>
                </Tooltip>
            </div> */}
        </div>
    )
}

export default HeaderBar