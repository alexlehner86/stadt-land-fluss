import './App.css';
import { ThemeProvider } from '@material-ui/core';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header/Header';
import { MAX_PLAYER_ID_VALIDITY_DURATION_IN_SECONDS as MAX_PLAYER_ID_VALIDITY_IN_SECONDS } from './constants/app.constant';
import { AppTheme, AppThemes } from './constants/themes.constant';
import { Dashboard } from './containers/Dashboard/Dashboard';
import GameResults from './containers/GameResults/GameResults';
import JoinGame from './containers/JoinGame/JoinGame';
import NewGame from './containers/NewGame/NewGame';
import PlayGame from './containers/PlayGame/PlayGame';
import { StoredPlayerInfo } from './models/player.interface';
import { AppAction, setStoredPlayerInfo } from './store/app.actions';
import { convertDateToUnixTimestamp } from './utils/general.utils';
import {
    getAppThemeIdFromLocalStorage,
    getPlayerInfoFromLocalStorage,
    setAppThemeIdInLocalStorage,
    setPlayerInfoInLocalStorage,
} from './utils/local-storage.utils';

const backspaceDisabler = require('backspace-disabler');

interface AppDispatchProps {
    onSetStoredPlayerInfo: (payload: StoredPlayerInfo) => void
}
interface AppState {
    activeTheme: AppTheme;
}
class App extends Component<AppDispatchProps, AppState> {
    public state: AppState = {
        activeTheme: AppThemes[0],
    };

    public render() {
        return (
            <ThemeProvider theme={this.state.activeTheme.muiTheme}>
                <div className="app-container">
                    <Header
                        theme={this.state.activeTheme}
                        switchTheme={this.switchThemeHandler}
                    />
                    <main
                        className={'app-main ' + this.state.activeTheme.className}
                        style={this.state.activeTheme.style}
                    >
                        <HashRouter basename={process.env.PUBLIC_URL}>
                            <Switch>
                                <Route path="/" exact component={Dashboard} />
                                <Route path="/newgame" exact component={NewGame} />
                                <Route path="/joingame" exact component={JoinGame} />
                                <Route path="/play" exact component={PlayGame} />
                                <Route path="/results" exact component={GameResults} />
                            </Switch>
                        </HashRouter>
                    </main>
                </div>
            </ThemeProvider>
        );
    }

    public componentDidMount() {
        // Prevent browser back on backspace (e.g. in Firefox).
        backspaceDisabler.disable();
        const appThemeId = getAppThemeIdFromLocalStorage();
        if (appThemeId) {
            const appTheme = AppThemes.find(theme => theme.id === appThemeId);
            if (appTheme) {
                this.setState({ activeTheme: appTheme });
            }
        }
        let storedPlayerInfo = getPlayerInfoFromLocalStorage();
        const nowTimestamp = convertDateToUnixTimestamp(new Date());
        // If no stored player info was found or player's id is past validity, create a new uuid and store in local storage.
        if (!storedPlayerInfo || nowTimestamp - storedPlayerInfo.idCreationTimestamp > MAX_PLAYER_ID_VALIDITY_IN_SECONDS) {
            storedPlayerInfo = { id: uuidv4(), idCreationTimestamp: nowTimestamp, name: storedPlayerInfo ? storedPlayerInfo.name : '' };
            setPlayerInfoInLocalStorage(storedPlayerInfo);
        }
        this.props.onSetStoredPlayerInfo(storedPlayerInfo);
    }

    private switchThemeHandler = (newTheme: AppTheme) => {
        this.setState({ activeTheme: newTheme });
        setAppThemeIdInLocalStorage(newTheme.id);
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): AppDispatchProps => {
    return {
        onSetStoredPlayerInfo: (payload: StoredPlayerInfo) => {
            dispatch(setStoredPlayerInfo(payload))
        }
    }
};
export default connect(null, mapDispatchToProps)(App);
