import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { cloneDeep } from 'lodash';
import React, { useRef, useState } from 'react';

import { SAME_WORD_POINTS } from '../../constants/game.constant';
import { GameRound, PlayerInput } from '../../models/game.interface';
import { getCleanText } from '../../utils/general.utils';
import styles from './MarkEqualAnswersDialog.module.css';

export interface MarkEqualAnswersDialogProps {
    categories: string[];
    gameRoundToEvaluate: GameRound;
    open: boolean;
    onClose: () => void;
}
const MarkEqualAnswersDialog: React.FunctionComponent<MarkEqualAnswersDialogProps> = props => {
    const { gameRoundToEvaluate, open, onClose } = props;
    const [equalAnswers, setEqualAnswers] = useState(new Map<number, string[]>());
    const helpText = useRef<any>(null);
    const onDialogEntered = () => helpText.current?.focus();

    const handleCheckboxChange = (categoryIndex: number, answer: string) => {
        const cleanedAnswer = getCleanText(answer);
        let equalAnswersOfCategory = equalAnswers.get(categoryIndex) || [];
        if (equalAnswersOfCategory.includes(cleanedAnswer)) {
            equalAnswersOfCategory = equalAnswersOfCategory.filter(item => item !== cleanedAnswer);
        } else {
            equalAnswersOfCategory = [...equalAnswersOfCategory, cleanedAnswer];
        }
        const newEqualAnswers = cloneDeep(equalAnswers);
        newEqualAnswers.set(categoryIndex, equalAnswersOfCategory);
        setEqualAnswers(newEqualAnswers);
    };

    const createAccordionWithEvaluationForm = (category: string, categoryIndex: number): JSX.Element => {
        const playerIds = Array.from(gameRoundToEvaluate.keys());
        const answers = playerIds
            .map(id => (gameRoundToEvaluate.get(id) as PlayerInput[])[categoryIndex].text)
            .filter(text => text !== '');
        const equalAnswersOfCategory = equalAnswers.get(categoryIndex) || [];
        const createFormLabel = (answer: string, answerIndex: number): JSX.Element => (
            <FormControlLabel
                key={`category${categoryIndex}-${answerIndex}-key`}
                control={
                    <Checkbox
                        checked={equalAnswersOfCategory.includes(getCleanText(answer))}
                        name={`category${categoryIndex}a${answerIndex}`}
                        color="primary"
                        onChange={() => handleCheckboxChange(categoryIndex, answer)}
                    />
                }
                label={answer}
            />
        );
        return (
            <Accordion
                key={`mark-equal-answers-accordion-${categoryIndex}`}
                classes={{ root: styles.category_accordion }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${categoryIndex}a-content`}
                    id={`panel${categoryIndex}a-header`}
                >
                    {category}
                </AccordionSummary>
                <AccordionDetails>
                    <form>
                        <FormGroup>
                            {answers.map(createFormLabel)}
                        </FormGroup>
                    </form>
                </AccordionDetails>
            </Accordion>
        );
    };

    return (
        <Dialog onEntered={onDialogEntered} onClose={onClose} open={open}>
            <DialogContent classes={{ root: styles.dialogContent }}>
                <DialogContentText
                    classes={{ root: styles.dialogContentText }}
                    tabIndex={-1}
                    ref={helpText}
                >
                    Markiere innerhalb einer Kategorie jene Antworten, welche dieselbe Bedeutung wie mindestens
                    eine weitere Antwort hat. Die markierten Antworten erhalten nur {SAME_WORD_POINTS} Punkte.
                </DialogContentText>
                {props.categories.map(createAccordionWithEvaluationForm)}
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={onClose}
                >Schließen</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MarkEqualAnswersDialog;
