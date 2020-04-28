import { usePubNub } from 'pubnub-react';
import React, { useEffect } from 'react';
import { GameConfig, PlayerInput, EvaluationOfPlayerInput } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState, PubNubMessage, PubNubMessageType } from '../../models/pub-nub-data.model';
import Pubnub from 'pubnub';

interface PubNubEventHandlerProps {
    gameChannel: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo;
    navigateToDashboard: () => void;
    addPlayers: (...newPlayers: PubNubUserState[]) => void;
    startGame: () => void;
    stopRoundAndSendInputs: () => void;
    addPlayerInputForFinishedRound: (playerId: string, playerInputsForFinishedRound: PlayerInput[]) => void;
    processEvaluationOfPlayerInput: (evaluatingPlayerId: string, newEvaluation: EvaluationOfPlayerInput) => void;
    countPlayerAsEvaluationFinished: (evaluatingPlayerId: string) => void;
}

const PubNubEventHandler: React.FunctionComponent<PubNubEventHandlerProps> = props => {
    const pubNubClient = usePubNub();

    const setUserStateAndGetHereNowIfGameIsOpen = () => {
        pubNubClient.history(
            { channel: props.gameChannel, count: 10 },
            (_, response) => {
                // If history includes messages, then game has already started and user can't join.
                // User gets rerouted to dashboard page by PlayGame component.
                if (response.messages.length > 0) {
                    props.navigateToDashboard();
                } else {
                    setUserState();
                    if (!props.playerInfo.isAdmin) {
                        getHereNowData();
                        // Safeguard against the possibility of two players joining exactly at the same time:
                        // We call hereNowData again after 2 seconds, to make sure we get all player info.
                        setTimeout(getHereNowData, 2000);
                    }
                }
            }
        );
    };
    const setUserState = () => {
        let newUserState: PubNubUserState;
        if (props.playerInfo.isAdmin) {
            newUserState = { gameConfig: props.gameConfig as GameConfig, playerInfo: props.playerInfo };
        } else {
            newUserState = { playerInfo: props.playerInfo };
        }
        // Set this user's state in game channel.
        pubNubClient.setState({
            channels: [props.gameChannel],
            state: newUserState
        });
    };
    const getHereNowData = () => {
        pubNubClient.hereNow(
            { channels: [props.gameChannel], includeUUIDs: true, includeState: true },
            (_, response) => {
                console.log('PubNub hereNow', response);
                // Response includes states of players that joined before.
                const dataForGameChannel = response.channels[props.gameChannel];
                if (dataForGameChannel) {
                    const pubNubUserStates: PubNubUserState[] = [];
                    dataForGameChannel.occupants.forEach(occupant => {
                        const userState = occupant.state as PubNubUserState;
                        // Safeguard in case that a user's state should be missing or corrupted.
                        if (!!userState && !!userState.playerInfo) {
                            pubNubUserStates.push(userState);
                        }
                    });
                    props.addPlayers(...pubNubUserStates);
                }
            }
        );
    };

    useEffect(() => {
        const pubNubListeners: Pubnub.ListenerParameters = {
            message: messageEvent => {
                console.log('PubNub message event', messageEvent);
                const message = messageEvent.message as PubNubMessage;
                switch (message.type) {
                    case PubNubMessageType.startGame:
                        props.startGame();
                        break;
                    case PubNubMessageType.roundFinished:
                        props.stopRoundAndSendInputs();
                        break;
                    case PubNubMessageType.currentRoundInputs:
                        props.addPlayerInputForFinishedRound(messageEvent.publisher, message.payload);
                        break;
                    case PubNubMessageType.evaluationOfPlayerInput:
                        props.processEvaluationOfPlayerInput(messageEvent.publisher, message.payload);
                        break;
                    case PubNubMessageType.evaluationFinished:
                        props.countPlayerAsEvaluationFinished(messageEvent.publisher);
                        break;
                    default:
                }
            },
            presence: presenceEvent => {
                console.log('PubNub presence event', presenceEvent);
                // Check for 'state-change' events and process state from new player.
                if (presenceEvent.action === 'state-change') {
                    const userState = presenceEvent.state as PubNubUserState;
                    if (userState.playerInfo.id !== props.playerInfo.id) {
                        props.addPlayers(userState);
                    }
                }
            },
            status: statusEvent => {
                console.log('PubNub status event', statusEvent);
                if (statusEvent.category === 'PNConnectedCategory') {
                    console.log('Player is connected to PubNub game channel');
                    setUserStateAndGetHereNowIfGameIsOpen();
                }
            }
        };
        pubNubClient.addListener(pubNubListeners);
        pubNubClient.subscribe({
            channels: [props.gameChannel],
            withPresence: true
        });
        // When this component is destroyed, we unsubscribe from game channel.
        return () => {
            pubNubClient.removeListener(pubNubListeners);
            pubNubClient.unsubscribeAll();
        }
    });
    return null;
};

export default React.memo(PubNubEventHandler);
