import { IconButton, InputAdornment, OutlinedInput, Snackbar } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useState } from 'react';
import { copyToClipboard } from '../../utils/general.utils';
import styles from './JoinGameLink.module.css';

interface JoinGameLinkProps {
    gameId: string;
}

export const JoinGameLink: React.FunctionComponent<JoinGameLinkProps> = props => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        copyToClipboard(joinGameLink)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const url = window.location.href;
    // Cut off "/play" from the end of the url and add route plus game id.
    const joinGameLink = url.slice(0, url.length - 5) + '/joingame?id=' + props.gameId;

    return (
        <React.Fragment>
            <p className={styles.link_label}>Teile diesen Link mit Freunden:</p>
            <OutlinedInput
                name="idInput"
                value={joinGameLink}
                className="app-form-input"
                disabled
                fullWidth
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            title="Link kopieren"
                            aria-label="Link kopieren"
                            onClick={handleClick}
                        >
                            <FileCopyIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                autoHideDuration={1500}
                onClose={handleClose}
                message="Der Link wurde in Zwischenablage kopiert."
            />
        </React.Fragment>
    );
}
