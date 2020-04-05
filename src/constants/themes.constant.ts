import { createMuiTheme, Theme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';

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
    muiTheme: Theme;
}

export const AppThemes: AppTheme[] = [
    {
        theme: APP_THEMES.green,
        className: 'green-theme',
        displayName: 'Grün',
        muiTheme: createMuiTheme({ palette: { primary: green } })
    },
    {
        theme: APP_THEMES.orange,
        className: 'orange-theme',
        displayName: 'Orange',
        muiTheme: createMuiTheme({ palette: { primary: orange } })
    },
    {
        theme: APP_THEMES.pink,
        className: 'pink-theme',
        displayName: 'Pink',
        muiTheme: createMuiTheme({ palette: { primary: purple } })
    },
]
