import { GameConfig, GameRound, PlayerInput, StoredRunningGameInfo } from '../models/game.interface';
import { StoredPlayerInfo } from '../models/player.interface';
import { APP_THEME_ID } from './../constants/themes.constant';
import { convertMapToCollection, convertCollectionToMap } from './general.utils';
import { MAX_NUMBER_OF_ROUNDS } from '../constants/game.constant';

const APP_THEME_LS_KEY = 'SLF-APP-THEME';
const PLAYER_INFO_LS_KEY = 'SLF-PLAYER-INFO';
const RUNNING_GAME_INFO_LS_KEY = 'SLF-RUNNING-GAME-INFO';
const RUNNING_GAME_CONFIG_LS_KEY = 'SLF-RUNNING-GAME-CONFIG';
/** Is used to store a completed round in local storage; e.g. 'SLF-RUNNING-GAME-ROUND-1' */
const RUNNING_GAME_ROUND_LS_KEY_PREFIX = 'SLF-RUNNING-GAME-ROUND-';

export const getAppThemeIdFromLocalStorage = (): string | null =>  localStorage.getItem(APP_THEME_LS_KEY);
export const setAppThemeIdInLocalStorage = (appTheme: APP_THEME_ID) => localStorage.setItem(APP_THEME_LS_KEY, appTheme);

export const getPlayerInfoFromLocalStorage = (): StoredPlayerInfo | null => {
    const storedData = localStorage.getItem(PLAYER_INFO_LS_KEY);
    return storedData ? JSON.parse(storedData) : null;
};
export const setPlayerInfoInLocalStorage = (data: StoredPlayerInfo) => localStorage.setItem(PLAYER_INFO_LS_KEY, JSON.stringify(data));

export const getRunningGameInfoFromLocalStorage = (): StoredRunningGameInfo | null => {
    const storedData = localStorage.getItem(RUNNING_GAME_INFO_LS_KEY);
    return storedData ? JSON.parse(storedData) : null;
};
export const setRunningGameInfoInLocalStorage = (data: StoredRunningGameInfo) => localStorage.setItem(RUNNING_GAME_INFO_LS_KEY, JSON.stringify(data));

export const getRunningGameConfigFromLocalStorage = (): GameConfig | null => {
    const storedData = localStorage.getItem(RUNNING_GAME_CONFIG_LS_KEY);
    return storedData ? JSON.parse(storedData) : null;
};
export const setRunningGameConfigInLocalStorage = (data: GameConfig) => localStorage.setItem(RUNNING_GAME_CONFIG_LS_KEY, JSON.stringify(data));

export const getRunningGameRoundFromLocalStorage = (round: number): GameRound | null => {
    const storedData = localStorage.getItem(RUNNING_GAME_ROUND_LS_KEY_PREFIX + round);
    return storedData ? convertCollectionToMap<PlayerInput[]>(JSON.parse(storedData)) : null;
}
export const setRunningGameRoundInLocalStorage = (round: number, data: GameRound) => {
    localStorage.setItem(
        RUNNING_GAME_ROUND_LS_KEY_PREFIX + round,
        JSON.stringify(convertMapToCollection<PlayerInput[]>(data))
    );
}

export const removeAllDataOfRunningGameFromLocalStorage = () => {
    localStorage.removeItem(RUNNING_GAME_INFO_LS_KEY);
    localStorage.removeItem(RUNNING_GAME_CONFIG_LS_KEY);
    for (let i = 1; i <= MAX_NUMBER_OF_ROUNDS; i++) {
        localStorage.removeItem(RUNNING_GAME_ROUND_LS_KEY_PREFIX + i);
    }
};
