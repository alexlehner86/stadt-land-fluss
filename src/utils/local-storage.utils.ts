import { APP_THEME_ID } from './../constants/themes.constant';
import { StoredPlayerInfo } from '../models/player.interface';

const APP_THEME_LOCAL_STORAGE_KEY = 'SLF-APP-THEME';
const PLAYER_INFO_LOCAL_STORAGE_KEY = 'SLF-PLAYER-INFO';

export const getAppThemeIdFromLocalStorage = (): string | null => {
    return localStorage.getItem(APP_THEME_LOCAL_STORAGE_KEY);
};
export const setAppThemeIdInLocalStorage = (appTheme: APP_THEME_ID) => {
    return localStorage.setItem(APP_THEME_LOCAL_STORAGE_KEY, appTheme);
};

export const getPlayerInfoFromLocalStorage = (): StoredPlayerInfo | null => {
    const storedData = localStorage.getItem(PLAYER_INFO_LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
};
export const setPlayerInfoInLocalStorage = (playerInfoToStore: StoredPlayerInfo) => {
    return localStorage.setItem(PLAYER_INFO_LOCAL_STORAGE_KEY, JSON.stringify(playerInfoToStore));
};
