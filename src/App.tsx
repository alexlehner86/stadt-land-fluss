import './App.css';
import { ThemeProvider } from '@material-ui/core';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header/Header';
import {
    MAX_GAME_ID_VALIDITY_DURATION_IN_SECONDS,
    MAX_PLAYER_ID_VALIDITY_DURATION_IN_SECONDS,
} from './constants/app.constant';
import { AppTheme, AppThemes } from './constants/themes.constant';
import Dashboard from './containers/Dashboard/Dashboard';
import GameManual from './containers/GameManual/GameManual';
import GameResults from './containers/GameResults/GameResults';
import JoinGame from './containers/JoinGame/JoinGame';
import NewGame from './containers/NewGame/NewGame';
import PlayGame from './containers/PlayGame/PlayGame';
import { StoredRunningGameInfo } from './models/game.interface';
import { StoredPlayerInfo } from './models/player.interface';
import { AppAction, setAppTheme, setStoredPlayerInfo, setStoredRunningGameInfo } from './store/app.actions';
import { AppState } from './store/app.reducer';
import { convertDateToUnixTimestamp } from './utils/general.utils';
import {
    getAppThemeIdFromLocalStorage,
    getPlayerInfoFromLocalStorage,
    getRunningGameInfoFromLocalStorage,
    removeAllDataOfRunningGameFromLocalStorage,
    setPlayerInfoInLocalStorage,
} from './utils/local-storage.utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const backspaceDisabler = require('backspace-disabler');

interface AppPropsFromStore {
    activeTheme: AppTheme;
}
interface AppDispatchProps {
    onSetAppTheme: (payload: AppTheme) => void;
    onSetStoredPlayerInfo: (payload: StoredPlayerInfo) => void;
    onSetStoredRunningGameInfo: (payload: StoredRunningGameInfo) => void;
}
interface AppProps extends AppPropsFromStore, AppDispatchProps { }

class App extends Component<AppProps> {
    public render() {
        return (
            <ThemeProvider theme={this.props.activeTheme.muiTheme}>
                <div className="app-container">
                    <HashRouter basename={process.env.PUBLIC_URL}>
                        <Header theme={this.props.activeTheme} />
                        <main
                            className={'app-main ' + this.props.activeTheme.className}
                            style={this.props.activeTheme.style}
                        >
                            <Switch>
                                <Route path="/manual" exact component={GameManual} />
                                <Route path="/newgame" exact component={NewGame} />
                                <Route path="/joingame" exact component={JoinGame} />
                                <Route path="/play" exact component={PlayGame} />
                                <Route path="/results" exact component={GameResults} />
                                <Route path="/" component={Dashboard} />
                            </Switch>
                        </main>
                    </HashRouter>
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
                this.props.onSetAppTheme(appTheme);
            }
        }
        let storedPlayerInfo = getPlayerInfoFromLocalStorage();
        const nowTimestamp = convertDateToUnixTimestamp(new Date());
        // If no stored player info was found or player's id is past validity, create a new uuid and store in local storage.
        if (!storedPlayerInfo || nowTimestamp - storedPlayerInfo.idCreationTimestamp > MAX_PLAYER_ID_VALIDITY_DURATION_IN_SECONDS) {
            storedPlayerInfo = { id: uuidv4(), idCreationTimestamp: nowTimestamp, name: storedPlayerInfo ? storedPlayerInfo.name : '' };
            setPlayerInfoInLocalStorage(storedPlayerInfo);
        }
        this.props.onSetStoredPlayerInfo(storedPlayerInfo);
        const runningGameInfo = getRunningGameInfoFromLocalStorage();
        if (runningGameInfo) {
            // A running game is only valid for the time specified in the max validity constant.
            if (nowTimestamp - runningGameInfo.idCreationTimestamp <= MAX_GAME_ID_VALIDITY_DURATION_IN_SECONDS) {
                this.props.onSetStoredRunningGameInfo(runningGameInfo);
            } else {
                removeAllDataOfRunningGameFromLocalStorage();
            }
        }
    }
}

const mapStateToProps = (state: AppState): AppPropsFromStore => {
    return {
        activeTheme: state.activeTheme
    };
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): AppDispatchProps => {
    return {
        onSetAppTheme: (payload: AppTheme) => dispatch(setAppTheme(payload)),
        onSetStoredPlayerInfo: (payload: StoredPlayerInfo) => dispatch(setStoredPlayerInfo(payload)),
        onSetStoredRunningGameInfo: (payload: StoredRunningGameInfo) => dispatch(setStoredRunningGameInfo(payload))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
