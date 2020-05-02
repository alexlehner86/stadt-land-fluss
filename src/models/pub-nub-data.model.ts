import { GamePhase } from '../constants/game.constant';
import { Collection } from './collection.interface';
import { EvaluationOfPlayerInput, GameConfig, PlayerInput } from './game.interface';
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
    evaluationFinished = 'evaluationFinished',
    kickPlayer = 'kickPlayer',
    requestGameData = 'requestGameData',
    dataForCurrentGame = 'dataForCurrentGame'
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

export class PubNubKickPlayerMessage {
    constructor(private payload: string) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.kickPlayer,
            payload: this.payload
        }
    }
}

export interface PubNubDataForCurrentGameMessagePayload {
    allPlayers: Collection<PlayerInfo>;
    currentPhase: GamePhase;
    currentRound: number;
    currentRoundEvaluation: Collection<Collection<boolean>[]>;
    gameConfig: GameConfig;
    gameRounds: Collection<PlayerInput[]>[];
    playersThatFinishedEvaluation: Collection<boolean>;
    requestingPlayerId: string;
}
export class PubNubDataForCurrentGameMessage {
    constructor(private payload: PubNubDataForCurrentGameMessagePayload) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.dataForCurrentGame,
            payload: this.payload
        }
    }
}
