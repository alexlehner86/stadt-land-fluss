import './Header.css';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import BrushIcon from '@material-ui/icons/Brush';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import packageJson from '../../../package.json';
import { AppTheme, AppThemes } from '../../constants/themes.constant';
import { AppState } from '../../store/app.reducer';
import { RouteComponentProps, withRouter } from 'react-router';

interface HeaderPropsFromStore {
    playerName: string | null;
}
interface HeaderProps extends HeaderPropsFromStore, RouteComponentProps {
    switchTheme: (newTheme: AppTheme) => any;
    theme: AppTheme;
}
interface HeaderState {
    anchorEl: EventTarget | null;
    version: string;
}

export class Header extends Component<HeaderProps, HeaderState> {
    public state = {
        anchorEl: null,
        version: ''
    };

    public render() {
        const playerNameParagraph = (
            <p>Spieler: {this.props.playerName ? this.props.playerName : '-'}</p>
        );
        return (
            <header className={'app-header ' + this.props.theme.className}>
                <h1>Stadt-Land-Fluss</h1>
                {playerNameParagraph}
                <div className="about-section">
                    <p>v{this.state.version}</p>
                    <a
                        href="https://github.com/alexlehner86"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Mehr über den Autor erfahren (öffnet neues Fenster)"
                    >Autor</a>
                </div>
                <div className="icon-button-wrapper">
                    <IconButton
                        className="slf-icon-button"
                        size="small"
                        title="Spielanleitung"
                        aria-label="Spielanleitung"
                        onClick={this.handleManualButtonClick}
                    >
                        <MenuBookIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        className="slf-icon-button"
                        size="small"
                        title="Theme ändern"
                        aria-label="Theme ändern"
                        aria-controls="theme-picker-menu"
                        aria-haspopup="true"
                        onClick={this.handleThemePickerClick}
                    >
                        <BrushIcon fontSize="small" />
                    </IconButton>
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
            </header>
        );
    }

    public componentDidMount() {
        this.setState({ version: packageJson.version });
    }

    private handleManualButtonClick = () => {
        this.props.history.push('/manual');
    }

    private handleThemePickerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    private handleThemePickerMenuClose = () => {
        this.setState({ anchorEl: null });
    };

    private handleThemePickerMenuItemClick = (selectedTheme: AppTheme) => {
        this.setState({ anchorEl: null });
        this.props.switchTheme(selectedTheme);
    };
}

const mapStateToProps = (state: AppState): HeaderPropsFromStore => {
    return {
        playerName: state.playerInfo ? state.playerInfo.name : ''
    };
}
export default withRouter(connect(mapStateToProps)(Header));
