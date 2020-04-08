import './PlayGame.css';

import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { AppState } from '../../store/app.reducer';
import PubNubEventHandler from '../../components/PubNubEventHandler/PubNubEventHandler';
import { PlayerInfo } from '../../models/player.interface';

interface PlayGamePropsFromStore {
    gameId: string | null;
    isAdmin: boolean;
    playerName: string | null;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }

const pubNubClient = new PubNub(PUBNUB_CONFIG);

class PlayGame extends Component<PlayGameProps> {
    public render() {
        if (this.props.gameId === null) {
            return null;
        }
        const playerInfo: PlayerInfo = {
            id: PUBNUB_CONFIG.uuid as string,
            isAdmin: this.props.isAdmin,
            name: this.props.playerName as string
        }
        let invitePlayersElement = null;
        if (this.props.isAdmin) {
            invitePlayersElement = (<p>Teile diese ID mit Freunden: {this.props.gameId}</p>);
        }
        return (
            <PubNubProvider client={pubNubClient}>
                <PubNubEventHandler gameChannel={this.props.gameId} playerInfo={playerInfo} />
                <div className="material-card-style">
                    <p>Warten auf Mitspieler...</p>
                    {invitePlayersElement}
                </div>
            </PubNubProvider>
        );
    }

    public componentDidMount() {
        if (this.props.gameId === null) {
            this.props.history.push('/');
            return;
        }
        if (this.props.isAdmin) {
            this.sendMessage('hier kommen die wichtigen INfos vom game admin');
        }
    }

    private sendMessage = (message: string) => {
        pubNubClient.publish(
            {
                channel: this.props.gameId as string,
                message,
                storeInHistory: true,
                ttl: 5
            },
            (status, response) => console.log('publish callback', status, response)
        );
    };
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        isAdmin: state.isAdmin,
        gameId: state.gameId,
        playerName: state.playerName
    };
}
export default connect(mapStateToProps)(PlayGame);
