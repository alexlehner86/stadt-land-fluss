import { Menu, MenuItem } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import BrushIcon from '@material-ui/icons/Brush';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { AppTheme, AppThemes } from '../../constants/themes.constant';
import { AppAction, setAppTheme } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { setAppThemeIdInLocalStorage } from '../../utils/local-storage.utils';
import styles from './Dashboard.module.css';

interface DashboardPropsFromStore {
    activeTheme: AppTheme
    gameId: string | null;
}
interface DashboardDispatchProps {
    onSetAppTheme: (payload: AppTheme) => void;
}
interface DashboardProps extends DashboardPropsFromStore, DashboardDispatchProps { }
interface DashboardState {
    anchorEl: EventTarget | null;
    showCredits: boolean;
}

class Dashboard extends Component<DashboardProps, DashboardState> {
    public state = {
        anchorEl: null,
        showCredits: false
    };

    public render() {
        const rejoinGameElement = (
            <Link component={RouterLink} to="/play" className={styles.rejoin_game_link}>
                <DirectionsRunIcon />
                Zurück ins laufende Spiel
            </Link>
        );
        const creditsButtonAction = this.state.showCredits ? 'ausblenden' : 'einblenden';
        const creditsElement = (
            <React.Fragment>
                <a
                    href="https://www.vecteezy.com/vector-art/830131-river-city-landscape-with-buildings-hills-and-trees"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Illustration „Stadt-Land-Fluss“ von pikgura – www.vecteezy.com
                </a>
                <a
                    href="https://www.vecteezy.com/vector-art/276920-abstract-seamless-pattern-with-tropical-leaves"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Design „Grün/Wald“ von NadiaGrapes – www.vecteezy.com
                </a>
                <a
                    href="https://www.freepik.com/free-photos-vectors/background"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Design „Blau/Meer“ von macrovector – www.freepik.com
                </a>
                <a
                    href="https://www.vecteezy.com/vector-art/460735-seashell-sand-seamless-pattern"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Design „Orange/Strand“ von Macrovector – www.vecteezy.com
                </a>
                <a
                    href="https://www.vecteezy.com/vector-art/454258-music-seamless"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Design „Pink/Musik“ von Macrovector – www.vecteezy.com
                </a>
                <a
                    href="https://www.vecteezy.com/vector-art/662038-cat-and-bat-pattern"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Design „Schwarz/Goth“ von angyee – www.vecteezy.com
                </a>
            </React.Fragment>
        );
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader isH3={false} showDivider={true} text="Dashboard"></SectionHeader>
                    <div className={styles.link_container}>
                        {this.props.gameId ? rejoinGameElement : null}
                        <Link component={RouterLink} to="/newgame">Neues Spiel</Link>
                        <Link component={RouterLink} to="/joingame">Spiel beitreten</Link>
                        <Link component={RouterLink} to="/manual">Spielanleitung</Link>
                    </div>
                    <div className={styles.image_wrapper}>
                        <img
                            src={this.props.activeTheme.homepageImageUrl}
                            alt="Stadt, Land, Fluss"
                            className={styles.slf_image}
                        />
                        <button
                            className={styles.theme_picker_button}
                            title="Design ändern"
                            aria-label="Design ändern"
                            aria-controls="theme-picker-menu"
                            aria-haspopup="true"
                            onClick={this.handleThemePickerClick}
                        >
                            <BrushIcon fontSize="small" className={styles.theme_picker_button_icon} />
                        </button>
                        <Menu
                            id="theme-picker-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleThemePickerMenuClose}
                        >
                            {AppThemes.map((item, index) => (
                                <MenuItem
                                    key={'theme-picker-menu-item-' + index}
                                    onClick={() => this.handleThemePickerMenuItemClick(item)}
                                >{item.displayName}</MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div className={styles.img_copyright}>
                        <button onClick={this.handleCreditsClick}>
                            Copyright-Hinweis <span className="sr-only">{creditsButtonAction}</span>
                        </button>
                        {this.state.showCredits ? creditsElement : null}
                    </div>
                </div>
            </div>
        );
    }

    private handleThemePickerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    private handleThemePickerMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    private handleThemePickerMenuItemClick = (selectedTheme: AppTheme) => {
        this.setState({ anchorEl: null });
        this.props.onSetAppTheme(selectedTheme);
        setAppThemeIdInLocalStorage(selectedTheme.id);
    };

    private handleCreditsClick = () => {
        this.setState({ showCredits: !this.state.showCredits });
    }
}

const mapStateToProps = (state: AppState): DashboardPropsFromStore => {
    return {
        activeTheme: state.activeTheme,
        gameId: state.gameId
    };
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): DashboardDispatchProps => {
    return {
        onSetAppTheme: (payload: AppTheme) => dispatch(setAppTheme(payload)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
