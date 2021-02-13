import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const loadingSpinnerSize = 60;

const useStyles = makeStyles({
    loadingScreen: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    loadingSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: loadingSpinnerSize + 'px'
    },
    waitingForPlayers: {
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '36rem',
        margin: '0 !important'
    }
});

interface LoadingScreenProps {
    waitingForPlayers?: string[];
}

const LoadingScreen: React.FunctionComponent<LoadingScreenProps> = props => {
    const classes = useStyles();
    return (
        <div className={classes.loadingScreen}>
            <div className={classes.loadingSpinner}>
                <CircularProgress color="secondary" size={loadingSpinnerSize} />
            </div>
            {props.waitingForPlayers ? (
                <div className={'material-card-style ' + classes.waitingForPlayers} role="alert">
                    Warte auf: <span className="bold-text">{props.waitingForPlayers.join(', ')}</span>
                </div>
            ) : null}
        </div>
    );
};

export default LoadingScreen;
