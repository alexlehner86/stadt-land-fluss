import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import StarIcon from '@material-ui/icons/Star';
import React, { useState } from 'react';

import { HallOfFameEntry } from '../../models/game.interface';

const useStyles = makeStyles({
    list: {
        paddingBottom: 0,
    },
    listItem: {
        padding: '0.25rem 0',
    },
    listItemAvatar: {
        marginRight: '1rem',
    },
    primary: {
        color: '#555555',
        fontSize: '0.875rem',
    },
    secondary: {
        color: 'black',
        fontSize: '1rem',
    }
});

export interface HallOfFameDialogProps {
    hallOfFameData: HallOfFameEntry[];
    open: boolean;
    onClose: () => void;
}
const HallOfFameDialog: React.FunctionComponent<HallOfFameDialogProps> = props => {
    const styles = useStyles();
    const { hallOfFameData, open, onClose } = props;
    return (
        <Dialog onClose={onClose} open={open} maxWidth="lg">
            <DialogContent>
                <DialogContentText>Hall of Fame</DialogContentText>
                <Divider />
                <List className={styles.list}>
                    {hallOfFameData.map((item, index) => (
                        <ListItem key={`slf-hall-of-fame-item-${index}`} className={styles.listItem}>
                            <ListItemAvatar className={styles.listItemAvatar}>
                                <Chip
                                    icon={<FaceIcon />}
                                    color="primary"
                                    label={item.playerName}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.category}
                                secondary={item.text}
                                classes={{ primary: styles.primary, secondary: styles.secondary }}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={onClose}>Schließen</Button>
            </DialogActions>
        </Dialog>
    );
};

interface HallOfFameButtonProps {
    hallOfFameData: HallOfFameEntry[];
}

/**
 * Displays a button that opens a dialog with all player inputs that received "creative answer" stars.
 */
const HallOfFameButton: React.FunctionComponent<HallOfFameButtonProps> = props => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={<StarIcon />}
                disabled={props.hallOfFameData.length === 0}
                onClick={() => setOpen(true)}
            >
                <span lang="en">Hall of Fame</span>
                <span className="sr-only">(Liste der besonders kreativen Antworten)</span>
            </Button>
            <HallOfFameDialog
                hallOfFameData={props.hallOfFameData}
                open={open}
                onClose={handleClose}
            />
        </React.Fragment>
    );
};

export default HallOfFameButton;
