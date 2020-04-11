import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(_ =>
    createStyles({
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
            transform: 'translate(-50%, -50%)'
        }
    }),
);

const LoadingScreen = () => {
    const classes = useStyles();
    return (
        <div className={classes.loadingScreen}>
            <div className={classes.loadingSpinner}>
                <CircularProgress />
            </div>
        </div>
    );
}

export default LoadingScreen;
