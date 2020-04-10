import { GameConfig } from "./game-config.interface";
import { PlayerInfo } from "./player.interface";

export interface PubNubUserState {
    gameConfig?: GameConfig;
    playerInfo: PlayerInfo;
}

export enum PubNubMessageType {
    startGame = 'startGame'
}

export interface PubNubMessage {
    type: PubNubMessageType;
    payload?: any;
}
