import './App.css';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { PUBNUB_CONFIG } from './config/pubnub.config';
import { Header} from './components/Header/Header';

const pubNubClient = new PubNub(PUBNUB_CONFIG);
// const channels = ['awesomeChannel12345'];

class App extends Component {
    render() {
        return (
            <PubNubProvider client={pubNubClient}>
                <div className="app-container">
                    <Header username="Alex" />
                    <main className="app-main">
                        Content...
                    </main>
                </div>
            </PubNubProvider>
        );
    }
}

export default App;
