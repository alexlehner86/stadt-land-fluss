import './ToDashboardButton.css';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from 'react';

interface ToDashboardButtonProps {
    onReturnToDashboard: () => any;
}

const ToDashboardButton = (props: ToDashboardButtonProps) => {
    return (
        <div className="button-wrapper to-dashboard-button">
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
