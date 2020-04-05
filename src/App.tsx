import './App.css';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { PUBNUB_CONFIG } from './config/pubnub.config';
import { AppTheme, AppThemes } from './constants/themes.constant';
import { Dashboard } from './containers/Dashboard/Dashboard';
import { JoinGame } from './containers/JoinGame/JoinGame';
import { NewGame } from './containers/NewGame/NewGame';

const pubNubClient = new PubNub(PUBNUB_CONFIG);
// const channels = ['awesomeChannel12345'];

interface AppState {
    activeTheme: AppTheme;
}

class App extends Component<any, AppState> {
    public state: AppState = {
        activeTheme: AppThemes[0],
    };

    public render() {
        return (
            <PubNubProvider client={pubNubClient}>
                <div className="app-container">
                    <Header
                        theme={this.state.activeTheme}
                        username="Alex"
                        switchTheme={this.switchThemeHandler}
                    />
                    <BrowserRouter>
                        <main className={'app-main ' + this.state.activeTheme.className}>
                            <div className="main-content-wrapper">
                                <Route path="/" exact component={Dashboard} />
                                <Route path="/newgame" exact component={NewGame} />
                                <Route path="/joingame" exact component={JoinGame} />
                            </div>
                        </main>
                    </BrowserRouter>
                </div>
            </PubNubProvider>
        );
    }

    private switchThemeHandler = (newTheme: AppTheme) => {
        this.setState({ activeTheme: newTheme });
    }
}

export default App;
