export enum APP_THEMES {
    green = 'green',
    orange = 'orange',
    pink = 'pink'
}

export interface AppTheme {
    theme: APP_THEMES;
    /** The name of the CSS class that is applied to the header and the main element */
    className: string;
    /** The text displayed in the header's color picker dropdown */
    displayName: string;
}

export const AppThemes: AppTheme[] = [
    { theme: APP_THEMES.green, className: 'green-theme', displayName: 'Grün' },
    { theme: APP_THEMES.orange, className: 'orange-theme', displayName: 'Orange' },
    { theme: APP_THEMES.pink, className: 'pink-theme', displayName: 'Pink' },
]
