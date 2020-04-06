import { Action } from "redux";

export const SET_GAME_DATA = 'SET_GAME_DATA';

export interface SetGameDataPayload {
    gameId: string;
    isAdmin: boolean;
    playerName: string;
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
