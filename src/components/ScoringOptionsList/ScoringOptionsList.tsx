import React from 'react';
import { GAME_OPTION_LABEL } from '../../constants/game.constant';
import { GameConfigScoringSystem } from '../../models/game.interface';

interface ScoringOptionsListProps {
    rules: GameConfigScoringSystem;
}

const ScoringOptionsList: React.FunctionComponent<ScoringOptionsListProps> = props => {
    const { rules } = props;
    const createFurtherOptionsElement = (): JSX.Element => (
        <React.Fragment>
            <p>Regeln für Punktevergabe:</p>
            <ul>
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
}

export default ScoringOptionsList;
