import './PlayGame.css';

import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { AppState } from '../../store/app.reducer';

interface PlayGamePropsFromStore {
    isAdmin: boolean;
    gameId: string | null;
    playerName: string | null;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }

const pubNubClient = new PubNub(PUBNUB_CONFIG);

class PlayGame extends Component<PlayGameProps> {
    public render() {
        if (this.props.gameId === null) {
            return '';
        }
        let invitePlayersElement = null;
        if (this.props.isAdmin) {
            invitePlayersElement = (<p>Teile diese ID mit Freunden: {this.props.gameId}</p>);
        }
        return (
            <PubNubProvider client={pubNubClient}>
                <div className="material-card-style">
                    <p>Warten auf Mitspieler...</p>
                    {invitePlayersElement}
                </div>
            </PubNubProvider>
        );
    }

    public componentDidMount() {
        if (this.props.gameId === null) {
            this.props.history.push('/')
        }
    }
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        isAdmin: state.isAdmin,
        gameId: state.gameId,
        playerName: state.playerName
    };
}
export default connect(mapStateToProps)(PlayGame);
