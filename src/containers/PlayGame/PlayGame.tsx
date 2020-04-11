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
import { GameConfig, GameRound, PlayerInput } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState, PubNubMessage, PubNubMessageType, PubNubCurrentRoundInputsMessage } from '../../models/pub-nub-data.model';
import { AppState } from '../../store/app.reducer';
import PhaseWaitingToStart from '../../components/PhaseWaitingToStart/PhaseWaitingToStart';
import { createAndFillArray } from '../../utils/general.utils';
import PhaseFillOutTextfields from '../../components/PhaseFillOutTextfields/PhaseFillOutTextfields';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { evaluatePlayerInputs } from '../../utils/game.utils';
import PhaseEvaluateRound from '../../components/PhaseEvaluateRound/PhaseEvaluateRound';

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
    gameId: string | null;
    playerInfo: PlayerInfo;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }
interface PlayGameState {
    allPlayers: Map<string, PlayerInfo>;
    currentPhase: GamePhase;
    currentRoundInputs: PlayerInput[];
    currentRound: number;
    gameConfig: GameConfig | null;
    gameRounds: GameRound[];
    showLoadingScreen: boolean;
}

class PlayGame extends Component<PlayGameProps, PlayGameState> {
    public state: PlayGameState = {
        allPlayers: new Map<string, PlayerInfo>(),
        currentPhase: GamePhase.waitingToStart,
        currentRoundInputs: [],
        currentRound: 1,
        gameConfig: null,
        gameRounds: [],
        showLoadingScreen: false
    };
    private pubNubClient = new PubNub(PUBNUB_CONFIG);

    public render() {
        if (this.props.gameId === null) { return null; }
        const { gameId, playerInfo } = this.props;
        const { allPlayers, currentRound, currentRoundInputs, gameConfig, gameRounds } = this.state;
        const otherPlayers = cloneDeep(allPlayers);
        otherPlayers.delete(playerInfo.id);
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
        if (this.state.currentPhase === GamePhase.fillOutTextfields) {
            currentPhaseElement = (
                <PhaseFillOutTextfields
                    currentRound={currentRound}
                    gameConfig={gameConfig as GameConfig}
                    gameRoundInputs={currentRoundInputs}
                    updateCurrentRoundInputs={this.updateCurrentRoundInputs}
                    sendRoundFinishedMessage={this.sendRoundFinishedMessage}
                />
            )
        }
        if (this.state.currentPhase === GamePhase.evaluateRound) {
            currentPhaseElement = (
                <PhaseEvaluateRound
                    allPlayers={allPlayers}
                    currentRound={currentRound}
                    gameConfig={gameConfig as GameConfig}
                    gameRounds={gameRounds}
                    playerInfo={playerInfo}
                    // updateCurrentRoundInputs={this.updateCurrentRoundInputs}
                    // sendRoundFinishedMessage={this.sendRoundFinishedMessage}
                />
            )
        }
        return (
            <PubNubProvider client={this.pubNubClient}>
                {/* The props passed to PubNubEventHandler must never be changed,
                    in order to ensure that the component is not rerendered!
                    (PubNubEventHandler is wrapped in React.memo) */}
                <PubNubEventHandler
                    gameChannel={this.props.gameId}
                    gameConfig={this.props.gameConfig}
                    playerInfo={this.props.playerInfo}
                    addPlayers={this.addPlayers}
                    startGame={this.startGame}
                    stopRoundAndSendInputs={this.stopRoundAndSendInputs}
                    addPlayerInputForFinishedRound={this.addPlayerInputForFinishedRound}
                />
                <div className="main-content-wrapper">
                    {currentPhaseElement}
                </div>
                {this.state.showLoadingScreen ? <LoadingScreen /> : null}
            </PubNubProvider>
        );
    }

    public componentDidMount() {
        if (this.props.gameId === null) {
            this.props.history.push('/');
            return;
        }
        const allPlayers = cloneDeep(this.state.allPlayers);
        allPlayers.set(this.props.playerInfo.id, this.props.playerInfo);
        // If player is the game admin, the gameConfig can be taken from application state.
        if (this.props.playerInfo.isAdmin) {
            this.setState({ allPlayers, gameConfig: this.props.gameConfig });
        } else {
            this.setState({ allPlayers });
        }
    }

    private sendMessage = (message: PubNubMessage) => {
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

    private addPlayers = (...newPlayers: PubNubUserState[]) => {
        let gameConfig: GameConfig | null = null;
        const allPlayers = cloneDeep(this.state.allPlayers);
        newPlayers.forEach(newPlayer => {
            allPlayers.set(newPlayer.playerInfo.id, newPlayer.playerInfo);
            // If we are not the game admin, we obtain the game config from the admin's PubNubUserState.
            if (newPlayer.gameConfig) {
                gameConfig = newPlayer.gameConfig;
            }
        });
        if (gameConfig) {
            this.setState({ gameConfig, allPlayers });
        } else {
            this.setState({ allPlayers });
        }
    }

    private startGame = () => {
        const gameConfig = this.state.gameConfig as GameConfig;
        const roundInputs = createAndFillArray<PlayerInput>(gameConfig.categories.length, { text: '', valid: true });
        this.setState({
            currentPhase: GamePhase.fillOutTextfields,
            currentRoundInputs: roundInputs
        });
    }

    private updateCurrentRoundInputs = (newCurrentRoundInputs: PlayerInput[]) => {
        this.setState({ currentRoundInputs: newCurrentRoundInputs });
    }

    private sendRoundFinishedMessage = () => {
        this.setState({ showLoadingScreen: true });
        this.sendMessage({ type: PubNubMessageType.roundFinished });
    }

    private stopRoundAndSendInputs = () => {
        // Prepare new GameRound object for addPlayerInputForFinishedRound method.
        const gameRounds: GameRound[] = [...this.state.gameRounds, new Map<string, PlayerInput[]>()];
        this.setState({ gameRounds, showLoadingScreen: true });
        // Send this player's text inputs of current round to other players (and herself/himself).
        const message = new PubNubCurrentRoundInputsMessage(evaluatePlayerInputs(this.state.currentRoundInputs));
        this.sendMessage(message.toPubNubMessage());
    }

    private addPlayerInputForFinishedRound = (playerId: string, playerInputsForFinishedRound: PlayerInput[]) => {
        const gameRounds = cloneDeep(this.state.gameRounds);
        gameRounds[this.state.currentRound - 1].set(playerId, playerInputsForFinishedRound);
        // Did we collect the inputs from all players?
        if (gameRounds[this.state.currentRound - 1].size === this.state.allPlayers.size) {
            // If yes, then start the evaluation of the finished round.
            this.setState({ currentPhase: GamePhase.evaluateRound, gameRounds, showLoadingScreen: false });
            console.log('Got all data', this.state);
        } else {
            // If no, then only store the updated gameRounds object in state.
            this.setState({ gameRounds });
        }
    }
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        gameConfig: state.gameConfig,
        gameId: state.gameId,
        playerInfo: state.playerInfo as PlayerInfo
    };
}
export default connect(mapStateToProps)(PlayGame);
