import './App.css';

import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React, { Component, CSSProperties, Dispatch, lazy, Suspense } from 'react';
import { LiveAnnouncer } from 'react-aria-live';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header/Header';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import NewVersionSnackbar from './components/NewVersionSnackbar/NewVersionSnackbar';
import {
    MAX_GAME_ID_VALIDITY_DURATION_IN_SECONDS,
    MAX_PLAYER_ID_VALIDITY_DURATION_IN_SECONDS,
    SERVICE_WORKER_SKIP_WAITING,
} from './constants/app.constant';
import { AppTheme, AppThemes } from './constants/themes.constant';
import Dashboard from './containers/Dashboard/Dashboard';
import { StoredRunningGameInfo } from './models/game.interface';
import { StoredPlayerInfo } from './models/player.interface';
import * as serviceWorker from './serviceWorker';
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

// Preload all routes available from the dashboard in the background.
export const a11yStatementPromise = import('./containers/AccessibilityStatement/AccessibilityStatement');
export const aboutTheGamePromise = import('./containers/AboutTheGame/AboutTheGame');
export const gameManualPromise = import('./containers/GameManual/GameManual');
export const joinGamePromise = import('./containers/JoinGame/JoinGame');
export const newGamePromise = import('./containers/NewGame/NewGame');
export const playGamePromise = import('./containers/PlayGame/PlayGame');

// Use lazy loading of routes to speed up time to FCP (first contentful paint)
const AboutTheGame = lazy(() => aboutTheGamePromise);
const AccessibilityStatement = lazy(() => a11yStatementPromise);
const GameManual = lazy(() => gameManualPromise);
const GameResults = lazy(() => import('./containers/GameResults/GameResults'));
const JoinGame = lazy(() => joinGamePromise);
const NewGame = lazy(() => newGamePromise);
const PlayGame = lazy(() => playGamePromise);

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

interface AppComponentState {
    waitingWorker: ServiceWorker | null,
    newVersionAvailable: boolean
}

class App extends Component<AppProps, AppComponentState> {
    public state: AppComponentState = {
        waitingWorker: null,
        newVersionAvailable: false
    };

    public render() {
        const mainContent = (
            <main
                className={'app-main ' + this.props.activeTheme.className}
                style={this.props.activeTheme.style as CSSProperties}
            >
                <Suspense fallback={<LoadingScreen />}>
                    <Switch>
                        <Route path="/about" exact component={AboutTheGame} />
                        <Route path="/accessibility" exact component={AccessibilityStatement} />
                        <Route path="/joingame" exact component={JoinGame} />
                        <Route path="/manual" exact component={GameManual} />
                        <Route path="/newgame" exact component={NewGame} />
                        <Route path="/play" exact component={PlayGame} />
                        <Route path="/results" exact component={GameResults} />
                        <Route path="/" component={Dashboard} />
                    </Switch>
                </Suspense>
            </main>
        );
        const newVersionSnackbar = (
            <NewVersionSnackbar updateServiceWorker={this.updateServiceWorker}></NewVersionSnackbar>
        );
        return (
            <ThemeProvider theme={this.props.activeTheme.muiTheme}>
                <SnackbarProvider maxSnack={3}>
                    <LiveAnnouncer>
                        <div className="app-container">
                            <HashRouter basename={process.env.PUBLIC_URL}>
                                <Header theme={this.props.activeTheme} />
                                {mainContent}
                            </HashRouter>
                        </div>
                    </LiveAnnouncer>
                    {this.state.newVersionAvailable ? newVersionSnackbar : null}
                </SnackbarProvider>
            </ThemeProvider>
        );
    }

    public componentDidMount() {
        serviceWorker.register({ onUpdate: this.onServiceWorkerUpdate });
        // Prevent browser back on backspace (e.g. in Firefox).
        backspaceDisabler.disable();
        this.restoreAppTheme();
        const nowTimestamp = convertDateToUnixTimestamp(new Date());
        this.restorePlayerInfo(nowTimestamp);
        this.restoreRunningGameInfo(nowTimestamp);
    }

    private restoreAppTheme = (): void => {
        const appThemeId = getAppThemeIdFromLocalStorage();
        if (appThemeId) {
            const appTheme = AppThemes.find(theme => theme.id === appThemeId);
            if (appTheme) {
                this.props.onSetAppTheme(appTheme);
            }
        }
    }

    private restorePlayerInfo = (nowTimestamp: number): void => {
        let storedPlayerInfo = getPlayerInfoFromLocalStorage();
        // If no stored player info was found or player's id is past validity, create a new uuid and store in local storage.
        if (!storedPlayerInfo || nowTimestamp - storedPlayerInfo.idCreationTimestamp > MAX_PLAYER_ID_VALIDITY_DURATION_IN_SECONDS) {
            storedPlayerInfo = { id: uuidv4(), idCreationTimestamp: nowTimestamp, name: storedPlayerInfo ? storedPlayerInfo.name : '' };
            setPlayerInfoInLocalStorage(storedPlayerInfo);
        }
        this.props.onSetStoredPlayerInfo(storedPlayerInfo);
    }

    private restoreRunningGameInfo = (nowTimestamp: number): void => {
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

    private onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
        // Only alert user to new version, if they're not in the middle of playing a game.
        if (!window.location.href.includes('/play')) {
            this.setState({
                waitingWorker: registration && registration.waiting,
                newVersionAvailable: true
            });
        }
    }

    private updateServiceWorker = (): void => {
        const { waitingWorker } = this.state;
        waitingWorker && waitingWorker.postMessage({ type: SERVICE_WORKER_SKIP_WAITING });
        this.setState({ newVersionAvailable: false });
        window.location.reload();
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
