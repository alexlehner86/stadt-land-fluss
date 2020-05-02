import PubNub from 'pubnub';

const PUBNUB_KEYS = require('./pubnub.config.json');

export const PUBNUB_CONFIG: PubNub.PubnubConfig = {
    publishKey: PUBNUB_KEYS.publishKey,
    subscribeKey: PUBNUB_KEYS.subscribeKey,
    uuid: undefined, // ⇨ is set by PlayGame component,
    ssl: true
};
