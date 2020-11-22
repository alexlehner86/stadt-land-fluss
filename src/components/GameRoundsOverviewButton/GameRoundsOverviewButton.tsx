import { Button, Dialog, DialogActions, DialogContent, makeStyles, Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import EventNoteIcon from '@material-ui/icons/EventNote';
import React, { useState } from 'react';
import { GameConfig, GameRound } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import GameRoundsTable from '../GameRoundsTable/GameRoundsTable';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}
const TabPanel: React.FunctionComponent<TabPanelProps> = props => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
};

const a11yProps = (index: any) => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
});

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        padding: '0 !important',
        backgroundColor: theme.palette.background.paper,
    },
}));

export interface GameRoundsOverviewDialogProps {
    gameConfig: GameConfig;
    open: boolean;
    rounds: GameRound[];
    sortedPlayers: PlayerInfo[];
    onClose: () => void;
}
const GameRoundsOverviewDialog: React.FunctionComponent<GameRoundsOverviewDialogProps> = props => {
    const classes = useStyles();
    const { gameConfig, open, rounds, sortedPlayers, onClose } = props;
    const [tabValue, setTabValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<any>, newValue: number) => setTabValue(newValue);

    return (
        <Dialog onClose={onClose} open={open} maxWidth="lg">
            <DialogContent className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {rounds.map((_, index) => (
                            <Tab
                                key={`slf-game-rounds-overview-tab-${index}`}
                                label={`Runde ${index + 1}: ${gameConfig.letters[index]}`}
                                {...a11yProps(index)}
                            />
                        ))}
                    </Tabs>
                </AppBar>
                {rounds.map((round, index) => (
                    <TabPanel
                        key={`slf-game-rounds-overview-tab-panel-${index}`}
                        value={tabValue}
                        index={index}
                    >
                        <GameRoundsTable gameConfig={gameConfig} round={round} sortedPlayers={sortedPlayers} />
                    </TabPanel>
                ))}
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={onClose}>Schließen</Button>
            </DialogActions>
        </Dialog>
    );
};

interface GameRoundsOverviewButtonProps {
    gameConfig: GameConfig;
    rounds: GameRound[];
    sortedPlayers: PlayerInfo[];
}

/**
 * Displays a button that opens a dialog with all player inputs, scoring etc. of all rounds.
 * The displayed data is organized in tabs, one tab per round.
 */
const GameRoundsOverviewButton: React.FunctionComponent<GameRoundsOverviewButtonProps> = props => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={<EventNoteIcon />}
                onClick={() => setOpen(true)}
            >Alle Runden im Detail</Button>
            <GameRoundsOverviewDialog
                gameConfig={props.gameConfig}
                open={open}
                rounds={props.rounds}
                sortedPlayers={props.sortedPlayers}
                onClose={handleClose}
            />
        </React.Fragment>
    );
};

export default GameRoundsOverviewButton;
