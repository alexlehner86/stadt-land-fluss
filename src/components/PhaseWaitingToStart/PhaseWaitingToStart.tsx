import './PhaseWaitingToStart.css';
import { Button, Divider } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import React from 'react';
import { MIN_NUMBER_OF_PLAYERS } from '../../constants/game.constant';
import { GameConfig } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { PubNubMessage, PubNubMessageType } from '../../models/pub-nub-data.model';
import { JoinGameLink } from '../JoinGameLink/JoinGameLink';
import PlayerList from '../PlayerList/PlayerList';
import ScoringOptionsList from '../ScoringOptionsList/ScoringOptionsList';
import { SectionHeader } from '../SectionHeader/SectionHeader';

interface PhaseWaitingToStartProps {
    allPlayers: Map<string, PlayerInfo>;
    gameConfig: GameConfig | null;
    gameId: string;
    playerInfo: PlayerInfo;
    sendMessage: (message: PubNubMessage) => void;
}

const PhaseWaitingToStart: React.FunctionComponent<PhaseWaitingToStartProps> = props => {
    const { allPlayers, gameId, playerInfo } = props;
    const gameConfig = props.gameConfig as GameConfig;
    const waitForGameStartElement = (
        <p className="wait-for-start-animation">Warte auf Spielbeginn <span>.</span><span>.</span><span>.</span></p>
    );
    const createGameSettingsElement = (): JSX.Element => (
        <React.Fragment>
            <Divider />
            <h3>Spieleinstellungen:</h3>
            <p><span className="bold-text">ID:</span> {props.gameId}</p>
            <p><span className="bold-text">Runden:</span> {gameConfig.numberOfRounds}</p>
            <p><span className="bold-text">Kategorien:</span> {gameConfig.categories.join(', ')}</p>
            <p>
                <span className="bold-text">Beenden der Runde durch:</span>
                <span> {gameConfig.useCountdown ? `Countdown (${gameConfig.durationOfCountdown} Sekunden)` : 'Spieler'}</span>
            </p>
            <ScoringOptionsList rules={gameConfig.scoringOptions} />
        </React.Fragment>
    );
    const createStartGameButton = (): JSX.Element => (
        <div className="button-wrapper add-margin-top">
            <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={<PlayCircleFilled />}
                disabled={allPlayers.size < MIN_NUMBER_OF_PLAYERS}
                onClick={() => props.sendMessage({ type: PubNubMessageType.startGame })}
            >Starten</Button>
        </div>
    );
    const createInvitePlayersElement = (): JSX.Element => (
        <div className="material-card-style">
            <JoinGameLink gameId={gameId as string} />
        </div>
    );

    return (
        <React.Fragment>
            <div className="material-card-style">
                <SectionHeader showDivider={true} text="Gleich geht's los..."></SectionHeader>
                <div className="players-wrapper">
                    <h3>Mitspieler ({props.allPlayers.size}):</h3>
                    <PlayerList players={props.allPlayers} />
                </div>
                {props.gameConfig ? createGameSettingsElement() : null}
                <Divider />
                {playerInfo.isAdmin ? createStartGameButton() : waitForGameStartElement}
            </div>
            {playerInfo.isAdmin ? createInvitePlayersElement() : null}
        </React.Fragment>
    );
};

export default PhaseWaitingToStart;
