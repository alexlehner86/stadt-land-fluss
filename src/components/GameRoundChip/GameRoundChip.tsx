import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import React from 'react';

const useStyles = makeStyles(_ =>
    createStyles({
        centerContent: {
            display: 'flex',
            justifyContent: 'center'
        },
        chip: {
            height: '3rem',
            marginTop: '1rem',
            borderRadius: '5px',
            fontSize: '1.2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,.501961)'
        }
    }),
);

interface GameRoundChipProps {
    currentLetter: string;
    currentRound: number;
}

const GameRoundChip = (props: GameRoundChipProps) => {
    const classes = useStyles();
    const { currentLetter, currentRound } = props;
    return (
        <div className={classes.centerContent}>
            <Chip
                color="primary"
                icon={<EmojiObjectsIcon />}
                label={`Runde ${currentRound}: „${currentLetter}“`}
                className={classes.chip}
            />
        </div>
    );
}

export default GameRoundChip;
