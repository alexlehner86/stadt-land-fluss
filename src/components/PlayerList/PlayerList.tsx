import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import React from 'react';
import { PlayerInfo } from '../../models/player.interface';

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
    const playerNames: string[] = [];
    props.players.forEach(player => playerNames.push(player.name));
    return (
        <div className={classes.root}>
            {playerNames.map((name, index) => (
                <Chip
                    key={`player-name-${index}`}
                    icon={<FaceIcon />}
                    color="primary"
                    label={name}
                    className={classes.chip}
                />
            ))}
        </div>
    );
}

export default PlayerList;
