import './GameResults.css';
import { Divider } from '@material-ui/core';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import GameResultsList from '../../components/GameResultsList/GameResultsList';
import GameRoundsOverviewButton from '../../components/GameRoundsOverviewButton/GameRoundsOverviewButton';
import HallOfFameButton from '../../components/HallOfFameButton/HallOfFameButton';
import ScoringOptionsList from '../../components/ScoringOptionsList/ScoringOptionsList';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { GameConfig, GameResultForPlayer, HallOfFameEntry } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, resetAppState } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { calculateGameResults, getPlayersInAlphabeticalOrder, createHallOfFameData } from '../../utils/game.utils';

interface GameResultsDispatchProps {
    onResetAppState: () => void;
}
interface GameResultsProps extends AppState, GameResultsDispatchProps, RouterProps { }
interface GameResultsState {
    gameResults: GameResultForPlayer[];
    hallOfFameData: HallOfFameEntry[];
    sortedPlayers: PlayerInfo[];
}

class GameResults extends Component<GameResultsProps, GameResultsState> {
    public state: GameResultsState = {
        gameResults: [],
        hallOfFameData: [],
        sortedPlayers: []
    };

    public render() {
        if (this.props.gameRounds === null) { return null; }
        const gameConfig = this.props.gameConfig as GameConfig;
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Ergebnis"></SectionHeader>
                    <GameResultsList gameResults={this.state.gameResults} />
                    <Divider />
                    <div className="slf-game-results-button-wrapper">
                        <GameRoundsOverviewButton
                            gameConfig={gameConfig}
                            rounds={this.props.gameRounds}
                            sortedPlayers={this.state.sortedPlayers}
                        />
                        <HallOfFameButton hallOfFameData={this.state.hallOfFameData} />
                    </div>
                </div>
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Spiele-Settings"></SectionHeader>
                    <p>Runden: {gameConfig.numberOfRounds}</p>
                    <p>Buchstaben: {gameConfig.letters.join(', ')}</p>
                    <p>Kategorien: {gameConfig.categories.join(', ')}</p>
                    <ScoringOptionsList rules={gameConfig.scoringOptions} />
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
            </div>
        );
    }

    public componentDidMount() {
        const { allPlayers, gameConfig, gameRounds} = this.props;
        // If there are no allPlayers or gameRounds present in application state, then reroute user to dashboard.
        if (allPlayers === null || gameRounds === null) {
            this.props.history.push('/');
            return;
        }
        this.setState({
            gameResults: calculateGameResults(allPlayers, gameRounds),
            hallOfFameData: createHallOfFameData(allPlayers, gameConfig as GameConfig, gameRounds),
            sortedPlayers: getPlayersInAlphabeticalOrder(allPlayers)
        });
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
        this.props.onResetAppState();
    }
}

const mapStateToProps = (state: AppState): AppState => state;
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): GameResultsDispatchProps => {
    return {
        onResetAppState: () => dispatch(resetAppState())
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(GameResults);
