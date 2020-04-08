import './App.css';
import { ThemeProvider } from '@material-ui/core';
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import { AppTheme, AppThemes } from './constants/themes.constant';
import { Dashboard } from './containers/Dashboard/Dashboard';
import JoinGame from './containers/JoinGame/JoinGame';
import NewGame from './containers/NewGame/NewGame';
import PlayGame from './containers/PlayGame/PlayGame';

interface AppState {
    activeTheme: AppTheme;
}

class App extends Component<any, AppState> {
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
                    <BrowserRouter>
                        <main className={'app-main ' + this.state.activeTheme.className}>
                            <div className="main-content-wrapper">
                                <Route path="/" exact component={Dashboard} />
                                <Route path="/newgame" exact component={NewGame} />
                                <Route path="/joingame" exact component={JoinGame} />
                                <Route path="/play" exact component={PlayGame} />
                            </div>
                        </main>
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        );
    }

    private switchThemeHandler = (newTheme: AppTheme) => {
        this.setState({ activeTheme: newTheme });
    }
}

export default App;
