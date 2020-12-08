import Chip from '@material-ui/core/Chip';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import React from 'react';

import styles from './GameRoundChip.module.css';

interface GameRoundChipProps {
    currentLetter: string;
    currentRound: number;
    isEvaluationPhase: boolean;
    numberOfRounds: number;
}

const GameRoundChip: React.FunctionComponent<GameRoundChipProps> = props => {
    const { currentLetter, currentRound, isEvaluationPhase, numberOfRounds } = props;
    return (
        <div className={styles.centerContent}>
            <Chip
                color="primary"
                component="h2"
                icon={<EmojiObjectsIcon />}
                label={`Runde ${currentRound} von ${numberOfRounds}: „${currentLetter}“`}
                className={styles.chip}
            />
            {isEvaluationPhase ? (
                <Chip
                    color="primary"
                    label="Auswertung"
                    className={styles.chipEvaluation}
                />
            ) : null}
        </div>
    );
};

export default GameRoundChip;
