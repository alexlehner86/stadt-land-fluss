import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import React from 'react';

export enum ChipType {
    available = 'available',
    selected = 'selected'
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: theme.spacing(0.5),
        },
        chip: {
            margin: theme.spacing(0.5),
        },
    }),
);

interface ChipsArrayProps {
    chipsArray: string[];
    chipType: ChipType;
    removeChip: (chip: string) => any;
}

const ChipsArray = (props: ChipsArrayProps) => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            {props.chipsArray.map((chip, index) => (
                <Chip
                    key={`chip-to-${props.chipType}-${index}`}
                    color={props.chipType === 'selected' ? 'primary' : undefined}
                    label={chip}
                    className={classes.chip}
                    onDelete={() => props.removeChip(chip)}
                    deleteIcon={props.chipType === 'selected' ? <HighlightOffIcon /> : <DoneIcon />}
                />
            ))}
        </Paper>
    );
}

export default ChipsArray;
