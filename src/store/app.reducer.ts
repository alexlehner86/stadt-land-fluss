import { AppTheme, AppThemes } from '../constants/themes.constant';
import { GameConfig, GameRound } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { StoredRunningGameInfo } from './../models/game.interface';
import { StoredPlayerInfo } from './../models/player.interface';
import {
    AppAction,
    RESET_APP_STATE,
    SET_APP_THEME,
    SET_DATA_FOR_NEW_GAME,
    SET_DATA_OF_FINISHED_GAME,
    SET_STORED_PLAYER_INFO,
    SET_STORED_RUNNING_GAME_INFO,
    SetAppThemeAction,
    SetDataForNewGameAction,
    SetDataOfFinishedGameAction,
    SetStoredPlayerInfoAction,
    SetStoredRunningGameInfoAction,
} from './app.actions';

export interface AppState {
    activeTheme: AppTheme;
    allPlayers: Map<string, PlayerInfo> | null;
    gameId: string | null;
    gameConfig: GameConfig | null;
    gameRounds: GameRound[] | null;
    isRejoiningGame: boolean;
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}

const initialState: AppState = {
    activeTheme: AppThemes[0],
    allPlayers: null,
    gameId: null,
    gameConfig: null,
    gameRounds: null,
    isRejoiningGame: false,
    playerIdCreationTimestamp: 0,
    playerInfo: null
};

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
    let storedPlayerInfo: StoredPlayerInfo;
    let storedRunningGameInfo: StoredRunningGameInfo;
    switch (action.type) {
        case SET_APP_THEME:
            return { ...state, activeTheme: (action as SetAppThemeAction).payload };
        case SET_STORED_PLAYER_INFO:
            storedPlayerInfo = (action as SetStoredPlayerInfoAction).payload;
            return {
                ...state,
                isRejoiningGame: false,
                playerIdCreationTimestamp: storedPlayerInfo.idCreationTimestamp,
                playerInfo: {
                    id: storedPlayerInfo.id,
                    isAdmin: false,
                    name: storedPlayerInfo.name
                }
            };
        case SET_STORED_RUNNING_GAME_INFO:
            storedRunningGameInfo = (action as SetStoredRunningGameInfoAction).payload;
            return {
                ...state,
                isRejoiningGame: true,
                gameId: storedRunningGameInfo.gameId,
                playerInfo: {
                    ...state.playerInfo as PlayerInfo,
                    isAdmin: storedRunningGameInfo.isPlayerAdmin
                }
            };
        case SET_DATA_FOR_NEW_GAME:
            return {
                ...state,
                ...(action as SetDataForNewGameAction).payload
            };
        case SET_DATA_OF_FINISHED_GAME:
            return {
                ...state,
                ...(action as SetDataOfFinishedGameAction).payload,
                // Set gameId to null to prevent player from manually opening PlayGame route.
                gameId: null
            };
        case RESET_APP_STATE:
            return {
                ...state,
                allPlayers: null,
                gameId: null,
                gameConfig: null,
                gameRounds: null,
            };
        default:
            return state;
    }
};
