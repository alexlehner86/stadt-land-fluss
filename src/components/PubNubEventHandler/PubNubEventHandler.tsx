import Pubnub from 'pubnub';
import { usePubNub } from 'pubnub-react';
import React, { useEffect } from 'react';

import { GameConfig } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState } from '../../models/pub-nub-data.model';

interface PubNubEventHandlerProps {
    gameChannel: string;
    gameConfig: GameConfig | null;
    isRejoiningGame: boolean;
    playerInfo: PlayerInfo;
    navigateToJoinGamePage: (errorMessage: string) => void;
    addPlayers: (...newPlayers: PubNubUserState[]) => void;
    processPubNubMessage: (event: Pubnub.MessageEvent) => void;
}

const PubNubEventHandler: React.FunctionComponent<PubNubEventHandlerProps> = props => {
    const pubNubClient = usePubNub();
    let hereNowDataTimeout: NodeJS.Timeout;

    const setUserStateAndGetHereNowIfGameIsOpen = () => {
        pubNubClient.history(
            { channel: props.gameChannel, count: 10 },
            (_, response) => {
                // If a new user wants to join the game but the channel's history already includes messages, then the game
                // has already started and user can't join. They get rerouted to the dashboard page by PlayGame component.
                if (!props.isRejoiningGame && response.messages.length > 0) {
                    props.navigateToJoinGamePage('Du kannst einem bereits gestarteten Spiel nicht beitreten!');
                    return;
                }
                // The hereNow call is used to check total occupancy and retrieve data of already joined players.
                getHereNowData();
                // Only if player is joining game for the first time, set user state and use hereNow safeguard.
                if (!props.isRejoiningGame) {
                    setUserState();
                    // Safeguard against the possibility of two players joining exactly at the same time:
                    // We call hereNowData again after 3 seconds, to make sure we get all player info.
                    hereNowDataTimeout = setTimeout(getHereNowData, 3000);
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
                // If the player is not the game's admin, then the channel's occupancy should be at least 1 (= admin).
                // Otherwise there is no open game with the game id entered by the user in the JoinGame form.
                // Also, if the player (including the admin) tries to rejoin but they are the only player left in the channel,
                // then the game is already over. In both cases, the user gets rerouted to the dashboard page by PlayGame component.
                if (response.totalOccupancy === 0 && (!props.playerInfo.isAdmin || props.isRejoiningGame)) {
                    props.navigateToJoinGamePage('Es gibt kein offenes Spiel mit der angegebenen Spiel-ID!');
                    return;
                }
                // Only process the information of players that joined before if user isn't rejoining the game.
                // If user is rejoining game, then this information is received via the PubNubDataForCurrentGameMessage.
                if (!props.isRejoiningGame) {
                    const dataForGameChannel = response.channels[props.gameChannel];
                    if (dataForGameChannel) {
                        const pubNubUserStates: PubNubUserState[] = [];
                        dataForGameChannel.occupants.forEach(occupant => {
                            const userState = occupant.state as PubNubUserState;
                            // Safeguard in case that a user's state should be missing or corrupted.
                            // Only include states of the other players, not of the user themselves.
                            if (!!userState && !!userState.playerInfo && userState.playerInfo.id !== props.playerInfo.id) {
                                pubNubUserStates.push(userState);
                            }
                        });
                        if (pubNubUserStates.length > 0) {
                            props.addPlayers(...pubNubUserStates);
                        }
                    }
                }
            }
        );
    };

    useEffect(() => {
        const pubNubListeners: Pubnub.ListenerParameters = {
            message: messageEvent => {
                console.log('PubNub message event', messageEvent);
                // Make sure that message is controlled game message with 'type' attribute.
                if (messageEvent.message.type) {
                    props.processPubNubMessage(messageEvent);
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
            if (hereNowDataTimeout) {
                clearTimeout(hereNowDataTimeout);
            }
            pubNubClient.removeListener(pubNubListeners);
            pubNubClient.unsubscribeAll();
        };
    });
    return null;
};

export default React.memo(PubNubEventHandler);
