import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        countdown: {
            position: 'fixed',
            right: '1.5rem',
            bottom: '1rem',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: '0.5rem 1rem',
            fontSize: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, .401961)',
            borderRadius: '5px',
        },
    }),
);

interface RoundCountdownProps {
    /** Duration of countdown in seconds */
    duration: number;
    /** The method to be called when countdown reaches zero */
    onComplete: () => void;
}

const RoundCountdown: React.FunctionComponent<RoundCountdownProps> = props => {
    const classes = useStyles();
    return (
        <Countdown
            date={Date.now() + (props.duration * 1000)}
            renderer={props => (
                <div className={classes.countdown}>
                    {zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                </div>
            )}
            onComplete={props.onComplete}
        />
    );
};

export default React.memo(RoundCountdown);
