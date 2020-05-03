import './RejoinRunningGameHint.css';
import { Link } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export enum RejoinRunningGameHintContext {
    newgame = 'newgame',
    joingame = 'joingame'
};

interface RejoinRunningGameHintProps {
    context: RejoinRunningGameHintContext;
}
export const RejoinRunningGameHint: React.FunctionComponent<RejoinRunningGameHintProps> = props => {
    const condition = props.context === 'newgame' ? 'ein neues Spiel erstellst' : 'einem anderen Spiel beitrittst';
    const hintText = `Du nimmst bereits an einem laufenden Spiel teil. Wenn du ${condition},
    kannst du nicht mehr in das alte Spiel zurückkehren!`;

    return (
        <div className="material-card-style">
            <p className="rejoin-running-game-hint-text">
                <span className="rejoin-running-game-hint-highlighted">Achtung: </span>
                {hintText}
            </p>
            <Link component={RouterLink} to="/play" className="rejoin-running-game-hint-highlighted">⇒ Zurück ins laufende Spiel</Link>
        </div>
    );
}
