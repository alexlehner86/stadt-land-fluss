import React from 'react';
import Countdown, { CountdownTimeDelta, zeroPad } from 'react-countdown';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import styles from './RoundCountdown.module.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        countdownTheme: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    }),
);

interface RoundCountdownProps {
    /** Duration of countdown in seconds */
    duration: number;
    /** The method to be called when countdown reaches zero */
    onComplete: () => void;
    /** The method to be called when countdown reaches 10  */
    onTenSecondsRemaining: () => void;
}

const RoundCountdown: React.FunctionComponent<RoundCountdownProps> = props => {
    const classes = useStyles();
    const onTick = (timeDelta: CountdownTimeDelta) => {
        if (timeDelta.minutes === 0 && timeDelta.seconds === 10) {
            props.onTenSecondsRemaining();
        }
    };
    return (
        <Countdown
            date={Date.now() + (props.duration * 1000)}
            renderer={props => (
                <div className={styles.countdown + ' ' + classes.countdownTheme}>
                    {zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                </div>
            )}
            onTick={onTick}
            onComplete={props.onComplete}
        />
    );
};

export default React.memo(RoundCountdown);
