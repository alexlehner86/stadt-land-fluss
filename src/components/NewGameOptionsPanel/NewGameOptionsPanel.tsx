import {
    Checkbox,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { ChangeEvent } from 'react';

import { GAME_OPTION_LABEL, STANDARD_ALPHABET } from '../../constants/game.constant';
import { GameConfigScoringOptions, GameOption } from '../../models/game.interface';
import styles from './NewGameOptionsPanel.module.css';

interface NewGameOptionsPanelProps {
    lettersToExclude: string[];
    scoringOptions: GameConfigScoringOptions;
    handleGameOptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleLetterToExcludeChange: (event: ChangeEvent<HTMLInputElement>, letter: string) => void;
}

const NewGameOptionsPanel: React.FunctionComponent<NewGameOptionsPanelProps> = props => {
    return (
        <ExpansionPanel className="new-game-expansion-panel">
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                Weitere Optionen
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <FormGroup className="game-options-list">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.scoringOptions.checkForDuplicates}
                                name={GameOption.checkForDuplicates}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.checkForDuplicates}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.scoringOptions.onlyPlayerWithValidAnswer}
                                name={GameOption.onlyPlayerWithValidAnswer}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.onlyPlayerWithValidAnswer}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.scoringOptions.creativeAnswersExtraPoints}
                                name={GameOption.creativeAnswersExtraPoints}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.creativeAnswersExtraPoints}
                    />
                </FormGroup>
                <Divider />
                <p className={styles.options_label}>Folgende Buchstaben ausschließen:</p>
                <FormGroup row className="letters-to-exclude">
                    {STANDARD_ALPHABET.map((letter, letterIndex) => (
                        <FormControlLabel
                            key={`slf-letters-to-exclude-${letterIndex}`}
                            control={
                                <Checkbox
                                    checked={props.lettersToExclude.includes(letter)}
                                    color="primary"
                                    onChange={(event) => props.handleLetterToExcludeChange(event, letter)}
                                />
                            }
                            label={letter}
                        />
                    ))}
                </FormGroup>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default NewGameOptionsPanel;
