import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';

interface NewVersionSnackbarProps {
    updateServiceWorker: () => void;
}

const NewVersionSnackbar: React.FunctionComponent<NewVersionSnackbarProps> = props => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const refreshAction = () => (
        <Button
            className="snackbar-button"
            size="small"
            onClick={props.updateServiceWorker}
        >
            Aktualisieren
        </Button>
    );
    enqueueSnackbar('Eine neue Version ist verfügbar', {
        persist: true,
        variant: 'success',
        action: refreshAction
    });
    return null;
};

export default NewVersionSnackbar;
