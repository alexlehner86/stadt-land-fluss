import './PlayGame.css';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';

const pubNubClient = new PubNub(PUBNUB_CONFIG);

export class PlayGame extends Component {
    public render() {
        return (
            <PubNubProvider client={pubNubClient}>
                <div className="material-card-style">
                    <p>Warten auf Mitspieler...</p>
                </div>
            </PubNubProvider>
        );
    }
}
