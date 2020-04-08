import { usePubNub } from "pubnub-react";
import React, { useEffect } from "react";
import { PlayerInfo } from "../../models/player.interface";

interface PubNubEventHandler {
    gameChannel: string;
    playerInfo: PlayerInfo;
}

const PubNubEventHandler = (props: PubNubEventHandler) => {
    const pubNubClient = usePubNub();

    useEffect(() => {
        pubNubClient.addListener({
            message: messageEvent => {
                console.log('message', messageEvent);
            },
            presence: presenceEvent => {
                // check for 'state-change' events and process state from new player
                console.log('presenceEvent', presenceEvent);
                // if (presenceEvent.action === 'join') {
                //     pubNubClient.history(
                //         {
                //             channel: channels[0],
                //             count: 10
                //         },
                //         (status, response) => {
                //             console.log('Aktueller Status:', status);
                //             console.log('Bisherige Messages:', response);
                //         }
                //     );
                // }
            },
            status: statusEvent => {
                if (statusEvent.category === 'PNConnectedCategory') {
                    console.log('connected', statusEvent);
                    var newState = {
                        playerInfo: props.playerInfo
                    };
                    // set this user's state in game channel
                    pubNubClient.setState(
                        {
                            channels: [props.gameChannel],
                            state: newState
                        }
                    );
                    if (!props.playerInfo.isAdmin) {
                        pubNubClient.hereNow(
                            {
                                channels: [props.gameChannel],
                                includeUUIDs: true,
                                includeState: true
                            },
                            function (status, response) {
                                // response includes states of players that joined before
                                console.log('hereNow', response);
                            }
                        );
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
