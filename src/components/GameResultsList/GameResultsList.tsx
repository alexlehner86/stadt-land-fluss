import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FaceIcon from '@material-ui/icons/Face';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import React from 'react';
import { GameResultForPlayer } from '../../models/game.interface';
import { makePluralIfCountIsNotOne } from '../../utils/general.utils';

const useStyles = makeStyles({
    listItem: {
        flex: '0 0 auto',
        justifyContent: 'center',
        margin: 0,
    },
    listItemText: {
        flex: '0 0 auto',
        minWidth: '6rem',
    },
});

interface GameResultsListProps {
    gameResults: GameResultForPlayer[];
}
const GameResultsList: React.FunctionComponent<GameResultsListProps> = props => {
    const classes = useStyles();
    const mostPoints = Math.max(...props.gameResults.map(result => result.points));
    const getResultIcon = (isWinner: boolean): JSX.Element => {
        return isWinner ? <InsertEmoticonIcon color="primary" fontSize="large" /> : <FaceIcon fontSize="large" />;
    }
    return (
        <List>
            {props.gameResults.map((result, index) => (
                <ListItem key={'results-for-player-' + index} className={classes.listItem}>
                    <ListItemIcon>
                        {getResultIcon(result.points === mostPoints)}
                    </ListItemIcon>
                    <ListItemText
                        className={classes.listItemText}
                        primary={result.playerName}
                        secondary={`${result.points} ${makePluralIfCountIsNotOne(result.points, 'Punkt', 'Punkte')}`}
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default GameResultsList;
