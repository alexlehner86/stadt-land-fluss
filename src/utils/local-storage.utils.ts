import { StoredRunningGameInfo } from '../models/game.interface';
import { StoredPlayerInfo } from '../models/player.interface';
import { APP_THEME_ID } from './../constants/themes.constant';

const APP_THEME_LS_KEY = 'SLF-APP-THEME';
const PLAYER_INFO_LS_KEY = 'SLF-PLAYER-INFO';
const RUNNING_GAME_INFO_LS_KEY = 'SLF-RUNNING-GAME-INFO';

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
}
export const setRunningGameInfoInLocalStorage = (data: StoredRunningGameInfo) => localStorage.setItem(RUNNING_GAME_INFO_LS_KEY, JSON.stringify(data));
export const removeRunningGameInfoFromLocalStorage = () => localStorage.removeItem(RUNNING_GAME_INFO_LS_KEY);
