import { APP_THEME_ID } from './../constants/themes.constant';
const APP_THEME_LOCAL_STORAGE_KEY = 'SLF-APP-THEME';

export const getAppThemeIdFromLocalStorage = (): string | null => {
    return localStorage.getItem(APP_THEME_LOCAL_STORAGE_KEY);
};

export const setAppThemeIdInLocalStorage = (appTheme: APP_THEME_ID) => {
    return localStorage.setItem(APP_THEME_LOCAL_STORAGE_KEY, appTheme);
};
