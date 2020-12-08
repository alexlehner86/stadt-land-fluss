import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';
import { PlayerInfo } from '../../models/player.interface';
import { getPlayersInAlphabeticalOrder } from '../../utils/game.utils';
import styles from './AdminPanel.module.css';

export interface KickUserDialogProps {
    open: boolean;
    playerToBeKicked: PlayerInfo | null;
    onClose: (kickPlayer: boolean) => void;
}
const KickUserDialog: React.FunctionComponent<KickUserDialogProps> = props => {
    const { onClose, open } = props;

    return (
        <Dialog onClose={() => onClose(false)} open={open}>
            <DialogContent classes={{ root: styles.dialogContent }}>
                {props.playerToBeKicked ? (
                    <DialogContentText classes={{ root: styles.dialogContentText }}>
                        &quot;With great power comes great responsibility&quot; – Willst du {props.playerToBeKicked.name} wirklich aus dem Spiel werfen?
                    </DialogContentText>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={() => onClose(false)}
                >Abbrechen</Button>
                <Button
                    type="button"
                    color="primary"
                    onClick={() => onClose(true)}
                >Rauswerfen</Button>
            </DialogActions>
        </Dialog>
    );
};

interface AdminPanelProps {
    allPlayers: Map<string, PlayerInfo>;
    kickPlayer: (playerId: string) => void;
}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = props => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [playerToBeKicked, setPlayerToBeKicked] = useState<PlayerInfo | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (selectedPlayer: PlayerInfo) => {
        setAnchorEl(null);
        setPlayerToBeKicked(selectedPlayer);
        setOpenDialog(true);
    };
    const handleAdminPanelClose = () => {
        setAnchorEl(null);
    };
    const handleKickUserDialogClose = (kickPlayer: boolean) => {
        setOpenDialog(false);
        if (kickPlayer && playerToBeKicked) {
            props.kickPlayer(playerToBeKicked.id);
        }
    };

    const otherPlayers = new Map<string, PlayerInfo>();
    props.allPlayers.forEach((playerInfo, playerId) => {
        if (!playerInfo.isAdmin) { otherPlayers.set(playerId, playerInfo); }
    });
    const sortedPlayers = getPlayersInAlphabeticalOrder(otherPlayers);
    return (
        <div className={styles.adminPanel}>
            <IconButton
                className={styles.menuButton}
                title="Mitspieler verwalten"
                aria-label="Mitspieler verwalten"
                aria-controls="admin-panel"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <SettingsIcon className={styles.menuIcon} />
            </IconButton>
            <Menu
                id="admin-panel"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleAdminPanelClose}
            >
                {sortedPlayers.map((playerInfo, playerIndex) => (
                    <MenuItem
                        key={`menu-item-delete-player-${playerIndex}`}
                        onClick={() => handleMenuItemClick(playerInfo)}
                    >
                        <ListItemIcon>
                            <CancelIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary={`${playerInfo.name} rauswerfen`} />
                    </MenuItem>
                ))}
            </Menu>
            <KickUserDialog
                open={openDialog}
                playerToBeKicked={playerToBeKicked}
                onClose={handleKickUserDialogClose}
            />
        </div>
    );
};

export default AdminPanel;
