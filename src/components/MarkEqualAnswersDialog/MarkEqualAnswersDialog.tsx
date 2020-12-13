import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import React, { useRef } from 'react';

import styles from './MarkEqualAnswersDialog.module.css';

export interface MarkEqualAnswersDialogProps {
    open: boolean;
    onClose: () => void;
}
const MarkEqualAnswersDialog: React.FunctionComponent<MarkEqualAnswersDialogProps> = props => {
    const { onClose, open } = props;
    // const submitButton = useRef<HTMLButtonElement>(null);
    // const onDialogEntered = () => submitButton.current?.focus();

    // auf Dialog Component: onEntered={onDialogEntered} 
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogContent classes={{ root: styles.dialogContent }}>
                <DialogContentText classes={{ root: styles.dialogContentText }}>
                    test test
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={onClose}
                >Schließen</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MarkEqualAnswersDialog;
