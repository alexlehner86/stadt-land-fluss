import { GameConfig, GameRound } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import {
    AppAction,
    RESET_APP_STATE,
    SET_DATA_FOR_NEW_GAME,
    SET_DATA_OF_FINISHED_GAME,
    SET_STORED_PLAYER_INFO,
    SET_STORED_RUNNING_GAME_INFO,
    SetDataForNewGameAction,
    SetDataOfFinishedGameAction,
    SetStoredPlayerInfoAction,
    SetStoredRunningGameInfoAction,
} from './app.actions';

export interface AppState {
    allPlayers: Map<string, PlayerInfo> | null;
    gameId: string | null;
    gameConfig: GameConfig | null;
    gameRounds: GameRound[] | null;
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}

const initialState: AppState = {
    allPlayers: null,
    gameId: null,
    gameConfig: null,
    gameRounds: null,
    playerIdCreationTimestamp: 0,
    playerInfo: null
};

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case SET_STORED_PLAYER_INFO:
            const storedPlayerInfo = (action as SetStoredPlayerInfoAction).payload;
            return {
                ...state,
                playerIdCreationTimestamp: storedPlayerInfo.idCreationTimestamp,
                playerInfo: {
                    id: storedPlayerInfo.id,
                    isAdmin: false,
                    isRejoiningGame: false,
                    name: storedPlayerInfo.name
                }
            };
        case SET_STORED_RUNNING_GAME_INFO:
            const storedRunningGameInfo = (action as SetStoredRunningGameInfoAction).payload;
            return {
                ...state,
                gameId: storedRunningGameInfo.gameId,
                playerInfo: {
                    ...state.playerInfo as PlayerInfo,
                    isAdmin: storedRunningGameInfo.isPlayerAdmin,
                    isRejoiningGame: true
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
            return state
    }
};
