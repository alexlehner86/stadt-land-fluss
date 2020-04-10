import { usePubNub } from 'pubnub-react';
import React, { useEffect } from 'react';
import { GameConfig } from '../../models/game-config.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubUserState } from '../../models/pub-nub-data.interface';

interface PubNubEventHandlerProps {
    gameChannel: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo;
    addPlayers: (...newPlayers: PubNubUserState[]) => void
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
                console.log('hereNow', response);
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
                console.log('message', messageEvent);
            },
            presence: presenceEvent => {
                console.log('presenceEvent', presenceEvent);
                // Check for 'state-change' events and process state from new player.
                if (presenceEvent.action === 'state-change' && presenceEvent.uuid !== props.playerInfo.id) {
                    props.addPlayers(presenceEvent.state as PubNubUserState);
                }
            },
            status: statusEvent => {
                if (statusEvent.category === 'PNConnectedCategory') {
                    console.log('connected', statusEvent);
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
        return () => pubNubClient.unsubscribe({ channels: [props.gameChannel] });
    });

    return null;
};

export default React.memo(PubNubEventHandler);
