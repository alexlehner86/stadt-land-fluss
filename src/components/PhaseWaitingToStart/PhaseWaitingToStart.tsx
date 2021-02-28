import './PhaseWaitingToStart.css';

import { Button, Divider } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import { useSnackbar } from 'notistack';
import React from 'react';

import { MIN_NUMBER_OF_PLAYERS } from '../../constants/game.constant';
import { FASTEST_PLAYER } from '../../constants/text.constant';
import { EndRoundMode, GameConfig } from '../../models/game.interface';
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
    informScreenReaderUser: (message: string) => void;
    sendPubNubMessage: (message: PubNubMessage) => void;
}

const PhaseWaitingToStart: React.FunctionComponent<PhaseWaitingToStartProps> = props => {
    const { allPlayers, gameId, playerInfo } = props;
    const gameConfig = props.gameConfig as GameConfig;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const onLinkCopiedToClipboard = () => {
        const message = 'Link zum Spiel wurde in die Zwischenablage kopiert';
        enqueueSnackbar(message, { 'aria-live': 'off' });
        props.informScreenReaderUser(message);
    };
    const waitForGameStartElement = (
        <p className="wait-for-start-animation">Warte auf Spielbeginn <span>.</span><span>.</span><span>.</span></p>
    );
    const getEndRoundDescription = (gameConfig: GameConfig): string => {
        switch (gameConfig.endRoundMode) {
            case EndRoundMode.allPlayersSubmit:
                return 'Wenn alle Spielenden ihre Antworten abgeschickt haben';
            case EndRoundMode.countdownEnds:
                return `Countdown (${gameConfig.durationOfCountdown} Sekunden)`;
            case EndRoundMode.firstPlayerSubmits:
                return FASTEST_PLAYER;
            default:
                return '';
        }
    };
    const createGameSettingsElement = (): JSX.Element => (
        <React.Fragment>
            <Divider />
            <h3>Spieleinstellungen</h3>
            <div className="game-settings">
                <h4>Spiel-ID</h4>
                <p>{props.gameId}</p>
                <h4>Runden</h4>
                <p>{gameConfig.numberOfRounds}</p>
                <h4>Kategorien</h4>
                <p>{gameConfig.categories.join(', ')}</p>
                <h4>Beenden der Runde durch</h4>
                <p>{getEndRoundDescription(gameConfig)}</p>
            </div>
            <ScoringOptionsList isForGameResultsPage={false} rules={gameConfig.scoringOptions} />
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
                onClick={() => props.sendPubNubMessage({ type: PubNubMessageType.startGame })}
            >Starten</Button>
        </div>
    );
    const createInvitePlayersElement = (): JSX.Element => (
        <div className="material-card-style">
            <JoinGameLink
                gameId={gameId as string}
                onLinkCopiedToClipboard={onLinkCopiedToClipboard}
            />
        </div>
    );

    return (
        <React.Fragment>
            <div className="material-card-style">
                <SectionHeader text="Warteraum"></SectionHeader>
                <div className="players-wrapper">
                    <h3>Spielende ({props.allPlayers.size}):</h3>
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
