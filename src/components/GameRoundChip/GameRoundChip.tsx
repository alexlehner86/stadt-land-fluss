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
    numberOfRounds: number;
}

const GameRoundChip: React.FunctionComponent<GameRoundChipProps> = props => {
    const classes = useStyles();
    const { currentLetter, currentRound, numberOfRounds } = props;
    return (
        <div className={classes.centerContent}>
            <Chip
                color="primary"
                component="h2"
                icon={<EmojiObjectsIcon />}
                label={`Runde ${currentRound} von ${numberOfRounds}: „${currentLetter}“`}
                className={classes.chip}
            />
        </div>
    );
};

export default GameRoundChip;
