import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    IconButton,
    makeStyles,
    TextField,
} from '@material-ui/core';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import React, { ChangeEvent, FormEvent, useState } from 'react';

import { MIN_NUMBER_OF_CATEGORIES } from '../../constants/game.constant';
import styles from './SelectRandomCategories.module.css';

const useStyles = makeStyles(_ => ({
    label: {
        fontSize: '0.85rem',
    }
}));

export interface SelectRandomCategoriesDialogProps {
    maxNumberOfCategories: number;
    open: boolean;
    onClose: (numberOfCategories: number | null, retainSelection?: boolean) => void;
}
const SelectRandomCategoriesDialog: React.FunctionComponent<SelectRandomCategoriesDialogProps> = props => {
    const checkboxLabelClasses = useStyles();
    const { onClose, open } = props;
    const [isNumberOfCategoriesInputValid, setIsNumberOfCategoriesInputValid] = useState(true);
    const [numberOfCategoriesInput, setNumberOfCategoriesInput] = useState(MIN_NUMBER_OF_CATEGORIES);
    const [validateInputs, setValidateInputs] = useState(false);
    const [retainSelection, setRetainSelection] = useState(false);
    const numberOfRoundsInputLabel = `Anzahl Kategorien (${MIN_NUMBER_OF_CATEGORIES}-${props.maxNumberOfCategories})`;

    const handleNumberOfCategoriesInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value;
        setNumberOfCategoriesInput(value);
        setIsNumberOfCategoriesInputValid(value >= MIN_NUMBER_OF_CATEGORIES && value <= props.maxNumberOfCategories);
    };

    const handleRetainSelectionOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRetainSelection(event.target.checked);
    };

    const handleClose = () => {
        onClose(null);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (isNumberOfCategoriesInputValid) {
            setValidateInputs(false);
            onClose(numberOfCategoriesInput, retainSelection);
        } else {
            setValidateInputs(true);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <form onSubmit={handleSubmit} className={styles.dialog_min_width} noValidate autoComplete="off">
                <DialogContent>
                    <DialogContentText className={styles.dialog_title}>
                        Kategorien zufällig auswählen
                    </DialogContentText>
                    <TextField
                        name="numberOfRoundsInput"
                        label={numberOfRoundsInputLabel}
                        type="number"
                        value={numberOfCategoriesInput}
                        variant="outlined"
                        fullWidth
                        required
                        error={validateInputs && !isNumberOfCategoriesInputValid}
                        inputProps={{ 'min': MIN_NUMBER_OF_CATEGORIES, 'max': props.maxNumberOfCategories }}
                        onChange={handleNumberOfCategoriesInputChange}
                    />
                    <FormControlLabel
                        classes={checkboxLabelClasses}
                        control={
                            <Checkbox
                                checked={retainSelection}
                                name="retainSelection"
                                color="primary"
                                onChange={handleRetainSelectionOptionChange}
                            />
                        }
                        label="Inklusive bereits ausgewählter Kategorien"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        onClick={handleClose}
                    >Abbrechen</Button>
                    <Button
                        type="submit"
                        color="primary"
                    >Auswählen</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

interface SelectRandomCategoriesProps {
    maxNumberOfCategories: number;
    selectCategoriesRandomly: (numberOfCategories: number, retainSelection: boolean) => void;
}
const SelectRandomCategories: React.FunctionComponent<SelectRandomCategoriesProps> = props => {
    const [open, setOpen] = useState(false);

    const handleClose = (numberOfCategories: number | null, retainSelection?: boolean) => {
        setOpen(false);
        if (numberOfCategories && retainSelection !== undefined) {
            props.selectCategoriesRandomly(numberOfCategories, retainSelection);
        }
    };

    return (
        <React.Fragment>
            <IconButton
                className={styles.random_categories_button}
                size="small"
                title="Kategorien zufällig auswählen"
                aria-label="Kategorien zufällig auswählen"
                onClick={() => setOpen(true)}
            >
                <FlipCameraAndroidIcon fontSize="small" />
            </IconButton>
            <SelectRandomCategoriesDialog
                maxNumberOfCategories={props.maxNumberOfCategories}
                open={open}
                onClose={handleClose}
            />
        </React.Fragment>
    );
};

export default SelectRandomCategories;
