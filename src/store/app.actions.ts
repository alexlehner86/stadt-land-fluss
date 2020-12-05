import { Action } from 'redux';
import { AppTheme } from '../constants/themes.constant';
import { GameConfig, GameRound, StoredRunningGameInfo } from '../models/game.interface';
import { PlayerInfo, StoredPlayerInfo } from './../models/player.interface';

export const SET_APP_THEME = 'SET_APP_THEME';
export const SET_STORED_PLAYER_INFO = 'SET_STORED_PLAYER_INFO';
export const SET_STORED_RUNNING_GAME_INFO = 'SET_STORED_RUNNING_GAME_INFO';
export const SET_DATA_FOR_NEW_GAME = 'SET_DATA_FOR_NEW_GAME';
export const SET_DATA_OF_FINISHED_GAME = 'SET_DATA_OF_FINISHED_GAME';
export const RESET_APP_STATE = 'RESET_APP_STATE';

export interface SetAppThemeAction extends Action {
    payload: AppTheme;
}

export interface SetStoredPlayerInfoAction extends Action {
    payload: StoredPlayerInfo;
}

export interface SetStoredRunningGameInfoAction extends Action {
    payload: StoredRunningGameInfo;
}

export interface SetDataForNewGamePayload {
    gameId: string;
    gameConfig: GameConfig | null;
    isRejoiningGame: boolean;
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

export interface ResetAppStatePayload {
    joinGameErrorMessage: string | null;
}
export interface ResetAppStateAction extends Action {
    payload?: ResetAppStatePayload
}

export type AppAction = SetAppThemeAction | SetStoredPlayerInfoAction | SetStoredRunningGameInfoAction
    | SetDataForNewGameAction | SetDataOfFinishedGameAction | ResetAppStateAction | Action;

/*
 * Action Creators
 */
export const setAppTheme = (payload: AppTheme): SetAppThemeAction => {
    return { type: SET_APP_THEME, payload };
};
export const setStoredPlayerInfo = (payload: StoredPlayerInfo): SetStoredPlayerInfoAction => {
    return { type: SET_STORED_PLAYER_INFO, payload };
};
export const setStoredRunningGameInfo = (payload: StoredRunningGameInfo): SetStoredRunningGameInfoAction => {
    return { type: SET_STORED_RUNNING_GAME_INFO, payload };
};
export const setDataForNewGame = (payload: SetDataForNewGamePayload): SetDataForNewGameAction => {
    return { type: SET_DATA_FOR_NEW_GAME, payload };
};
export const setDataOfFinishedGame = (payload: SetDataOfFinishedGamePayload): SetDataOfFinishedGameAction => {
    return { type: SET_DATA_OF_FINISHED_GAME, payload };
};
export const resetAppState = (payload?: ResetAppStatePayload): ResetAppStateAction => {
    return { type: RESET_APP_STATE, payload };
};
