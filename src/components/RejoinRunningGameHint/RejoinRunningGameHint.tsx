import { Link } from '@material-ui/core';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import React from 'react';

import styles from './RejoinRunningGameHint.module.css';

export enum RejoinRunningGameHintContext {
    newgame = 'newgame',
    joingame = 'joingame'
}

interface RejoinRunningGameHintProps {
    context: RejoinRunningGameHintContext;
    rejoinRunningGame: () => void;
}
export const RejoinRunningGameHint: React.FunctionComponent<RejoinRunningGameHintProps> = props => {
    const condition = props.context === 'newgame' ? 'ein neues Spiel erstellst' : 'einem anderen Spiel beitrittst';
    const hintText = `Du nimmst bereits an einem laufenden Spiel teil. Wenn du ${condition},
    kannst du nicht mehr in das alte Spiel zurückkehren!`;

    return (
        <div className="material-card-style">
            <p className={styles.hint_text}>
                <span className="rejoin-running-game-hint-highlighted">Achtung: </span>
                {hintText}
            </p>
            <Link
                component="button"
                className={styles.rejoin_game_button}
                onClick={props.rejoinRunningGame}
            >
                <DirectionsRunIcon />
                Zurück ins laufende Spiel
            </Link>
        </div>
    );
};
