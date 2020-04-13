import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import StarIcon from '@material-ui/icons/Star';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';

import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { GameConfig, GameResultForPlayer } from '../../models/game.interface';
import { AppAction, resetAppState } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { calculateGameResults } from '../../utils/game.utils';
import { makePluralIfCountIsNotOne } from '../../utils/general.utils';

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
        const mostPoints = Math.max(...this.state.gameResults.map(result => result.points));
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Ergebnis"></SectionHeader>
                    <List>
                        {this.state.gameResults.map((result, index) => (
                            <ListItem key={'results-for-player-' + index}>
                                <ListItemIcon>
                                    {this.getResultIcon(result.points === mostPoints)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={result.playerName}
                                    secondary={`${result.points} ${makePluralIfCountIsNotOne(result.points, 'Punkt', 'Punkte')}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Spiele-Settings"></SectionHeader>
                    <p>Runden: {gameConfig.numberOfRounds}</p>
                    <p>Buchstaben: {gameConfig.letters.join(', ')}</p>
                    <p>Kategorien: {gameConfig.categories.join(', ')}</p>
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
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

    private getResultIcon = (isWinner: boolean): JSX.Element => {
        return isWinner ? <StarIcon color="primary" fontSize="large" /> : <FaceIcon fontSize="large" />;
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
