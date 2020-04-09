import { IconButton, InputAdornment, OutlinedInput } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React from 'react';
import { copyToClipboard } from '../../utils/general.utils';

interface JoinGameLinkProps {
    gameId: string;
}

export const JoinGameLink = (props: JoinGameLinkProps) => {
    const joinGameLink = window.location.origin + '/joingame?id=' + props.gameId;
    return (
        <React.Fragment>
            <p>Teile diesen Link mit Freunden:</p>
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