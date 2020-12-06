import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import React from 'react';

import { PlayerInfo } from '../../models/player.interface';
import { getPlayersInAlphabeticalOrder } from '../../utils/game.utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(0.5),
        },
        chip: {
            margin: theme.spacing(0.5),
        },
    }),
);

interface PlayerListProps {
    players: Map<string, PlayerInfo>;
}
const PlayerList: React.FunctionComponent<PlayerListProps> = props => {
    const classes = useStyles();
    const sortedPlayers = getPlayersInAlphabeticalOrder(props.players);
    return (
        <div className={classes.root} role="list">
            {sortedPlayers.map((playerInfo, index) => (
                <Chip
                    key={`player-name-${index}`}
                    role="listitem"
                    className={classes.chip}
                    icon={<FaceIcon />}
                    color={playerInfo.isAdmin ? 'secondary' : 'primary'}
                    label={playerInfo.isAdmin ? `${playerInfo.name} (Admin)` : playerInfo.name}
                />
            ))}
        </div>
    );
};

export default PlayerList;
