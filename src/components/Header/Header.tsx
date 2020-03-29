import React, { Component } from 'react';
import './Header.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { HeaderBackgroundColors } from '../../constants/color-picker.constant';

interface HeaderProps {
    username: string;
}
interface HeaderState {
    anchorEl: EventTarget | null;
    backgroundColor: string;
}

export class Header extends Component<HeaderProps, HeaderState> {
    public state = { anchorEl: null, backgroundColor: 'purple' };

    public render() {
        return (
            <header
                className="app-header"
                style={{ backgroundColor: this.state.backgroundColor }}
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
                    {HeaderBackgroundColors.map((item, index) => (
                        <MenuItem
                            key={'color-picker-menu-item-' + index}
                            onClick={() => this.handleMenuItemClick(item.color)}
                        >{item.displayName}</MenuItem>
                    ))}
                </Menu>
            </header>
        );
    }

    private handleClick = (event: any) => {
        this.setAnchorEl(event.currentTarget);
    };

    private handleClose = (color: string) => {
        this.setAnchorEl(null);
    };

    private handleMenuItemClick = (backgroundColor: string) => {
        this.setState({
            anchorEl: null,
            backgroundColor
        });
    };

    private setAnchorEl(anchorEl: EventTarget | null) {
        this.setState({ anchorEl });
    }
}
