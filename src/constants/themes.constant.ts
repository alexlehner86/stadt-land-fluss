import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import CSS from 'csstype';

export enum APP_THEME_ID {
    green = 'green',
    blue = 'blue',
    orange = 'orange',
    pink = 'pink',
    black = 'black'
}

export interface AppTheme {
    id: APP_THEME_ID;
    /** The background color used by the LetterAnimation component */
    animationBackgroundColor: string;
    /** The name of the CSS class that is applied to the header and the main element */
    className: string;
    /** The text displayed in the header's color picker dropdown */
    displayName: string;
    /** URL of the "Stadt-Land-Fluss" image visible on the homepage */
    homepageImageUrl: string;
    muiTheme: Theme;
    style: CSS.Properties;
}

export const AppThemes: AppTheme[] = [
    {
        id: APP_THEME_ID.green,
        animationBackgroundColor: 'rgb(31, 121, 52)',
        className: 'green-theme',
        displayName: 'Grün/Wald',
        homepageImageUrl: `${process.env.PUBLIC_URL}/assets/city-country-river-green.jpg`,
        muiTheme: createMuiTheme({
            palette: { primary: { main: green[800] }, secondary: red }
        }),
        style: {
            background:
                `linear-gradient(rgba(60, 143, 80, 0.3), rgba(60, 143, 80, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/leaves-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.blue,
        animationBackgroundColor: 'rgb(9, 100, 204)',
        className: 'blue-theme',
        displayName: 'Blau/Meer',
        homepageImageUrl: `${process.env.PUBLIC_URL}/assets/city-country-river-blue.jpg`,
        muiTheme: createMuiTheme({
            palette: { primary: { main: blue[800] }, secondary: deepOrange }
        }),
        style: {
            background:
                `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/sea-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.orange,
        animationBackgroundColor: 'rgb(187, 138, 5)',
        className: 'orange-theme',
        displayName: 'Orange/Strand',
        homepageImageUrl: `${process.env.PUBLIC_URL}/assets/city-country-river-orange.jpg`,
        muiTheme: createMuiTheme({
            palette: { primary: { main: deepOrange[900] }, secondary: indigo }
        }),
        style: {
            background:
                `linear-gradient(rgba(241, 179, 8, 0.3), rgba(240, 188, 47, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/beach-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.pink,
        animationBackgroundColor: 'rgb(167, 34, 207)',
        className: 'pink-theme',
        displayName: 'Pink/Musik',
        homepageImageUrl: `${process.env.PUBLIC_URL}/assets/city-country-river-pink.jpg`,
        muiTheme: createMuiTheme({ palette: { primary: purple, secondary: amber } }),
        style: {
            background:
                `linear-gradient(rgba(133, 14, 103, 0.3), rgba(133, 14, 103, 0.3)),
                url('${process.env.PUBLIC_URL}/assets/music-pattern.jpg')`
        }
    },
    {
        id: APP_THEME_ID.black,
        animationBackgroundColor: 'rgb(0, 0, 0)',
        className: 'black-theme',
        displayName: 'Schwarz/Goth',
        homepageImageUrl: `${process.env.PUBLIC_URL}/assets/city-country-river-bw.jpg`,
        muiTheme: createMuiTheme({
            palette: { primary: { main: grey[900] }, secondary: orange }
        }),
        style: {
            background:
                `linear-gradient(rgba(0, 51, 153, 0.1), rgba(0, 51, 153, 0.1)),
                url('${process.env.PUBLIC_URL}/assets/halloween-pattern.jpg')`
        }
    },
];
