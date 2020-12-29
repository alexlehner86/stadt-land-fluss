import { Divider } from '@material-ui/core';
import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';

import FireworksAnimation from '../../components/FireworksAnimation/FireworksAnimation';
import GameResultsList from '../../components/GameResultsList/GameResultsList';
import GameRoundsOverviewButton from '../../components/GameRoundsOverviewButton/GameRoundsOverviewButton';
import HallOfFameButton from '../../components/HallOfFameButton/HallOfFameButton';
import ScoringOptionsList from '../../components/ScoringOptionsList/ScoringOptionsList';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { GameConfig, GameResultsGroup, GameRound, HallOfFameEntry } from '../../models/game.interface';
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
    gameResults: GameResultsGroup[];
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
        if (this.state.gameConfig === null) { return null; }
        const { gameConfig, gameResults, gameRounds, hallOfFameData, sortedPlayers } = this.state;
        const gameResultsElement = (
            <div className="material-card-style">
                <SectionHeader text="Ergebnis"></SectionHeader>
                <p className="sr-only" role="alert">
                    Das Spiel ist zu Ende. Die Ergebnisse werden angezeigt.
                </p>
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
        );
        const gameSettingsElement = (
            <div className="material-card-style">
                <SectionHeader text="Spieleinstellungen"></SectionHeader>
                <div className="game-settings">
                    <h4>Runden</h4>
                    <p>{gameConfig.numberOfRounds}</p>
                    <h4>Buchstaben</h4>
                    <p>{gameConfig.letters.join(', ')}</p>
                    <h4>Kategorien</h4>
                    <p>{gameConfig.categories.join(', ')}</p>
                </div>
                <ScoringOptionsList isForGameResultsPage={true} rules={gameConfig.scoringOptions} />
            </div>
        );
        return (
            <React.Fragment>
                <div className="main-content-wrapper">
                    {gameResultsElement}
                    {gameSettingsElement}
                    <ToDashboardButton onReturnToDashboard={() => this.props.history.push('/')} />
                </div>
                <FireworksAnimation duration={6000} />
            </React.Fragment>
        );
    }

    public componentDidMount() {
        const { allPlayers, gameConfig, gameRounds } = this.props;
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
