import { GameConfig, PlayerInput, EvaluationOfPlayerInput } from './game.interface';
import { PlayerInfo } from './player.interface';

export interface PubNubUserState {
    gameConfig?: GameConfig;
    playerInfo: PlayerInfo;
}

export enum PubNubMessageType {
    startGame = 'startGame',
    roundFinished = 'roundFinished',
    currentRoundInputs = 'currentRoundInputs',
    evaluationOfPlayerInput = 'evaluationOfPlayerInput',
    evaluationFinished = 'evaluationFinished'
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

export class PubNubEvaluationOfPlayerInputMessage {
    constructor(private payload: EvaluationOfPlayerInput) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.evaluationOfPlayerInput,
            payload: this.payload
        }
    }
}
