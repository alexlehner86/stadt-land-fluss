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

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
    gameId: string | null;
    playerInfo: PlayerInfo;
}
interface PlayGameProps extends PlayGamePropsFromStore, RouterProps { }
interface PlayGameState {
    currentPhase: GamePhase;
    currentRoundInputs: PlayerInput[];
    currentRound: number;
    gameConfig: GameConfig | null;
    gameRounds: GameRound[];
    numberOfPlayers: number;
    otherPlayers: Map<string, PlayerInfo>;
    showLoadingScreen: boolean;
}

class PlayGame extends Component<PlayGameProps, PlayGameState> {
    public state: PlayGameState = {
        currentPhase: GamePhase.waitingToStart,
        currentRoundInputs: [],
        currentRound: 1,
        gameConfig: null,
        gameRounds: [],
        numberOfPlayers: 1,
        otherPlayers: new Map<string, PlayerInfo>(),
        showLoadingScreen: false
    };
    private pubNubClient = new PubNub(PUBNUB_CONFIG);

    public render() {
        if (this.props.gameId === null) { return null; }
        const { gameId, playerInfo } = this.props;
        const { currentRound, currentRoundInputs, gameConfig, otherPlayers } = this.state;
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
                    stopRoundAndSendInput={this.stopRoundAndSendInput}
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
        // If player is the game admin, the gameConfig can be taken from application state.
        if (this.props.playerInfo.isAdmin) {
            this.setState({ gameConfig: this.props.gameConfig });
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
        const otherPlayers = cloneDeep(this.state.otherPlayers);
        newPlayers.forEach(newPlayer => {
            otherPlayers.set(newPlayer.playerInfo.id, newPlayer.playerInfo);
            // If we are not the game admin, we obtain the game config from the admin's PubNubUserState.
            if (newPlayer.gameConfig) {
                gameConfig = newPlayer.gameConfig;
            }
        });
        const numberOfPlayers = 1 + otherPlayers.size;
        if (gameConfig) {
            this.setState({ gameConfig, numberOfPlayers, otherPlayers });
        } else {
            this.setState({ numberOfPlayers, otherPlayers });
        }
    }

    private startGame = () => {
        const gameConfig = this.state.gameConfig as GameConfig;
        const firstRound = createAndFillArray<PlayerInput>(gameConfig.numberOfRounds, { text: '', valid: true });
        this.setState({
            currentPhase: GamePhase.fillOutTextfields,
            currentRoundInputs: firstRound
        });
    }

    private updateCurrentRoundInputs = (newCurrentRoundInputs: PlayerInput[]) => {
        this.setState({ currentRoundInputs: newCurrentRoundInputs });
    }

    private sendRoundFinishedMessage = () => {
        this.setState({ showLoadingScreen: true });
        this.sendMessage({ type: PubNubMessageType.roundFinished });
    }

    private stopRoundAndSendInput = () => {
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
        if (gameRounds[this.state.currentRound - 1].size === this.state.numberOfPlayers) {
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
