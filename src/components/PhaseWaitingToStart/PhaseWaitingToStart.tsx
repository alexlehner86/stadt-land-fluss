import { Button, Divider } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import React from 'react';
import { GameConfig } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { JoinGameLink } from '../JoinGameLink/JoinGameLink';
import OtherPlayers from '../OtherPlayers/OtherPlayers';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import { PubNubMessage, PubNubMessageType } from '../../models/pub-nub-data.model';

interface PhaseWaitingToStartProps {
    gameConfig: GameConfig | null;
    gameId: string;
    otherPlayers: Map<string, PlayerInfo>;
    playerInfo: PlayerInfo;
    sendMessage: (message: PubNubMessage) => void;
}

const PhaseWaitingToStart = (props: PhaseWaitingToStartProps) => {
    const { gameId, otherPlayers, playerInfo } = props;
    const waitForGameStartElement = (<p>Warte auf Spielbeginn...</p>);

    const createGameSettingsElement = (): JSX.Element => {
        const gameConfig = props.gameConfig as GameConfig;
        return (
            <React.Fragment>
                <Divider />
                <h3>Spiele-Settings:</h3>
                <p>Runden: {gameConfig.numberOfRounds}</p>
                <p>Kategorien: {gameConfig.categories.join(', ')}</p>
            </React.Fragment>
        );
    }

    const createStartGameButton = (): JSX.Element => {
        return (
            <div className="button-wrapper add-margin-top">
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<PlayCircleFilled />}
                    disabled={otherPlayers.size < 1}
                    onClick={() => props.sendMessage({ type: PubNubMessageType.startGame })}
                >Starten</Button>
            </div>
        );
    }

    const createInvitePlayersElement = (): JSX.Element => {
        return (
            <div className="material-card-style">
                <JoinGameLink gameId={gameId as string} />
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="material-card-style">
                <SectionHeader showDivider={true} text="Gleich geht's los..."></SectionHeader>
                <h3 className="other-players-headline">Mitspieler:</h3>
                <OtherPlayers otherPlayers={props.otherPlayers} />
                {props.gameConfig ? createGameSettingsElement() : null}
                <Divider />
                {playerInfo.isAdmin ? createStartGameButton() : waitForGameStartElement}
            </div>
            {playerInfo.isAdmin ? createInvitePlayersElement() : null}
        </React.Fragment>
    );
}

export default PhaseWaitingToStart;
