import { GameConfig, PlayerInput } from './game.interface';
import { PlayerInfo } from './player.interface';

export interface PubNubUserState {
    gameConfig?: GameConfig;
    playerInfo: PlayerInfo;
}

export enum PubNubMessageType {
    startGame = 'startGame',
    roundFinished = 'roundFinished',
    currentRoundInputs = 'currentRoundInputs'
}

export interface PubNubMessage {
    type: PubNubMessageType;
    payload?: any;
}

export class PubNubCurrentRoundInputsMessage {
    constructor(private payload: PlayerInput[]) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.currentRoundInputs,
            payload: this.payload
        }
    }
}
