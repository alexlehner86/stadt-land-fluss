import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { GameConfig, GameResultForPlayer } from '../../models/game.interface';
import { AppState } from '../../store/app.reducer';
import { calculateGameResults } from '../../utils/game.utils';
import { AppAction, resetAppState } from '../../store/app.actions';

interface GameResultsDispatchProps {
    onResetAppState: () => void;
}
interface GameResultsProps extends AppState, GameResultsDispatchProps, RouterProps { }
interface GameResultsState {
    gameResults: GameResultForPlayer[];
}

class GameResults extends Component<GameResultsProps, GameResultsState> {
    public state: GameResultsState = { gameResults: [] };

    public render() {
        if (this.props.gameRounds === null) { return null; }
        const gameConfig = this.props.gameConfig as GameConfig;
        // todo: add key to gameResults.map content
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Ergebnis"></SectionHeader>
                    {this.state.gameResults.map((result, index) => (
                        <p key={'results-for-player-' + index}>{result.playerName}: {result.points}</p>
                    ))}
                </div>
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Spiel-Settings"></SectionHeader>
                    <h3>Spiele-Settings:</h3>
                    <p>Runden: {gameConfig.numberOfRounds}</p>
                    <p>Kategorien: {gameConfig.categories.join(', ')}</p>
                </div>
                <div className="button-wrapper add-margin-top">
                    <Button
                        type="button"
                        color="primary"
                        variant="contained"
                        size="large"
                        startIcon={<ExitToAppIcon />}
                        onClick={this.returnToDashboard}
                    >Dashboard</Button>
                </div>
            </div>
        );
    }

    public componentDidMount() {
        // If there are no allPlayers or gameRounds present in application state, then reroute user to dashboard.
        if (this.props.allPlayers === null || this.props.gameRounds === null) {
            this.props.history.push('/');
            return;
        }
        this.setState({ gameResults: calculateGameResults(this.props.allPlayers, this.props.gameRounds) });
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
        this.props.onResetAppState();
    }
}

const mapStateToProps = (state: AppState): AppState => state;
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): GameResultsDispatchProps => {
    return {
        onResetAppState: () => {
            dispatch(resetAppState())
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(GameResults);
