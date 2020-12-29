import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import React from 'react';

import { GameResultsGroup } from '../../models/game.interface';
import { joinWithAnd } from '../../utils/general.utils';
import styles from './GameResultsList.module.css';

interface GameResultsListProps {
    /** The game results groups sorted in descending order */
    gameResults: GameResultsGroup[];
}
const GameResultsList: React.FunctionComponent<GameResultsListProps> = props => {
    const getIconForPlace = (place: number): JSX.Element => {
        const baseUrl = process.env.PUBLIC_URL + '/assets';
        switch (place) {
            case 1:
                return <img src={`${baseUrl}/first_place_trophy.svg`} className={styles.first_place_trophy} alt="1. Platz" />;
            case 2:
                return <img src={`${baseUrl}/second_place_trophy.svg`} className={styles.second_place_trophy} alt="2. Platz" />;
            case 3:
                return <img src={`${baseUrl}/third_place_trophy.svg`} className={styles.third_place_trophy} alt="3. Platz" />;
            default:
                return <FaceIcon fontSize="large" />;
        }
    };
    return (
        <List component="ol">
            {props.gameResults.map((resultsGroup, index) => (
                <ListItem key={'results-for-player-' + index} className={styles.game_results_item}>
                    <ListItemIcon className={styles.icon}>
                        {getIconForPlace(index + 1)}
                    </ListItemIcon>
                    <ListItemText
                        className={index === 0 ? styles.first_place_text : styles.other_place_text}
                        primary={joinWithAnd(resultsGroup.playerNames, 'und')}
                        secondary={`${resultsGroup.points} Punkte`}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default GameResultsList;
