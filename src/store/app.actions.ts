import { PlayerInfo, StoredPlayerInfo } from './../models/player.interface';
import { Action } from "redux";
import { GameConfig, GameRound } from "../models/game.interface";

export const SET_STORED_PLAYER_INFO = 'SET_STORED_PLAYER_INFO';
export const SET_DATA_FOR_NEW_GAME = 'SET_DATA_FOR_NEW_GAME';
export const SET_DATA_OF_FINISHED_GAME = 'SET_DATA_OF_FINISHED_GAME';
export const RESET_APP_STATE = 'RESET_APP_STATE';

export interface SetStoredPlayerInfoAction extends Action {
    payload: StoredPlayerInfo;
}

export interface SetDataForNewGamePayload {
    gameId: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo | null;
}
export interface SetDataForNewGameAction extends Action {
    payload: SetDataForNewGamePayload
}

export interface SetDataOfFinishedGamePayload {
    allPlayers: Map<string, PlayerInfo>;
    gameConfig: GameConfig;
    gameRounds: GameRound[];
}
export interface SetDataOfFinishedGameAction extends Action {
    payload: SetDataOfFinishedGamePayload
}

export interface ResetAppStateAction extends Action {}

export type AppAction = SetStoredPlayerInfoAction | SetDataForNewGameAction | SetDataOfFinishedGameAction | ResetAppStateAction;

/*
 * Action Creators
 */
export const setStoredPlayerInfo = (payload: StoredPlayerInfo): SetStoredPlayerInfoAction => {
    return { type: SET_STORED_PLAYER_INFO, payload }
};
export const setDataForNewGame = (payload: SetDataForNewGamePayload): SetDataForNewGameAction => {
    return { type: SET_DATA_FOR_NEW_GAME, payload }
};
export const setDataOfFinishedGame = (payload: SetDataOfFinishedGamePayload): SetDataOfFinishedGameAction => {
    return { type: SET_DATA_OF_FINISHED_GAME, payload }
};
export const resetAppState = (): ResetAppStateAction => {
    return { type: RESET_APP_STATE }
};
