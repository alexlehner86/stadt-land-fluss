export enum APP_THEMES {
    green = 'green',
    orange = 'orange',
    pink = 'pink'
}

export interface HeaderTheme {
    theme: APP_THEMES;
    /** The name of the CSS class that is applied to the header element */
    className: string;
    /** The text displayed in the header's color picker dropdown */
    displayName: string;
}

export const HeaderThemes: HeaderTheme[] = [
    { theme: APP_THEMES.green, className: 'green-theme', displayName: 'Grün' },
    { theme: APP_THEMES.orange, className: 'orange-theme', displayName: 'Orange' },
    { theme: APP_THEMES.pink, className: 'pink-theme', displayName: 'Pink' },
]
