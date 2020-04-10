import './PlayGame.css';
import { cloneDeep } from 'lodash';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import PubNubEventHandler from '../../components/PubNubEventHandler/PubNubEventHandler';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { GamePhase } from '../../constants/game.constant';
import { GameConfig } from '../../models/game-config.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState, PubNubMessage } from '../../models/pub-nub-data.interface';
import { AppState } from '../../store/app.reducer';
import PhaseWaitingToStart from '../../components/PhaseWaitingToStart/PhaseWaitingToStart';

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
    gameId: string | null;
    playerInfo: PlayerInfo;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }
interface PlayGameState {
    currentRound: number;
    currentPhase: GamePhase;
    gameConfig: GameConfig | null;
    otherPlayers: Map<string, PlayerInfo>;
}

class PlayGame extends Component<PlayGameProps, PlayGameState> {
    public state: PlayGameState = {
        currentRound: 1,
        currentPhase: GamePhase.waitingToStart,
        gameConfig: null,
        otherPlayers: new Map<string, PlayerInfo>()
    };
    private pubNubClient = new PubNub(PUBNUB_CONFIG);

    public render() {
        if (this.props.gameId === null) { return null; }
        const { gameId, playerInfo } = this.props;
        const { gameConfig, otherPlayers } = this.state;
        let currentPhaseElement: JSX.Element | null = null;
        if (this.state.currentPhase === GamePhase.waitingToStart) {
            currentPhaseElement = (
                <PhaseWaitingToStart
                    gameConfig={gameConfig}
                    gameId={gameId}
                    otherPlayers={otherPlayers}
                    playerInfo={playerInfo}
                    sendMessage={this.sendMessage}
                />
            );
        }
        return (
            <PubNubProvider client={this.pubNubClient}>
                <PubNubEventHandler
                    gameChannel={this.props.gameId}
                    gameConfig={this.props.gameConfig}
                    playerInfo={this.props.playerInfo}
                    addPlayers={this.addPlayers}
                />
                {currentPhaseElement}
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
            // If we are not the game admin, we obtain the game config from the admin's PubNubUserState.
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

    private sendMessage = (message: PubNubMessage) => {
        console.log('send message', message);
        this.pubNubClient.publish(
            {
                channel: this.props.gameId as string,
                message,
                storeInHistory: true,
                ttl: 1
            },
            (status, response) => console.log('PubNub Publish:', status, response)
        );
    };
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        gameConfig: state.gameConfig,
        gameId: state.gameId,
        playerInfo: state.playerInfo as PlayerInfo
    };
}
export default connect(mapStateToProps)(PlayGame);
