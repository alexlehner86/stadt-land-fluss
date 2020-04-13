import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import CSS from 'csstype';

export enum APP_THEME_ID {
    green = 'green',
    blue = 'blue',
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
    style: CSS.Properties;
}

export const AppThemes: AppTheme[] = [
    {
        id: APP_THEME_ID.green,
        className: 'green-theme',
        displayName: 'Grün/Wald',
        muiTheme: createMuiTheme({ palette: { primary: green } }),
        style: {
            background:
                `linear-gradient(rgba(60, 143, 80, 0.3), rgba(60, 143, 80, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/leaves-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.blue,
        className: 'blue-theme',
        displayName: 'Blau/Fluss',
        muiTheme: createMuiTheme({ palette: { primary: blue } }),
        style: {
            background:
                `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/river-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.orange,
        className: 'orange-theme',
        displayName: 'Orange/Strand',
        muiTheme: createMuiTheme({ palette: { primary: orange } }),
        style: {
            background:
                `linear-gradient(rgba(241, 179, 8, 0.1), rgba(240, 188, 47, 0.1)),
                url('${process.env.PUBLIC_URL}/assets/beach-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.pink,
        className: 'pink-theme',
        displayName: 'Pink/Musik',
        muiTheme: createMuiTheme({ palette: { primary: purple } }),
        style: {
            background:
                `linear-gradient(rgba(133, 14, 103, 0.3), rgba(133, 14, 103, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/music-pattern.jpg')`
        }
    },
]
