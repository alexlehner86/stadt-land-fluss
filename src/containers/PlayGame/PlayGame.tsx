import './PlayGame.css';

import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { JoinGameLink } from '../../components/JoinGameLink/JoinGameLink';
import PubNubEventHandler from '../../components/PubNubEventHandler/PubNubEventHandler';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { GameConfig } from '../../models/game-config.interface';
import { PlayerInfo } from '../../models/player.interface';
import { AppState } from '../../store/app.reducer';

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
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
            invitePlayersElement = (<JoinGameLink gameId={this.props.gameId} />);
        }
        return (
            <PubNubProvider client={pubNubClient}>
                <PubNubEventHandler gameChannel={this.props.gameId} playerInfo={playerInfo} />
                <div className="material-card-style">
                    {invitePlayersElement}
                    <p>Warten auf Mitspieler...</p>
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
            this.sendMessage(this.props.gameConfig as GameConfig);
        }
    }

    private sendMessage = (message: object) => {
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
        gameConfig: state.gameConfig,
        gameId: state.gameId,
        isAdmin: state.isAdmin,
        playerName: state.playerName
    };
}
export default connect(mapStateToProps)(PlayGame);
