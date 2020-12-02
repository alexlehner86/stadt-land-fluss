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
}

class Dashboard extends Component<DashboardProps, DashboardState> {
    public state = { anchorEl: null };

    public render() {
        const rejoinGameElement = (
            <Link component={RouterLink} to="/play" className={styles.rejoin_game_link}>
                <DirectionsRunIcon />
                Zurück ins laufende Spiel
            </Link>
        );
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader text="Dashboard"></SectionHeader>
                    <nav className={styles.link_container}>
                        {this.props.gameId ? rejoinGameElement : null}
                        <Link component={RouterLink} to="/newgame">Neues Spiel</Link>
                        <Link component={RouterLink} to="/joingame">Spiel beitreten</Link>
                        <Link component={RouterLink} to="/manual">Spielanleitung</Link>
                    </nav>
                    <div className={styles.image_wrapper}>
                        <img
                            src={this.props.activeTheme.homepageImageUrl}
                            alt=""
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
                    <div className={styles.footer_links}>
                        <RouterLink to="/about">Über das Spiel</RouterLink>
                        <div className={styles.separator} aria-hidden="true">|</div>
                        <RouterLink to="/accessibility">Barrierefreiheitserklärung</RouterLink>
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
