import {
    Checkbox,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    Input,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import {
    GAME_OPTION_LABEL,
    GameOptionCheckboxName,
    STANDARD_ALPHABET,
    UseCountdownRadioButton,
} from '../../constants/game.constant';
import styles from './NewGameOptionsPanel.module.css';

interface NewGameOptionsPanelProps {
    [GameOptionCheckboxName.checkForDuplicates]: boolean;
    [GameOptionCheckboxName.creativeAnswersExtraPoints]: boolean;
    durationOfCountdown: number;
    lettersToExclude: string[];
    [GameOptionCheckboxName.onlyPlayerWithValidAnswer]: boolean;
    useCountdown: boolean;
    handleGameOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleLetterToExcludeChange: (event: React.ChangeEvent<HTMLInputElement>, letter: string) => void;
    handleUseCountdownChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
                                checked={props.checkForDuplicates}
                                name={GameOptionCheckboxName.checkForDuplicates}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.checkForDuplicates}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.onlyPlayerWithValidAnswer}
                                name={GameOptionCheckboxName.onlyPlayerWithValidAnswer}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.onlyPlayerWithValidAnswer}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={props.creativeAnswersExtraPoints}
                                name={GameOptionCheckboxName.creativeAnswersExtraPoints}
                                color="primary"
                                onChange={props.handleGameOptionChange}
                            />
                        }
                        label={GAME_OPTION_LABEL.creativeAnswersExtraPoints}
                    />
                </FormGroup>
                <Divider />
                <FormControl component="fieldset">
                    <FormLabel
                        component="legend"
                        className={styles.options_label}
                    >Beenden der Runde durch:</FormLabel>
                    <RadioGroup
                        className={styles.radio_group}
                        aria-label="Beenden der Runde"
                        name="usecountdown"
                        value={props.useCountdown ? UseCountdownRadioButton.countdown : UseCountdownRadioButton.player}
                        onChange={props.handleUseCountdownChange}
                    >
                        <FormControlLabel
                            value={UseCountdownRadioButton.player}
                            control={<Radio color="primary" />}
                            label="Spieler"
                        />
                        <FormControlLabel
                            value={UseCountdownRadioButton.countdown}
                            control={<Radio color="primary" />}
                            label="Countdown (in Sekunden)"
                        />
                        <Input
                            type="number"
                            value={props.durationOfCountdown}
                            className={styles.countdown_input}
                            disabled={!props.useCountdown}
                            inputProps={{ 'aria-label': 'Dauer des Countdowns' }}
                        />
                    </RadioGroup>
                </FormControl>
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
