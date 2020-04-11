import React, { Component } from 'react';
import './Header.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { AppThemes, AppTheme } from '../../constants/themes.constant';
import { connect } from 'react-redux';
import { AppState } from '../../store/app.reducer';

interface HeaderPropsFromStore {
    playerName: string | null;
}
interface HeaderProps extends HeaderPropsFromStore {
    switchTheme: (newTheme: AppTheme) => any;
    theme: AppTheme;
}
interface HeaderState {
    anchorEl: EventTarget | null;
}

export class Header extends Component<HeaderProps, HeaderState> {
    public state = { anchorEl: null };

    public render() {
        const playerNameParagraph = (
            <p>Spieler: {this.props.playerName ? this.props.playerName : '-'}</p>
        );
        return (
            <header
                className={'app-header ' + this.props.theme.className}
            >
                <h1>Stadt-Land-Fluss</h1>
                {playerNameParagraph}
                <Button
                    className="color-picker-button"
                    aria-controls="color-picker-menu"
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Theme
                </Button>
                <Menu
                    id="color-picker-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    {AppThemes.map((item, index) => (
                        <MenuItem
                            key={'color-picker-menu-item-' + index}
                            onClick={() => this.handleMenuItemClick(item)}
                        >{item.displayName}</MenuItem>
                    ))}
                </Menu>
            </header>
        );
    }

    private handleClick = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    private handleClose = (color: string) => {
        this.setState({ anchorEl: null });
    };

    private handleMenuItemClick = (selectedTheme: AppTheme) => {
        this.setState({ anchorEl: null });
        this.props.switchTheme(selectedTheme);
    };
}

const mapStateToProps = (state: AppState): HeaderPropsFromStore => {
    return {
        playerName: state.playerInfo ? state.playerInfo.name : ''
    };
}
export default connect(mapStateToProps)(Header);
