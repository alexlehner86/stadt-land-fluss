import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';
import styles from './ToDashboardButton.module.css';

interface ToDashboardButtonProps {
    onReturnToDashboard: () => any;
}

const ToDashboardButton: React.FunctionComponent<ToDashboardButtonProps> = props => {
    return (
        <div className={styles.button_wrapper}>
            <Button
                type="button"
                color="default"
                variant="contained"
                size="large"
                startIcon={<ExitToAppIcon />}
                onClick={props.onReturnToDashboard}
            >Dashboard</Button>
        </div>
    );
}

export default ToDashboardButton;
