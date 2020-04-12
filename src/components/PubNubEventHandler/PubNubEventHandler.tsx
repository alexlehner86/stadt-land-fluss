import { usePubNub } from 'pubnub-react';
import React, { useEffect } from 'react';
import { GameConfig, PlayerInput, EvaluationOfPlayerInput } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState, PubNubMessage, PubNubMessageType } from '../../models/pub-nub-data.model';

interface PubNubEventHandlerProps {
    gameChannel: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo;
    addPlayers: (...newPlayers: PubNubUserState[]) => void;
    startGame: () => void;
    stopRoundAndSendInputs: () => void;
    addPlayerInputForFinishedRound: (playerId: string, playerInputsForFinishedRound: PlayerInput[]) => void;
    processEvaluationOfPlayerInput: (evaluatingPlayerId: string, newEvaluation: EvaluationOfPlayerInput) => void;
    countPlayerAsEvaluationFinished: (evaluatingPlayerId: string) => void;
}

const PubNubEventHandler = (props: PubNubEventHandlerProps) => {
    const pubNubClient = usePubNub();

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
    }

    const getHereNowData = () => {
        pubNubClient.hereNow(
            { channels: [props.gameChannel], includeUUIDs: true, includeState: true },
            (_, response) => {
                console.log('PubNub hereNow', response);
                // Response includes states of players that joined before.
                const dataForGameChannel = response.channels[props.gameChannel];
                if (dataForGameChannel) {
                    props.addPlayers(...dataForGameChannel.occupants.map(occupant => occupant.state as PubNubUserState));
                }
            }
        );
    }

    useEffect(() => {
        pubNubClient.addListener({
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
                if (statusEvent.category === 'PNConnectedCategory') {
                    console.log('PubNub status event: connected', statusEvent);
                    setUserState();
                    if (!props.playerInfo.isAdmin) {
                        getHereNowData();
                    }
                }
            }
        });
        pubNubClient.subscribe({
            channels: [props.gameChannel],
            withPresence: true
        });
        // When this component is destroyed, we unsubscribe from game channel.
        return () => pubNubClient.unsubscribe({ channels: [props.gameChannel] });
    });

    return null;
};

export default React.memo(PubNubEventHandler);
