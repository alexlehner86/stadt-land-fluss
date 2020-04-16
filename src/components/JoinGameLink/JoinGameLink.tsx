import './JoinGameLink.css';
import { IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React from 'react';
import { copyToClipboard } from '../../utils/general.utils';

interface JoinGameLinkProps {
    gameId: string;
}

export const JoinGameLink: React.FunctionComponent<JoinGameLinkProps> = props => {
    const url = window.location.href;
    // Cut off "/play" from the end of the url and add route plus game id.
    const joinGameLink = url.slice(0, url.length - 5) + '/joingame?id=' + props.gameId;
    return (
        <React.Fragment>
            <p className="join-game-link-label">Teile diesen Link mit Freunden:</p>
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
                            onClick={() => copyToClipboard(joinGameLink)}
                        >
                            <FileCopyIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </React.Fragment>
    );
}