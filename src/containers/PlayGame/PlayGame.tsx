import './PlayGame.css';
import { cloneDeep } from 'lodash';
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
import { PubNubUserState } from '../../models/pub-nub-data.interface';
import { AppState } from '../../store/app.reducer';

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
    gameId: string | null;
    playerInfo: PlayerInfo;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }
interface PlayGameState {
    gameConfig: GameConfig | null;
    otherPlayers: Map<string, PlayerInfo>;
}

const pubNubClient = new PubNub(PUBNUB_CONFIG);

class PlayGame extends Component<PlayGameProps, PlayGameState> {
    public state: PlayGameState = {
        gameConfig: null,
        otherPlayers: new Map<string, PlayerInfo>()
    };

    public render() {
        if (this.props.gameId === null) { return null; }
        let invitePlayersElement = null;
        if (this.props.playerInfo.isAdmin) {
            invitePlayersElement = (<JoinGameLink gameId={this.props.gameId} />);
        }
        let otherPlayersText = '';
        if (this.state.otherPlayers.size > 0) {
            this.state.otherPlayers.forEach(player => otherPlayersText += player.name + ', ');
            otherPlayersText = otherPlayersText.substring(0, otherPlayersText.length - 2);
        }
        let gameSettingsElement = null;
        if (this.state.gameConfig) {
            gameSettingsElement = (
                <React.Fragment>
                    <hr />
                    <p>Spiele-Settings:</p>
                    <p>Runden: {this.state.gameConfig.numberOfRounds}</p>
                    <p>Kategorien: {this.state.gameConfig.categories.map(c => c + '')}</p>
                </React.Fragment>
            )
        }
        return (
            <PubNubProvider client={pubNubClient}>
                <PubNubEventHandler
                    gameChannel={this.props.gameId}
                    gameConfig={this.props.gameConfig}
                    playerInfo={this.props.playerInfo}
                    addPlayers={this.addPlayers}
                />
                <div className="material-card-style">
                    {invitePlayersElement}
                    <p>Warten auf Beginn des Spiels...</p>
                    <hr />
                    <p>Mitspieler: {otherPlayersText}</p>
                    {gameSettingsElement}
                </div>
            </PubNubProvider>
        );
    }

    public componentDidMount() {
        if (this.props.gameId === null) {
            this.props.history.push('/');
            return;
        }
        // If player is the game admin, the gameConfig can be taken from application state.
        if (this.props.playerInfo.isAdmin) {
            this.setState({ gameConfig: this.props.gameConfig });
        }
    }

    private addPlayers = (...newPlayers: PubNubUserState[]) => {
        let gameConfig: GameConfig | null = null;
        const otherPlayers = cloneDeep(this.state.otherPlayers);
        newPlayers.forEach(newPlayer => {
            otherPlayers.set(newPlayer.playerInfo.id, newPlayer.playerInfo);
            // We obtain the game config from the PubNubUserState of the game admin.
            if (newPlayer.gameConfig) {
                gameConfig = newPlayer.gameConfig;
            }
        });
        if (gameConfig) {
            this.setState({ gameConfig, otherPlayers });
        } else {
            this.setState({ otherPlayers });
        }
    }

    // private sendMessage = (message: object) => {
    //     pubNubClient.publish(
    //         {
    //             channel: this.props.gameId as string,
    //             message,
    //             storeInHistory: true,
    //             ttl: 5
    //         },
    //         (status, response) => console.log('PubNub Publish:', status, response)
    //     );
    // };
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        gameConfig: state.gameConfig,
        gameId: state.gameId,
        playerInfo: state.playerInfo as PlayerInfo
    };
}
export default connect(mapStateToProps)(PlayGame);
