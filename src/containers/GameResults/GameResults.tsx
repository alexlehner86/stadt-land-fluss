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
import { GameConfig, GameResultForPlayer, HallOfFameEntry, GameRound } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, resetAppState } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { calculateGameResults, createHallOfFameData, getPlayersInAlphabeticalOrder } from '../../utils/game.utils';
import styles from './GameResults.module.css';

interface GameResultsDispatchProps {
    onResetAppState: () => void;
}
interface GameResultsProps extends AppState, GameResultsDispatchProps, RouterProps { }
interface GameResultsState {
    gameConfig: GameConfig | null;
    gameResults: GameResultForPlayer[];
    gameRounds: GameRound[];
    hallOfFameData: HallOfFameEntry[];
    sortedPlayers: PlayerInfo[];
}

class GameResults extends Component<GameResultsProps, GameResultsState> {
    public state: GameResultsState = {
        gameConfig: null,
        gameResults: [],
        gameRounds: [],
        hallOfFameData: [],
        sortedPlayers: []
    };

    public render() {
        const { gameConfig, gameResults, gameRounds, hallOfFameData, sortedPlayers } = this.state;
        if (gameConfig === null) { return null; }
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader isH3={false} showDivider={true} text="Ergebnis"></SectionHeader>
                    <GameResultsList gameResults={gameResults} />
                    <Divider />
                    <div className={styles.button_wrapper}>
                        <GameRoundsOverviewButton
                            gameConfig={gameConfig}
                            rounds={gameRounds}
                            sortedPlayers={sortedPlayers}
                        />
                        <HallOfFameButton hallOfFameData={hallOfFameData} />
                    </div>
                </div>
                <div className="material-card-style">
                    <SectionHeader isH3={false} showDivider={true} text="Spieleinstellungen"></SectionHeader>
                    <p><span className="bold-text">Runden:</span> {gameConfig.numberOfRounds}</p>
                    <p><span className="bold-text">Buchstaben:</span> {gameConfig.letters.join(', ')}</p>
                    <p><span className="bold-text">Kategorien:</span> {gameConfig.categories.join(', ')}</p>
                    <ScoringOptionsList rules={gameConfig.scoringOptions} />
                </div>
                <ToDashboardButton onReturnToDashboard={() => this.props.history.push('/')} />
            </div>
        );
    }

    public componentDidMount() {
        const { allPlayers, gameConfig, gameRounds} = this.props;
        // If there is no data present in application state, then reroute user to dashboard.
        if (allPlayers === null || gameConfig === null || gameRounds === null) {
            this.props.history.push('/');
        } else {
            this.setState({
                gameConfig,
                gameResults: calculateGameResults(allPlayers, gameRounds),
                gameRounds,
                hallOfFameData: createHallOfFameData(allPlayers, gameConfig, gameRounds),
                sortedPlayers: getPlayersInAlphabeticalOrder(allPlayers)
            });
            this.props.onResetAppState();
        }
    }
}

const mapStateToProps = (state: AppState): AppState => state;
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): GameResultsDispatchProps => {
    return {
        onResetAppState: () => dispatch(resetAppState())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(GameResults);
