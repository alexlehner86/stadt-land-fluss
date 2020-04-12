import { createMuiTheme, Theme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';

export enum APP_THEME_ID {
    green = 'green',
    orange = 'orange',
    pink = 'pink'
}

export interface AppTheme {
    id: APP_THEME_ID;
    /** The name of the CSS class that is applied to the header and the main element */
    className: string;
    /** The text displayed in the header's color picker dropdown */
    displayName: string;
    muiTheme: Theme;
}

export const AppThemes: AppTheme[] = [
    {
        id: APP_THEME_ID.green,
        className: 'green-theme',
        displayName: 'Grün',
        muiTheme: createMuiTheme({ palette: { primary: green } })
    },
    {
        id: APP_THEME_ID.orange,
        className: 'orange-theme',
        displayName: 'Orange',
        muiTheme: createMuiTheme({ palette: { primary: orange } })
    },
    {
        id: APP_THEME_ID.pink,
        className: 'pink-theme',
        displayName: 'Pink',
        muiTheme: createMuiTheme({ palette: { primary: purple } })
    },
]
