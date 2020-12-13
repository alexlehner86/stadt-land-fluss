import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import React, { useRef } from 'react';

import { PlayerInfo } from '../../models/player.interface';
import styles from './KickUserDialog.module.css';

export interface KickUserDialogProps {
    open: boolean;
    playerToBeKicked: PlayerInfo | null;
    onClose: (kickPlayer: boolean) => void;
}
const KickUserDialog: React.FunctionComponent<KickUserDialogProps> = props => {
    const { onClose, open } = props;
    const submitButton = useRef<HTMLButtonElement>(null);
    const onDialogEntered = () => submitButton.current?.focus();

    return (
        <Dialog onEntered={onDialogEntered} onClose={() => onClose(false)} open={open}>
            <DialogContent classes={{ root: styles.dialogContent }}>
                <DialogContentText classes={{ root: styles.dialogContentText }}>
                    <span lang="en">&quot;With great power comes great responsibility&quot;</span>
                    – Willst du {props.playerToBeKicked?.name} wirklich aus dem Spiel werfen?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={() => onClose(false)}
                >Abbrechen</Button>
                <Button
                    type="button"
                    color="primary"
                    ref={submitButton}
                    onClick={() => onClose(true)}
                >Rauswerfen</Button>
            </DialogActions>
        </Dialog>
    );
};

export default KickUserDialog;
