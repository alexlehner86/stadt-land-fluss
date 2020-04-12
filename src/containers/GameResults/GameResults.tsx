import './GameResults.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouterProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { GameConfig, GameResultForPlayer } from '../../models/game.interface';
import { AppState } from '../../store/app.reducer';
import { calculateGameResults } from '../../utils/game.utils';

interface GameResultsProps extends AppState, RouterProps { }
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
                    {this.state.gameResults.map(result => (
                        <React.Fragment>
                            <SectionHeader showDivider={true} text="Spiel-Settings"></SectionHeader>
                            <p>{result.playerName}: {result.points}</p>
                        </React.Fragment>
                    ))}
                </div>
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Spiel-Settings"></SectionHeader>
                    <h3>Spiele-Settings:</h3>
                    <p>Runden: {gameConfig.numberOfRounds}</p>
                    <p>Kategorien: {gameConfig.categories.join(', ')}</p>
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
}

const mapStateToProps = (state: AppState): AppState => state;
export default connect(mapStateToProps, null)(GameResults);
