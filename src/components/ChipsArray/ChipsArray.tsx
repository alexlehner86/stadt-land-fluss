import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DoneIcon from '@material-ui/icons/Done';
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
        chipIcon: {
            backgroundColor: 'inherit'
        }
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
        <div className={classes.root}>
            {props.chipsArray.map((chip, index) => (
                <Chip
                    key={`chip-to-${props.chipType}-${index}`}
                    color={props.chipType === 'selected' ? 'primary' : undefined}
                    label={chip}
                    className={classes.chip}
                    onClick={() => props.removeChip(chip)}
                    avatar={props.chipType === 'selected' ? <DoneIcon className="chip-icon-no-bg" /> : <ChevronRightIcon />}
                />
            ))}
        </div>
    );
}

export default ChipsArray;
