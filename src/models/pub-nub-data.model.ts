import { GamePhase } from '../constants/game.constant';
import { Collection } from './collection.interface';
import { EvaluationOfPlayerInput, GameConfig, IsPlayerInputVeryCreativeStatus, PlayerInput } from './game.interface';
import { PlayerInfo } from './player.interface';

export interface PubNubUserState {
    gameConfig?: GameConfig;
    playerInfo: PlayerInfo;
}

export enum PubNubMessageType {
    currentRoundInputs = 'currentRoundInputs',
    dataForCurrentGame = 'dataForCurrentGame',
    evaluationFinished = 'evaluationFinished',
    evaluationOfPlayerInput = 'evaluationOfPlayerInput',
    isPlayerInputVeryCreative = 'isPlayerInputVeryCreative',
    kickPlayer = 'kickPlayer',
    requestGameData = 'requestGameData',
    roundFinished = 'roundFinished',
    startGame = 'startGame'
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
        };
    }
}

export class PubNubEvaluationOfPlayerInputMessage {
    constructor(private payload: EvaluationOfPlayerInput) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.evaluationOfPlayerInput,
            payload: this.payload
        };
    }
}

export class PubNubIsPlayerInputVeryCreativeMessage {
    constructor(private payload: IsPlayerInputVeryCreativeStatus) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.isPlayerInputVeryCreative,
            payload: this.payload
        };
    }
}

export class PubNubKickPlayerMessage {
    constructor(private payload: string) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.kickPlayer,
            payload: this.payload
        };
    }
}

export interface PubNubDataForCurrentGameMessagePayload {
    compressedGameRoundEvaluation: boolean[][][];
    compressedMarkedAsCreativeFlags: boolean[][];
    currentPhase: GamePhase;
    currentRound: number;
    playersThatFinishedEvaluation: Collection<boolean>;
    requestingPlayerId: string;
    sortedPlayers: PlayerInfo[];
}
export class PubNubDataForCurrentGameMessage {
    constructor(private payload: PubNubDataForCurrentGameMessagePayload) {}

    public toPubNubMessage(): PubNubMessage {
        return {
            type: PubNubMessageType.dataForCurrentGame,
            payload: this.payload
        };
    }
}
