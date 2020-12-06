import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import React from 'react';

const useStyles = makeStyles({
    centerContent: {
        display: 'flex',
        justifyContent: 'center'
    },
    chip: {
        height: '3rem',
        marginBottom: '0',
        marginTop: '1rem',
        borderRadius: '5px',
        fontWeight: 'normal',
        fontSize: '1.2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,.501961)'
    }
});

interface GameRoundChipProps {
    currentLetter: string;
    currentRound: number;
    isEvaluationPhase: boolean;
    numberOfRounds: number;
}

const GameRoundChip: React.FunctionComponent<GameRoundChipProps> = props => {
    const classes = useStyles();
    const { currentLetter, currentRound, isEvaluationPhase, numberOfRounds } = props;
    const label = isEvaluationPhase
        ? `Auswertung von Runde ${currentRound}: „${currentLetter}“`
        : `Runde ${currentRound} von ${numberOfRounds}: „${currentLetter}“`;
    return (
        <div className={classes.centerContent}>
            <Chip
                color="primary"
                component="h2"
                icon={<EmojiObjectsIcon />}
                label={label}
                className={classes.chip}
            />
        </div>
    );
};

export default GameRoundChip;
