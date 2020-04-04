import React, { Component } from 'react';
import './Header.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { HeaderThemes, HeaderTheme } from '../../constants/themes.constant';

interface HeaderProps {
    switchTheme: (newTheme: HeaderTheme) => any;
    theme: HeaderTheme;
    username: string;
}
interface HeaderState {
    anchorEl: EventTarget | null;
}

export class Header extends Component<HeaderProps, HeaderState> {
    public state = { anchorEl: null };

    public render() {
        return (
            <header
                className={'app-header ' + this.props.theme.className}
            >
                <h1>Stadt-Land-Fluss</h1>
                <p>Nutzer: {this.props.username}</p>
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
                    {HeaderThemes.map((item, index) => (
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

    private handleMenuItemClick = (selectedTheme: HeaderTheme) => {
        this.setState({ anchorEl: null });
        this.props.switchTheme(selectedTheme);
    };
}
