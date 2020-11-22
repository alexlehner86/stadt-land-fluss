import './Header.css';
import { IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import packageJson from '../../../package.json';
import { AppTheme } from '../../constants/themes.constant';
import { AppState } from '../../store/app.reducer';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

interface HeaderPropsFromStore {
    playerName: string | null;
}
interface HeaderProps extends HeaderPropsFromStore, RouteComponentProps {
    theme: AppTheme;
}
interface HeaderState {
    isFullscreenActive: boolean;
}

export class Header extends Component<HeaderProps, HeaderState> {
    public state = { isFullscreenActive: false };

    public render() {
        const fullscreenButtonTitle = this.state.isFullscreenActive ? 'Vollbildmodus beenden' : 'Vollbildmodus starten';
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
                <div className="icon-buttons">
                    <IconButton
                        size="small"
                        title={fullscreenButtonTitle}
                        aria-label={fullscreenButtonTitle}
                        onClick={() => this.toggleFullscreen()}
                    >
                        {this.state.isFullscreenActive ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                    </IconButton>
                    <IconButton
                        size="small"
                        title="Zum Dashboard"
                        aria-label="Zum Dashboard"
                        onClick={() => this.props.history.push('/')}
                    >
                        <ExitToAppIcon fontSize="small" />
                    </IconButton>
                </div>
            </header>
        );
    }

    public componentDidMount() {
        document.addEventListener('fullscreenchange', () => {
            // document.fullscreenElement will point to the element that is in fullscreen mode if there is one.
            // If there isn't one, the value of the property is null.
            this.setState({ isFullscreenActive: !!document.fullscreenElement });
        });
    }

    private toggleFullscreen() {
        if (this.state.isFullscreenActive) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
        }
    }

    private openFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) { /* Firefox */
            (elem as any).mozRequestFullScreen();
        } else if ((elem as any).webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) { /* IE/Edge */
            (elem as any).msRequestFullscreen();
        }
    }

    private closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) { /* Firefox */
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) { /* Chrome, Safari and Opera */
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) { /* IE/Edge */
            (document as any).msExitFullscreen();
        }
    }
}

const mapStateToProps = (state: AppState): HeaderPropsFromStore => {
    return {
        playerName: state.playerInfo ? state.playerInfo.name : ''
    };
};
export default withRouter(connect(mapStateToProps)(Header));
