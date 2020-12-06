import React from 'react';

import { GAME_OPTION_LABEL } from '../../constants/game.constant';
import { GameConfigScoringOptions } from '../../models/game.interface';
import styles from './ScoringOptionsList.module.css';

interface ScoringOptionsListProps {
    isForGameResultsPage: boolean;
    rules: GameConfigScoringOptions;
}

const ScoringOptionsList: React.FunctionComponent<ScoringOptionsListProps> = props => {
    const { rules } = props;
    const createFurtherOptionsElement = (): JSX.Element => (
        <React.Fragment>
            {props.isForGameResultsPage ? <h3 className={styles.heading}>Regeln für die Punktevergabe</h3> : null}
            {!props.isForGameResultsPage ? <h4 className={styles.heading}>Regeln für die Punktevergabe</h4> : null}
            <ul className={styles.list}>
                {rules.checkForDuplicates ? <li>{GAME_OPTION_LABEL.checkForDuplicates}</li> : null}
                {rules.onlyPlayerWithValidAnswer ? <li>{GAME_OPTION_LABEL.onlyPlayerWithValidAnswer}</li> : null}
                {rules.creativeAnswersExtraPoints ? <li>{GAME_OPTION_LABEL.creativeAnswersExtraPoints}</li> : null}
            </ul>
        </React.Fragment>
    );
    if (rules.checkForDuplicates || rules.onlyPlayerWithValidAnswer || rules.creativeAnswersExtraPoints) {
        return createFurtherOptionsElement();
    }
    return null;
};

export default ScoringOptionsList;
