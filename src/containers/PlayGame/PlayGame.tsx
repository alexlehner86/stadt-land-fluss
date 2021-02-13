import { cloneDeep } from 'lodash';
import { ProviderContext, withSnackbar } from 'notistack';
import Pubnub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import React, { Component, ComponentClass, Dispatch } from 'react';
import { LiveMessage } from 'react-aria-live';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { compose } from 'redux';

import AdminPanel from '../../components/AdminPanel/AdminPanel';
import { LetterAnimation } from '../../components/LetterAnimation/LetterAnimation';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import PhaseEvaluateRound from '../../components/PhaseEvaluateRound/PhaseEvaluateRound';
import PhaseFillOutTextfields from '../../components/PhaseFillOutTextfields/PhaseFillOutTextfields';
import PhaseWaitingToStart from '../../components/PhaseWaitingToStart/PhaseWaitingToStart';
import PubNubEventHandler from '../../components/PubNubEventHandler/PubNubEventHandler';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { GamePhase } from '../../constants/game.constant';
import { GERMAN_PHONETIC_ALPHABET } from '../../constants/phonetic-alphabet.constant';
import {
    GAME_STARTS_MESSAGE,
    JOINED_GAME_MESSAGE,
    NEW_GAME_CREATED_MESSAGE,
    ROUND_EVALUATION_FINISHED_MESSAGE,
    TEN_SECONDS_REMAINING_MESSAGE,
} from '../../constants/sr-message.constant';
import {
    EndRoundMode,
    EqualAnswersOfCategory,
    EvaluationOfPlayerInput,
    GameConfig,
    GameRound,
    GameRoundEvaluation,
    IsPlayerInputVeryCreativeStatus,
    PlayerInput,
    PlayerInputEvaluation,
} from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import {
    PubNubCurrentRoundInputsMessage,
    PubNubDataForCurrentGameMessage,
    PubNubDataForCurrentGameMessagePayload,
    PubNubEvaluationOfPlayerInputMessage,
    PubNubIsPlayerInputVeryCreativeMessage,
    PubNubKickPlayerMessage,
    PubNubMarkEqualAnswersMessage,
    PubNubMessage,
    PubNubMessageType,
    PubNubUserState,
} from '../../models/pub-nub-data.model';
import {
    AppAction,
    resetAppState,
    ResetAppStatePayload,
    setDataOfFinishedGame,
    SetDataOfFinishedGamePayload,
} from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import {
    applyMarkedAsCreativeFlags,
    compressEqualAnswers,
    compressGameRoundEvaluation,
    compressMarkedAsCreativeFlags,
    decompressEqualAnswers,
    decompressGameRoundEvaluation,
    restoreGameRoundsOfRunningGameFromLocalStorage,
    setPointsAndValidity,
    shouldUserRespondToRequestGameDataMessage,
} from '../../utils/data-restoration.utils';
import {
    applyValidFlagAndStarFlagToPoints,
    calculatePointsForCategory,
    calculatePointsForRound,
    createGameRoundEvaluation,
    getEmptyRoundInputs,
    getMinNumberOfInvalids,
    getNumberOfInvalids,
    getPlayersInAlphabeticalOrder,
    markEmptyPlayerInputsAsInvalid,
} from '../../utils/game.utils';
import { convertCollectionToMap, convertMapToCollection } from '../../utils/general.utils';
import {
    getRunningGameConfigFromLocalStorage,
    removeAllDataOfRunningGameFromLocalStorage,
    setRunningGameConfigInLocalStorage,
    setRunningGameRoundInLocalStorage,
} from '../../utils/local-storage.utils';

interface PlayGamePropsFromStore {
    gameConfig: GameConfig | null;
    gameId: string | null;
    isRejoiningGame: boolean;
    /** Player info for the user of this instance of the "Stadt-Land-Fluss" app. */
    playerInfo: PlayerInfo;
}
interface PlayGameDispatchProps {
    onSetDataOfFinishedGame: (payload: SetDataOfFinishedGamePayload) => void;
    onResetAppState: (payload?: ResetAppStatePayload) => void;
}
interface PlayGameProps extends PlayGamePropsFromStore, PlayGameDispatchProps, RouterProps, ProviderContext { }
export interface PlayGameState {
    a11yMessagePolite: string;
    allPlayers: Map<string, PlayerInfo>;
    currentPhase: GamePhase;
    currentRound: number;
    currentRoundEqualAnswers: Map<number, string[]>;
    currentRoundEvaluation: GameRoundEvaluation;
    currentRoundInputs: PlayerInput[];
    gameConfig: GameConfig | null;
    gameRounds: GameRound[];
    isCountdownAlarmActive: boolean;
    playersThatFinishedEvaluation: Map<string, boolean>;
    playersThatFinishedRound: Map<string, boolean>;
    showLetterAnimation: boolean;
    showLoadingScreen: boolean;
}

class PlayGame extends Component<PlayGameProps, PlayGameState> {
    public state: PlayGameState = {
        a11yMessagePolite: '',
        allPlayers: new Map<string, PlayerInfo>(),
        currentPhase: GamePhase.waitingToStart,
        currentRound: 1,
        currentRoundEqualAnswers: new Map<number, string[]>(),
        currentRoundEvaluation: new Map<string, PlayerInputEvaluation[]>(),
        currentRoundInputs: [],
        gameConfig: null,
        gameRounds: [new Map<string, PlayerInput[]>()],
        isCountdownAlarmActive: false,
        playersThatFinishedEvaluation: new Map<string, boolean>(),
        playersThatFinishedRound: new Map<string, boolean>(),
        showLetterAnimation: false,
        showLoadingScreen: true
    };
    private pubNubClient: any;

    public render() {
        // This check serves as a route guard. If gameId and playerInfo aren't present in application state,
        // then the user wasn't redirected here from the NewGame or JoinGame component.
        if (this.props.gameId === null || this.props.playerInfo === null) { return null; }

        if (!this.pubNubClient) {
            this.pubNubClient = new Pubnub({ ...PUBNUB_CONFIG, uuid: this.props.playerInfo.id });
        }
        const letterAnimationElement = (
            <LetterAnimation
                letterToUnveil={this.state.gameConfig ? this.state.gameConfig.letters[this.state.currentRound - 1] : ''}
                callbackWhenAnimationDone={this.callbackWhenAnimationDone}
            />
        );
        const { allPlayers, currentPhase, gameConfig, showLetterAnimation, showLoadingScreen } = this.state;
        const showWaitingForPlayers = currentPhase === GamePhase.fillOutTextfields
            && (gameConfig && gameConfig.endRoundMode === EndRoundMode.allPlayersSubmit)
            && this.state.playersThatFinishedRound.size !== allPlayers.size;
        const loadingScreenElement = !showWaitingForPlayers ? <LoadingScreen />
            : <LoadingScreen waitingForPlayers={this.getWaitingForPlayers()} />;
        const showAdminPanel = this.props.playerInfo.isAdmin && allPlayers.size > 1;
        const createAdminPanel = (isForMobileView: boolean) => (
            <AdminPanel
                allPlayers={allPlayers}
                categories={this.state.gameConfig?.categories || []}
                gameRound={this.state.gameRounds[this.state.currentRound - 1]}
                isForMobileView={isForMobileView}
                isMarkEqualAnswersItemDisabled={currentPhase !== GamePhase.evaluateRound || !gameConfig?.scoringOptions.checkForDuplicates}
                kickPlayer={this.sendKickPlayerMessage}
                submitEqualAnswers={this.sendEqualAnswersSelection}
            />
        );

        return (
            <React.Fragment>
                <PubNubProvider client={this.pubNubClient}>
                    {/* The props passed to PubNubEventHandler must never be changed,
                    in order to ensure that the component is not rerendered!
                    (PubNubEventHandler is wrapped in React.memo) */}
                    <PubNubEventHandler
                        gameChannel={this.props.gameId}
                        gameConfig={this.props.gameConfig}
                        isRejoiningGame={this.props.isRejoiningGame}
                        playerInfo={this.props.playerInfo}
                        navigateToJoinGamePage={this.navigateToJoinGamePage}
                        addPlayers={this.addPlayers}
                        processPubNubMessage={this.processPubNubMessage}
                    />
                    {showLetterAnimation ? letterAnimationElement : null}
                    {showLoadingScreen ? loadingScreenElement : null}
                    {!showLoadingScreen && !showLetterAnimation ? (
                        <React.Fragment>
                            {showAdminPanel ? createAdminPanel(false) : null}
                            <div className="main-content-wrapper">
                                {this.createCurrentPhaseElement()}
                            </div>
                            {showAdminPanel ? createAdminPanel(true) : null}
                        </React.Fragment>
                    ) : null}
                </PubNubProvider>
                <LiveMessage
                    message={this.state.a11yMessagePolite}
                    aria-live="polite"
                    clearOnUnmount="true"
                />
            </React.Fragment>
        );
    }

    public componentDidMount() {
        const { gameConfig, gameId, isRejoiningGame, playerInfo } = this.props;
        // If gameId and playerInfo aren't present in application state, then reroute user to dashboard.
        if (gameId === null || playerInfo === null) {
            this.props.history.push('/');
            return;
        }
        // If player is rejoining the game, we need to request the game data from the other players.
        if (isRejoiningGame) {
            this.sendPubNubMessage({ type: PubNubMessageType.requestGameData });
        } else {
            const allPlayers = new Map<string, PlayerInfo>();
            allPlayers.set(playerInfo.id, playerInfo);
            // If user is the game admin, the gameConfig can be taken from application state
            // and we can hide the loading screen and show PhaseWaitingToStart component right away.
            if (playerInfo.isAdmin) {
                setRunningGameConfigInLocalStorage(gameConfig as GameConfig);
                this.setState({ a11yMessagePolite: NEW_GAME_CREATED_MESSAGE, allPlayers, gameConfig, showLoadingScreen: false });
            } else {
                this.setState({ allPlayers });
            }
        }
    }

    private createCurrentPhaseElement = (): JSX.Element | null => {
        switch (this.state.currentPhase) {
            case GamePhase.waitingToStart:
                return (
                    <PhaseWaitingToStart
                        allPlayers={this.state.allPlayers}
                        gameConfig={this.state.gameConfig}
                        gameId={this.props.gameId as string}
                        playerInfo={this.props.playerInfo}
                        informScreenReaderUser={this.informScreenReaderUser}
                        sendPubNubMessage={this.sendPubNubMessage}
                    />
                );
            case GamePhase.fillOutTextfields:
                return (
                    <PhaseFillOutTextfields
                        currentRound={this.state.currentRound}
                        gameConfig={this.state.gameConfig as GameConfig}
                        gameRoundInputs={this.state.currentRoundInputs}
                        isCountdownAlarmActive={this.state.isCountdownAlarmActive}
                        alertOnTenSecondsRemaining={this.alertOnTenSecondsRemaining}
                        finishRoundOnCountdownComplete={this.finishRoundOnCountdownComplete}
                        finishRoundOnUserAction={this.finishRoundOnUserAction}
                        updateCurrentRoundInputs={this.updateCurrentRoundInputs}
                    />
                );
            case GamePhase.evaluateRound:
                return (
                    <PhaseEvaluateRound
                        allPlayers={this.state.allPlayers}
                        currentRound={this.state.currentRound}
                        currentRoundEvaluation={this.state.currentRoundEvaluation}
                        gameConfig={this.state.gameConfig as GameConfig}
                        gameRounds={this.state.gameRounds}
                        playerInfo={this.props.playerInfo}
                        playersThatFinishedEvaluation={this.state.playersThatFinishedEvaluation}
                        sendEvaluationFinishedMessage={this.sendEvaluationFinishedMessage}
                        updateEvaluationOfPlayerInput={this.updateEvaluationOfPlayerInput}
                        updateIsPlayerInputVeryCreativeStatus={this.updateIsPlayerInputVeryCreativeStatus}
                    />
                );
            default:
                return null;
        }
    }

    private alertOnTenSecondsRemaining = () => {
        this.setState({ a11yMessagePolite: TEN_SECONDS_REMAINING_MESSAGE, isCountdownAlarmActive: true });
    }

    private informScreenReaderUser = (message: string) => this.setState({ a11yMessagePolite: message });

    private callbackWhenAnimationDone = () => {
        const { currentRound, gameConfig } = this.state;
        const currentLetter = gameConfig?.letters[this.state.currentRound - 1] as string;
        const phoneticText = GERMAN_PHONETIC_ALPHABET[currentLetter];
        const a11yMessagePolite = `Runde ${currentRound}: Buchstabe ${currentLetter} wie ${phoneticText}.`;
        this.setState({ a11yMessagePolite, showLetterAnimation: false });
    }

    /**
     * Returns the names of the players that haven't submitted their answers yet.
     */
    private getWaitingForPlayers = (): string[] => {
        const waitingForPlayers: string[] = [];
        getPlayersInAlphabeticalOrder(this.state.allPlayers).forEach(player => {
            if (!this.state.playersThatFinishedRound.has(player.id)) {
                waitingForPlayers.push(player.name);
            }
        });
        return waitingForPlayers;
    }

    private navigateToJoinGamePage = (errorMessage: string) => {
        removeAllDataOfRunningGameFromLocalStorage();
        this.props.onResetAppState({ joinGameErrorMessage: errorMessage });
        this.props.history.push('/joingame');
    }

    //#region Process user actions
    private updateCurrentRoundInputs = (newCurrentRoundInputs: PlayerInput[]) => {
        this.setState({ currentRoundInputs: newCurrentRoundInputs });
    }

    /**
     * Gets called when the countdown reaches zero.
     */
    private finishRoundOnCountdownComplete = () => {
        this.setState({ showLoadingScreen: true });
        // We only want the game admin to send the "roundFinished" message once.
        if (this.props.playerInfo.isAdmin) {
            this.sendPubNubMessage({ type: PubNubMessageType.roundFinished });
        }
    }

    /**
     * Gets called when the user ends the current round.
     */
    private finishRoundOnUserAction = () => {
        const playersThatFinishedRound = cloneDeep(this.state.playersThatFinishedRound);
        playersThatFinishedRound.set(this.props.playerInfo.id, true);
        this.setState({ playersThatFinishedRound, showLoadingScreen: true });
        this.sendPubNubMessage({ type: PubNubMessageType.roundFinished });
    }

    /**
     * Is called by PhaseEvaluateRound component in order to communicate a player input evaluation via a
     * PubNub message. This message is then processed by all players in the game (including the user who sent it).
     */
    private updateEvaluationOfPlayerInput = (newEvaluation: EvaluationOfPlayerInput) => {
        const message = new PubNubEvaluationOfPlayerInputMessage(newEvaluation);
        this.sendPubNubMessage(message.toPubNubMessage());
    }

    /**
     * Is called by PhaseEvaluateRound component in order to communicate the "marked as very creative" status of a player input
     * via a PubNub message. This message is then processed by all players in the game (including the user who sent it).
     */
    private updateIsPlayerInputVeryCreativeStatus = (newStatus: IsPlayerInputVeryCreativeStatus) => {
        const message = new PubNubIsPlayerInputVeryCreativeMessage(newStatus);
        this.sendPubNubMessage(message.toPubNubMessage());
    }

    /**
     * Is called by AdminPanel component when admin user manually marks equal answers for a category.
     */
    private sendEqualAnswersSelection = (categoryIndex: number, equalAnswers: string[]) => {
        const category = this.state.gameConfig?.categories[categoryIndex];
        this.informScreenReaderUser(`Auswahl für Kategorie ${category} wurde angewendet.`);
        const message = new PubNubMarkEqualAnswersMessage({ c: categoryIndex, v: equalAnswers });
        this.sendPubNubMessage(message.toPubNubMessage());
    }

    /**
     * Is called by PhaseEvaluateRound component in order to communicate to all players
     * that the user of this instance of the game has finished evaluating the current round.
     */
    private sendEvaluationFinishedMessage = () => this.sendPubNubMessage({ type: PubNubMessageType.evaluationFinished });

    private sendKickPlayerMessage = (playerId: string) => {
        const message = new PubNubKickPlayerMessage(playerId);
        this.sendPubNubMessage(message.toPubNubMessage());
    }
    //#endregion

    //#region PubNub event and message handling
    private sendPubNubMessage = (message: PubNubMessage) => {
        this.pubNubClient.publish(
            {
                channel: this.props.gameId as string,
                message,
                storeInHistory: true,
                ttl: 1 // time to live (in hours)
            },
            (status: any, response: any) => console.log('PubNub Publish:', status, response)
        );
    };

    /**
     * Called by PubNubEventHandler when it receives user data via a hereNow call or a PubNub presence event
     * with action 'state-change'. It processes information about players that had already joined the game
     * before this user joined (hereNow response) or about a player that joins the game after this user joined.
     */
    private addPlayers = (fromPresenceEvent: boolean, ...newPlayers: PubNubUserState[]) => {
        // Ignore information about players that try to join after the game has already started.
        if (this.state.currentPhase !== GamePhase.waitingToStart) { return; }
        let gameConfig: GameConfig | null = null;
        const allPlayers = cloneDeep(this.state.allPlayers);
        newPlayers.forEach(newPlayer => {
            allPlayers.set(newPlayer.playerInfo.id, newPlayer.playerInfo);
            // If we are not the game admin, we obtain the game config from the admin's PubNubUserState.
            if (!this.state.gameConfig && newPlayer.gameConfig) {
                gameConfig = newPlayer.gameConfig;
            }
        });
        // Only after we received the gameConfig from the admin, we hide the loading screen
        // and render the PhaseWaitingToStart component instead.
        if (gameConfig) {
            setRunningGameConfigInLocalStorage(gameConfig);
            this.setState({ a11yMessagePolite: JOINED_GAME_MESSAGE, allPlayers, gameConfig, showLoadingScreen: false });
        } else {
            const a11yMessagePolite = fromPresenceEvent ? `${newPlayers[0].playerInfo.name} ist dem Spiel beigetreten.` : '';
            this.setState({ a11yMessagePolite, allPlayers });
        }
    }

    /**
     * PubNubEventHandler calls this method when it receives a PubNub message with attribute 'type'.
     */
    private processPubNubMessage = (event: Pubnub.MessageEvent) => {
        const message = event.message as PubNubMessage;
        switch (message.type) {
            case PubNubMessageType.startGame:
                this.startGame();
                break;
            case PubNubMessageType.roundFinished:
                this.onRoundFinishedMessage(event.publisher);
                break;
            case PubNubMessageType.currentRoundInputs:
                this.addPlayerInputForFinishedRound(event.publisher, message.payload);
                break;
            case PubNubMessageType.evaluationOfPlayerInput:
                this.processEvaluationOfPlayerInput(event.publisher, message.payload);
                break;
            case PubNubMessageType.isPlayerInputVeryCreative:
                this.processIsPlayerInputVeryCreativeStatus(message.payload);
                break;
            case PubNubMessageType.markEqualAnswers:
                this.processMarkEqualAnswersMessage(message.payload);
                break;
            case PubNubMessageType.evaluationFinished:
                this.countPlayerAsEvaluationFinished(event.publisher);
                break;
            case PubNubMessageType.kickPlayer:
                this.removePlayerFromGame(message.payload);
                break;
            case PubNubMessageType.requestGameData:
                if (shouldUserRespondToRequestGameDataMessage(this.props.playerInfo, this.state.allPlayers, event.publisher)) {
                    if (this.state.allPlayers.has(event.publisher)) {
                        // Only send data to a rejoining player who hasn't been kicked out by the admin.
                        this.sendDataForCurrentGame(event.publisher);
                    } else {
                        // Send kickPlayer message again for kicked out player that tried to rejoin game.
                        this.sendKickPlayerMessage(event.publisher);
                    }
                }
                break;
            case PubNubMessageType.dataForCurrentGame:
                this.restoreDataForCurrentGame(message.payload);
                break;
            default:
        }
    }

    /**
    * This method is called when the PubNub message 'startGame' is received.
    */
    private startGame = () => {
        const gameConfig = this.state.gameConfig as GameConfig;
        const currentRoundEvaluation = createGameRoundEvaluation(this.state.allPlayers, gameConfig.categories);
        this.setState({
            a11yMessagePolite: GAME_STARTS_MESSAGE,
            currentPhase: GamePhase.fillOutTextfields,
            currentRoundEvaluation,
            currentRoundInputs: getEmptyRoundInputs(gameConfig.categories.length),
            showLetterAnimation: true
        });
    }

    /**
     * This method is called when the PubNub message 'roundFinished' is received.
     */
    private onRoundFinishedMessage = (playerId: string) => {
        const gameConfig = this.state.gameConfig as GameConfig;
        const endRoundPlayer = this.state.allPlayers.get(playerId);
        if (gameConfig.endRoundMode === EndRoundMode.allPlayersSubmit) {
            const playersThatFinishedRound = cloneDeep(this.state.playersThatFinishedRound);
            playersThatFinishedRound.set(playerId, true);
            if (playerId === this.props.playerInfo.id) {
                this.setState({ playersThatFinishedRound });
                this.sendCurrentRoundInputs();
            } else {
                const message = `${endRoundPlayer?.name} hat Antworten abgeschickt.`;
                this.props.enqueueSnackbar(message, { 'aria-live': 'off' });
                this.setState({ a11yMessagePolite: message, playersThatFinishedRound });
            }
        } else {
            // In game modes "countdown" and "fastet player", the round ends for all players right away.
            const message = gameConfig.endRoundMode === EndRoundMode.countdownEnds
                ? 'Der Countdown ist abgelaufen.' : `${endRoundPlayer?.name} hat Antworten abgeschickt.`;
            this.informScreenReaderUser(message);
            this.sendCurrentRoundInputs();
        }
    }

    /**
     * Send this player's text inputs of current round to other players (and themselves).
     */
    private sendCurrentRoundInputs = () => {
        const message = new PubNubCurrentRoundInputsMessage(markEmptyPlayerInputsAsInvalid(this.state.currentRoundInputs));
        this.sendPubNubMessage(message.toPubNubMessage());
    }

    /**
     * This method is called when the PubNub message 'currentRoundInputs' is received.
     */
    private addPlayerInputForFinishedRound = (playerId: string, playerInputsForFinishedRound: PlayerInput[]) => {
        const gameRounds = cloneDeep(this.state.gameRounds);
        const roundIndex = this.state.currentRound - 1;
        gameRounds[roundIndex].set(playerId, playerInputsForFinishedRound);
        // Did we collect the inputs from all players?
        if (gameRounds[roundIndex].size === this.state.allPlayers.size) {
            // If yes, then calculate points and start the evaluation of the finished round.
            const { currentRound, currentRoundEqualAnswers, gameConfig } = this.state;
            const a11yMessagePolite = `Runde ${currentRound} ist zu Ende. Wertet nun die Antworten aus.`;
            calculatePointsForRound((gameConfig as GameConfig).scoringOptions, gameRounds[roundIndex], currentRoundEqualAnswers);
            setRunningGameRoundInLocalStorage(this.state.currentRound, gameRounds[roundIndex]);
            this.setState({ a11yMessagePolite, currentPhase: GamePhase.evaluateRound, gameRounds, showLoadingScreen: false });
        } else {
            // If no, then only store the updated gameRounds object in state.
            this.setState({ gameRounds });
        }
    }

    /**
     * This method is called when the PubNub message 'evaluationOfPlayerInput' is received.
     * It processes the new evaluation and changes data in currentRoundEvaluation and gameRounds accordingly.
     */
    private processEvaluationOfPlayerInput = (evaluatorId: string, newEvaluation: EvaluationOfPlayerInput) => {
        if (!this.state.allPlayers.has(evaluatorId)) { return; }
        const { categoryIndex, evaluatedPlayerId, markedAsValid } = newEvaluation;

        // Update data with evaluation
        const currentRoundEvaluation = cloneDeep(this.state.currentRoundEvaluation);
        const playerInputEvaluations = currentRoundEvaluation.get(evaluatedPlayerId) as PlayerInputEvaluation[];
        playerInputEvaluations[categoryIndex].set(evaluatorId, markedAsValid);
        const gameRounds = cloneDeep(this.state.gameRounds);
        const isInputValid = getNumberOfInvalids(playerInputEvaluations[categoryIndex]) < getMinNumberOfInvalids(this.state.allPlayers.size);
        const finishedRound = gameRounds[this.state.currentRound - 1];
        const playerInput = (finishedRound.get(evaluatedPlayerId) as PlayerInput[])[categoryIndex];
        playerInput.valid = isInputValid;
        const scoringOptions = (this.state.gameConfig as GameConfig).scoringOptions;
        calculatePointsForCategory(scoringOptions, finishedRound, categoryIndex, this.state.currentRoundEqualAnswers.get(categoryIndex));

        // Inform screen reader users
        const evaluatorName = this.state.allPlayers.get(evaluatorId)?.name;
        const evaluatedName = this.state.allPlayers.get(evaluatedPlayerId)?.name;
        const action = markedAsValid ? 'akzeptiert' : 'abgelehnt';
        const category = this.state.gameConfig?.categories[categoryIndex];
        const a11yMessagePolite = `${evaluatorName} hat Antwort ${playerInput.text} von ${evaluatedName} in Kategorie ${category} ${action}.`;

        this.setState({ a11yMessagePolite, currentRoundEvaluation, gameRounds });
    }

    /**
     * This method is called when the PubNub message 'isPlayerInputVeryCreative' is received.
     * It processes the new status and changes data in gameRounds accordingly.
     */
    private processIsPlayerInputVeryCreativeStatus = (newStatus: IsPlayerInputVeryCreativeStatus) => {
        const { categoryIndex, evaluatedPlayerId, markedAsCreative } = newStatus;

        // Update data with new status
        const gameRounds = cloneDeep(this.state.gameRounds);
        const finishedRound = gameRounds[this.state.currentRound - 1];
        const playerInput = (finishedRound.get(evaluatedPlayerId) as PlayerInput[])[categoryIndex];
        playerInput.star = markedAsCreative;

        // Inform screen reader users
        const evaluatedPlayerName = this.state.allPlayers.get(evaluatedPlayerId)?.name;
        const action = markedAsCreative ? 'bewertet' : 'abgelehnt';
        const category = this.state.gameConfig?.categories[categoryIndex];
        const a11yMessagePolite = `Antwort ${playerInput.text} von ${evaluatedPlayerName} in Kategorie ${category} wurde als besonders kreativ ${action}.`;

        this.setState({ a11yMessagePolite, gameRounds });
    }

    /**
     * This method is called when the PubNub message 'markEqualAnswers' is received.
     */
    private processMarkEqualAnswersMessage = (payload: EqualAnswersOfCategory) => {
        const categoryIndex = payload.c;
        const equalAnswers = payload.v;

        // Update data with answers marked as equal to at least one other answer
        const currentRoundEqualAnswers = cloneDeep(this.state.currentRoundEqualAnswers);
        currentRoundEqualAnswers.set(categoryIndex, equalAnswers);
        const scoringOptions = (this.state.gameConfig as GameConfig).scoringOptions;
        const gameRounds = cloneDeep(this.state.gameRounds);
        calculatePointsForCategory(scoringOptions, gameRounds[this.state.currentRound - 1], categoryIndex, equalAnswers);

        // Inform screen reader users
        const category = this.state.gameConfig?.categories[categoryIndex];
        const message = `Manuelle Markierung gleicher Antworten in der Kategorie ${category} wurde angewendet.`;
        this.props.enqueueSnackbar(message, { 'aria-live': 'off' });

        this.setState({ a11yMessagePolite: message, currentRoundEqualAnswers, gameRounds });
    }

    /**
     * This method is called when the PubNub message 'evaluationFinished' is received.
     */
    private countPlayerAsEvaluationFinished = (playerId: string) => {
        const playersThatFinishedEvaluation = cloneDeep(this.state.playersThatFinishedEvaluation);
        playersThatFinishedEvaluation.set(playerId, true);
        if (playersThatFinishedEvaluation.size === this.state.allPlayers.size) {
            this.processEvaluationsAndStartNextRoundOrFinishGame();
        } else {
            const a11yMessagePolite = `${this.state.allPlayers.get(playerId)?.name} hat die Auswertung der Antworten bestätigt.`;
            this.setState({ a11yMessagePolite, playersThatFinishedEvaluation });
        }
    }

    private processEvaluationsAndStartNextRoundOrFinishGame = () => {
        const { allPlayers, currentRound } = this.state;
        const gameConfig = this.state.gameConfig as GameConfig;
        const gameRounds = cloneDeep(this.state.gameRounds);
        applyValidFlagAndStarFlagToPoints(gameConfig.scoringOptions, gameRounds[currentRound - 1]);
        if (currentRound === gameConfig.numberOfRounds) {
            // Finish game and show results.
            removeAllDataOfRunningGameFromLocalStorage();
            this.props.onSetDataOfFinishedGame({ allPlayers, gameConfig, gameRounds });
            this.props.history.push('/results');
        } else {
            // Save finished game round in local storage and start next round of the game.
            setRunningGameRoundInLocalStorage(this.state.currentRound, gameRounds[currentRound - 1]);
            const nextRound = currentRound + 1;
            this.setState({
                a11yMessagePolite: ROUND_EVALUATION_FINISHED_MESSAGE,
                currentPhase: GamePhase.fillOutTextfields,
                currentRoundEqualAnswers: new Map<number, string[]>(),
                currentRoundEvaluation: createGameRoundEvaluation(allPlayers, gameConfig.categories),
                currentRoundInputs: getEmptyRoundInputs(gameConfig.categories.length),
                currentRound: nextRound,
                gameRounds: [...gameRounds, new Map<string, PlayerInput[]>()],
                isCountdownAlarmActive: false,
                playersThatFinishedEvaluation: new Map<string, boolean>(),
                playersThatFinishedRound: new Map<string, boolean>(),
                showLetterAnimation: true
            });
        }
    }

    /**
     * This method is called when the PubNub message 'kickPlayer' is received.
     */
    private removePlayerFromGame = (playerId: string) => {
        // If the player to be removed is the user of this game instance, then navigate to dashboard.
        if (this.props.playerInfo.id === playerId) {
            removeAllDataOfRunningGameFromLocalStorage();
            this.props.onResetAppState();
            this.props.history.push('/');
            return;
        }
        if (this.state.allPlayers.has(playerId)) {
            // Remove player's data from component's state.
            const allPlayers = cloneDeep(this.state.allPlayers);
            allPlayers.delete(playerId);
            const currentRoundEvaluation = cloneDeep(this.state.currentRoundEvaluation);
            currentRoundEvaluation.delete(playerId);
            const gameRounds = cloneDeep(this.state.gameRounds);
            gameRounds.forEach(round => round.delete(playerId));
            const playersThatFinishedEvaluation = cloneDeep(this.state.playersThatFinishedEvaluation);
            playersThatFinishedEvaluation.delete(playerId);
            this.setState({ allPlayers, currentRoundEvaluation, gameRounds, playersThatFinishedEvaluation });
            // If we're currently in evaluation phase, check if remaining players have finished evaluation.
            if (this.state.currentPhase === GamePhase.evaluateRound && playersThatFinishedEvaluation.size === allPlayers.size) {
                this.processEvaluationsAndStartNextRoundOrFinishGame();
            }
        }
    }

    private sendDataForCurrentGame = (requestingPlayerId: string) => {
        const { allPlayers, currentPhase, currentRound, currentRoundEvaluation, gameRounds } = this.state;
        const sortedPlayers = getPlayersInAlphabeticalOrder(allPlayers);
        const compressedGameRoundEqualAnswers = currentPhase === GamePhase.evaluateRound
            ? compressEqualAnswers(this.state.currentRoundEqualAnswers) : [];
        const compressedGameRoundEvaluation = currentPhase === GamePhase.evaluateRound
            ? compressGameRoundEvaluation(currentRoundEvaluation, sortedPlayers) : [];
        const compressedMarkedAsCreativeFlags = currentPhase === GamePhase.evaluateRound
            ? compressMarkedAsCreativeFlags(gameRounds[currentRound - 1], sortedPlayers) : [];
        const message = new PubNubDataForCurrentGameMessage({
            compressedEqualAnswers: compressedGameRoundEqualAnswers,
            compressedGameRoundEvaluation,
            compressedMarkedAsCreativeFlags,
            currentPhase,
            currentRound,
            playersThatFinishedEvaluation: convertMapToCollection<boolean>(this.state.playersThatFinishedEvaluation),
            requestingPlayerId,
            sortedPlayers
        });
        this.sendPubNubMessage(message.toPubNubMessage());
    }

    /**
     * This method is called when the PubNub message 'dataForCurrentGame' is received.
     */
    private restoreDataForCurrentGame = (payload: PubNubDataForCurrentGameMessagePayload) => {
        // Only process the information and update state if the message was meant for this user.
        if (this.props.playerInfo.id !== payload.requestingPlayerId) { return; }

        const gameConfig = getRunningGameConfigFromLocalStorage();
        // If we're in the evaluation phase, then we also need to restore the data for the current round.
        // Otherwise we only need to restore the data of the finished rounds.
        const numberOfRoundsToRestore = payload.currentPhase === GamePhase.evaluateRound ? payload.currentRound : payload.currentRound - 1;
        const gameRounds = restoreGameRoundsOfRunningGameFromLocalStorage(numberOfRoundsToRestore);
        if (gameConfig && gameRounds.length === numberOfRoundsToRestore) {
            const allPlayers = new Map<string, PlayerInfo>();
            payload.sortedPlayers.forEach(player => allPlayers.set(player.id, player));
            const currentRoundEqualAnswers = decompressEqualAnswers(payload.compressedEqualAnswers || []);
            let currentRoundEvaluation: GameRoundEvaluation;
            // If we are in evaluation phase, then we received the current evaluations and the
            // "marked as very creative" data, which we need to apply to the player inputs.
            if (payload.currentPhase === GamePhase.evaluateRound) {
                const round = gameRounds[payload.currentRound - 1];
                currentRoundEvaluation = decompressGameRoundEvaluation(payload.compressedGameRoundEvaluation, payload.sortedPlayers);
                const min = getMinNumberOfInvalids(allPlayers.size);
                setPointsAndValidity(gameConfig.scoringOptions, currentRoundEvaluation, currentRoundEqualAnswers, min, round);
                applyMarkedAsCreativeFlags(payload.compressedMarkedAsCreativeFlags, payload.sortedPlayers, round);
            } else {
                // If not in evaluation phase, we need to prepare a GameRound and GameRoundEvaluation object for the current round.
                gameRounds.push(new Map<string, PlayerInput[]>());
                currentRoundEvaluation = createGameRoundEvaluation(allPlayers, gameConfig.categories);
            }
            this.setState({
                allPlayers,
                currentPhase: payload.currentPhase,
                currentRound: payload.currentRound,
                currentRoundEqualAnswers,
                currentRoundEvaluation,
                currentRoundInputs: getEmptyRoundInputs(gameConfig.categories.length),
                gameConfig,
                gameRounds,
                playersThatFinishedEvaluation: convertCollectionToMap<boolean>(payload.playersThatFinishedEvaluation),
                showLoadingScreen: false
            });
        } else {
            console.log('Error: Can\'t restore game session because data is missing in local storage!');
            this.navigateToJoinGamePage('Die Rückkehr in das laufende Spiel ist nicht möglich, da die Daten nicht wiederhergestellt werden konnten!');
        }
    }
    //#endregion
}

const mapStateToProps = (state: AppState): PlayGamePropsFromStore => {
    return {
        gameConfig: state.gameConfig,
        gameId: state.gameId,
        isRejoiningGame: state.isRejoiningGame,
        playerInfo: state.playerInfo as PlayerInfo
    };
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): PlayGameDispatchProps => {
    return {
        onSetDataOfFinishedGame: (payload: SetDataOfFinishedGamePayload) => dispatch(setDataOfFinishedGame(payload)),
        onResetAppState: (payload?: ResetAppStatePayload) => dispatch(resetAppState(payload))
    };
};
export default compose(
    withSnackbar,
    connect(mapStateToProps, mapDispatchToProps)
)(PlayGame) as ComponentClass;
