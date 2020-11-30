import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
import styles from './ChipsArray.module.css';

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
        }
    }),
);

interface ChipsArrayProps {
    chipsArray: string[];
    chipType: ChipType;
    removeChip: (chip: string) => void;
}

const ChipsArray: React.FunctionComponent<ChipsArrayProps> = props => {
    const classes = useStyles();
    return (
        <div className={classes.root} role="list">
            {props.chipsArray.map((chip, index) => (
                <Chip
                    key={`chip-to-${props.chipType}-${index}`}
                    role="listitem"
                    classes={{ root: styles.chip, label: styles.chip_label }}
                    color={props.chipType === 'selected' ? 'primary' : undefined}
                    icon={props.chipType === 'selected' ? <DoneIcon className="chip-icon-no-bg" /> : <ChevronRightIcon />}
                    label={chip}
                    onClick={() => props.removeChip(chip)}
                />
            ))}
            {props.children}
        </div>
    );
};

export default ChipsArray;
