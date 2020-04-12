import { PlayerInfo } from './../models/player.interface';
import { Action } from "redux";
import { GameConfig, GameRound } from "../models/game.interface";

export const SET_DATA_FOR_NEW_GAME = 'SET_DATA_FOR_NEW_GAME';
export const SET_DATA_OF_FINISHED_GAME = 'SET_DATA_OF_FINISHED_GAME';

export interface SetDataForNewGamePayload {
    gameId: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo | null;
}
export interface SetDataForNewGameAction extends Action {
    type: string;
    payload: SetDataForNewGamePayload
}
export interface SetDataOfFinishedGamePayload {
    allPlayers: Map<string, PlayerInfo>;
    gameConfig: GameConfig;
    gameRounds: GameRound[];
}
export interface SetDataOfFinishedGameAction extends Action {
    type: string;
    payload: SetDataOfFinishedGamePayload
}
export type AppAction = SetDataForNewGameAction | SetDataOfFinishedGameAction;

/*
 * Action Creators
 */
export const setDataForNewGame = (payload: SetDataForNewGamePayload): SetDataForNewGameAction => {
    return { type: SET_DATA_FOR_NEW_GAME, payload }
};
export const setDataOfFinishedGame = (payload: SetDataOfFinishedGamePayload): SetDataOfFinishedGameAction => {
    return { type: SET_DATA_OF_FINISHED_GAME, payload }
};
