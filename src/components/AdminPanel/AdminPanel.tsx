import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useRef, useState } from 'react';

import { GamePhase } from '../../constants/game.constant';
import { GameRound } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { getPlayersInAlphabeticalOrder } from '../../utils/game.utils';
import KickUserDialog from '../KickUserDialog/KickUserDialog';
import MarkEqualAnswersDialog from '../MarkEqualAnswersDialog/MarkEqualAnswersDialog';
import styles from './AdminPanel.module.css';

interface AdminPanelProps {
    allPlayers: Map<string, PlayerInfo>;
    categories: string[];
    gameRound: GameRound;
    isForMobileView: boolean;
    isMarkEqualAnswersItemDisabled: boolean;
    kickPlayer: (playerId: string) => void;
    submitEqualAnswers: (categoryIndex: number, equalAnswers: string[]) => void;
}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = props => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isMarkEqualAnswersDialogOpen, setIsMarkEqualAnswersDialogOpen] = useState(false);
    const [isKickUserDialogOpen, setIsKickUserDialogOpen] = useState(false);
    const [playerToBeKicked, setPlayerToBeKicked] = useState<PlayerInfo | null>(null);
    const firstMenuItem = useRef<any>(null);

    const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleAdminPanelClose = () => setAnchorEl(null);
    const handleAdminPanelEntered = () => firstMenuItem.current?.focus();

    const handleMarkEqualAnswersClick = () => {
        setAnchorEl(null);
        setIsMarkEqualAnswersDialogOpen(true);
    };
    const handleMarkEqualAnswersDialogClose = () => setIsMarkEqualAnswersDialogOpen(false);

    const handleKickUserMenuItemClick = (selectedPlayer: PlayerInfo) => {
        setAnchorEl(null);
        setPlayerToBeKicked(selectedPlayer);
        setIsKickUserDialogOpen(true);
    };
    const handleKickUserDialogClose = (kickPlayer: boolean) => {
        setIsKickUserDialogOpen(false);
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
        <div className={props.isForMobileView ? styles.adminPanelMobile : styles.adminPanel}>
            <IconButton
                className={styles.menuButton}
                title="Administrator-Optionen"
                aria-label="Administrator-Optionen"
                aria-controls="admin-panel"
                aria-haspopup="true"
                onClick={handleMenuButtonClick}
            >
                <SettingsIcon className={styles.menuIcon} />
            </IconButton>
            <Menu
                id="admin-panel"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleAdminPanelClose}
                onEntered={handleAdminPanelEntered}
            >
                <MenuItem
                    ref={firstMenuItem}
                    classes={{ root: styles.equalAnswersMenuItem }}
                    dense
                    disabled={props.isMarkEqualAnswersItemDisabled}
                    onClick={handleMarkEqualAnswersClick}
                >
                    Gleiche Antworten markieren
                </MenuItem>
                {sortedPlayers.map((playerInfo, playerIndex) => (
                    <MenuItem
                        key={`menu-item-delete-player-${playerIndex}`}
                        dense
                        onClick={() => handleKickUserMenuItemClick(playerInfo)}
                    >
                        <ListItemIcon>
                            <CancelIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary={`${playerInfo.name} rauswerfen`} />
                    </MenuItem>
                ))}
            </Menu>
            <MarkEqualAnswersDialog
                categories={props.categories}
                gameRoundToEvaluate={props.gameRound}
                open={isMarkEqualAnswersDialogOpen}
                onClose={handleMarkEqualAnswersDialogClose}
                onSubmitEqualAnswers={props.submitEqualAnswers}
            />
            <KickUserDialog
                open={isKickUserDialogOpen}
                playerToBeKicked={playerToBeKicked}
                onClose={handleKickUserDialogClose}
            />
        </div >
    );
};

export default AdminPanel;
