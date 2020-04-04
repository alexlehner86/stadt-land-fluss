import './App.css';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { PUBNUB_CONFIG } from './config/pubnub.config';
import { HeaderTheme, HeaderThemes } from './constants/themes.constant';
import { Dashboard } from './containers/Dashboard/Dashboard';
import { NewGame } from './containers/NewGame/NewGame';

const pubNubClient = new PubNub(PUBNUB_CONFIG);
// const channels = ['awesomeChannel12345'];

interface AppState {
    headerTheme: HeaderTheme;
}

class App extends Component<any, AppState> {
    public state: AppState = {
        headerTheme: HeaderThemes[0],
    };

    public render() {
        return (
            <PubNubProvider client={pubNubClient}>
                <div className="app-container">
                    <Header
                        theme={this.state.headerTheme}
                        username="Alex"
                        switchTheme={this.switchThemeHandler}
                    />
                    <BrowserRouter>
                        <main className="app-main">
                            <Route path="/newgame" exact render={() => <NewGame />} />
                            <Route path="/" render={() => <Dashboard />} />
                        </main>
                    </BrowserRouter>
                </div>
            </PubNubProvider>
        );
    }

    private switchThemeHandler = (newTheme: HeaderTheme) => {
        this.setState({ headerTheme: newTheme });
    }
}

export default App;
