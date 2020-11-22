import PubNub from 'pubnub';

import PUBNUB_KEYS from './pubnub.config.json';

export const PUBNUB_CONFIG: PubNub.PubnubConfig = {
    publishKey: PUBNUB_KEYS.publishKey,
    subscribeKey: PUBNUB_KEYS.subscribeKey,
    uuid: undefined, // ⇨ is set by PlayGame component,
    ssl: true
};
