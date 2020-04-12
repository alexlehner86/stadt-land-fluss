import { GameConfig, GameRound } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import {
    AppAction,
    RESET_APP_STATE,
    SET_DATA_FOR_NEW_GAME,
    SET_DATA_OF_FINISHED_GAME,
    SetDataForNewGameAction,
    SetDataOfFinishedGameAction,
} from './app.actions';

export interface AppState {
    allPlayers: Map<string, PlayerInfo> | null;
    gameId: string | null;
    gameConfig: GameConfig | null;
    gameRounds: GameRound[] | null;
    playerInfo: PlayerInfo | null;
}

const initialState: AppState = {
    allPlayers: null,
    gameId: null,
    gameConfig: null,
    gameRounds: null,
    playerInfo: null
};

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
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
            return { ...initialState };
        default:
            return state
    }
};
