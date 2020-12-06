import { IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useState } from 'react';

import { copyToClipboard } from '../../utils/general.utils';
import styles from './JoinGameLink.module.css';

interface JoinGameLinkProps {
    gameId: string;
    onLinkCopiedToClipboard: () => void;
}

export const JoinGameLink: React.FunctionComponent<JoinGameLinkProps> = props => {
    const handleClick = () => {
        copyToClipboard(joinGameLink);
        props.onLinkCopiedToClipboard();
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
                readOnly
                fullWidth
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            title="Link zum Spiel kopieren"
                            aria-label="Link zum Spiel kopieren"
                            onClick={handleClick}
                        >
                            <FileCopyIcon />
                        </IconButton>
                    </InputAdornment>
                }
                inputProps={{ tabIndex: -1 }}
            />
        </React.Fragment>
    );
};
