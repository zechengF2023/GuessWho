
import "../css/HeaderBar.css"
import Tooltip from '@mui/material/Tooltip';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
function headerBar(){
    return (
        <div id="headerBar">
            <div id="headerGameName">
                <h1 id="gameTitle">Guess Who🐱</h1>
            </div>
            <div id="headerIcons">
                <Tooltip title="login" id="headerLoginIcon">
                    <LoginIcon fontSize="large"></LoginIcon>
                </Tooltip>
                <Tooltip title="settings">
                    <SettingsIcon fontSize="large"></SettingsIcon>
                </Tooltip>
                <Tooltip title="profile">
                    <Avatar alt="user" src=""/>
                </Tooltip>
            </div>
        </div>
    )
}

export default headerBar