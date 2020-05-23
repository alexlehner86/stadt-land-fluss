import './Header.css';
import { IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import packageJson from '../../../package.json';
import { AppTheme } from '../../constants/themes.constant';
import { AppState } from '../../store/app.reducer';

interface HeaderPropsFromStore {
    playerName: string | null;
}
interface HeaderProps extends HeaderPropsFromStore, RouteComponentProps {
    theme: AppTheme;
}

export class Header extends Component<HeaderProps> {
    public render() {
        return (
            <header className={'app-header ' + this.props.theme.className}>
                <h1>Stadt-Land-Fluss</h1>
                <p>Spieler: {this.props.playerName ? this.props.playerName : '-'}</p>
                <div className="about-section">
                    <p>v{packageJson.version}</p>
                    <a
                        href="https://github.com/alexlehner86"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Mehr über den Autor erfahren (öffnet neues Fenster)"
                    >Autor</a>
                </div>
                <IconButton
                    className="to-dashboard-icon-button"
                    size="small"
                    title="Zum Dashboard"
                    aria-label="Zum Dashboard"
                    onClick={() => this.props.history.push('/')}
                >
                    <ExitToAppIcon fontSize="small" />
                </IconButton>
            </header>
        );
    }
}

const mapStateToProps = (state: AppState): HeaderPropsFromStore => {
    return {
        playerName: state.playerInfo ? state.playerInfo.name : ''
    };
}
export default withRouter(connect(mapStateToProps)(Header));
