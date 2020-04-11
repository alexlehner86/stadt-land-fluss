import { PlayerInfo } from './../models/player.interface';
import { Action } from "redux";
import { GameConfig } from "../models/game.interface";

export const SET_GAME_DATA = 'SET_GAME_DATA';

export interface SetGameDataPayload {
    gameId: string;
    gameConfig: GameConfig | null;
    playerInfo: PlayerInfo | null;
}
export interface SetGameDataAction extends Action {
    type: string;
    payload: SetGameDataPayload
}
export type AppAction = SetGameDataAction;

/*
 * Action Creators
 */
export const setGameData = (payload: SetGameDataPayload): SetGameDataAction => {
    return { type: SET_GAME_DATA, payload }
};
