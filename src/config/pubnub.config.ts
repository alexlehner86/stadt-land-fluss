import PubNub from 'pubnub';
import { v4 as uuidv4 } from 'uuid';

const PUBNUB_KEYS = require('./pubnub.config.json');

export const PUBNUB_CONFIG: PubNub.PubnubConfig = {
    publishKey: PUBNUB_KEYS.publishKey,
    subscribeKey: PUBNUB_KEYS.subscribeKey,
    uuid: uuidv4() // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
};
