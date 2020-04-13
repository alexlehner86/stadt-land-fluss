import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const loadingSpinnerSize = 60;

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
        centralContent: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        },
        text: {
            marginBlockStart: '0',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold'
        },
        loadingSpinner: {
            margin: '0 auto',
            width: loadingSpinnerSize + 'px'
        }
    }),
);

interface LoadingScreenProps {
    message: string | null;
}

const LoadingScreen = (props: LoadingScreenProps) => {
    const classes = useStyles();
    const messageElement = props.message ? (<p className={classes.text}>{props.message}</p>) : null;
    return (
        <div className={classes.loadingScreen}>
            <div className={classes.centralContent}>
                {messageElement}
                <div className={classes.loadingSpinner}>
                    <CircularProgress color="secondary" size={loadingSpinnerSize} />
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;
