import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { FormEvent, useState } from 'react';

import styles from './AddCustomCategory.module.css';

export interface CustomCategoryDialogProps {
    open: boolean;
    onClose: (newCategory: string | null) => void;
}
const CustomCategoryDialog: React.FunctionComponent<CustomCategoryDialogProps> = props => {
    const { onClose, open } = props;
    const [categoryInput, setCategoryInput] = useState('');
    const [validateInputs, setValidateInputs] = useState(false);

    const handleClose = () => {
        onClose(null);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const trimmedCategoryInput = categoryInput.trim();
        if (trimmedCategoryInput !== '') {
            setCategoryInput('');
            setValidateInputs(false);
            onClose(trimmedCategoryInput);
        } else {
            setCategoryInput('');
            setValidateInputs(true);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <form onSubmit={handleSubmit} className={styles.dialog_min_width} noValidate autoComplete="off">
                <DialogContent>
                    <DialogContentText>Kategorie hinzufügen</DialogContentText>
                    <TextField
                        id="new-category-input"
                        autoFocus
                        margin="dense"
                        fullWidth
                        required
                        value={categoryInput}
                        error={validateInputs && !categoryInput}
                        onChange={event => setCategoryInput(event.target.value)}
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
                    >Hinzufügen</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

interface AddCustomCategoryProps {
    addCustomCategory: (newCategory: string) => void;
}
const AddCustomCategory: React.FunctionComponent<AddCustomCategoryProps> = props => {
    const [open, setOpen] = useState(false);

    const handleClose = (newCategory: string | null) => {
        setOpen(false);
        if (newCategory) {
            props.addCustomCategory(newCategory);
        }
    }

    return (
        <React.Fragment>
            <IconButton
                className={styles.less_padding}
                title="Kategorie hinzufügen"
                aria-label="Kategorie hinzufügen"
                onClick={() => setOpen(true)}
            >
                <AddCircleOutlineIcon />
            </IconButton>
            <CustomCategoryDialog open={open} onClose={handleClose} />
        </React.Fragment>
    );
}

export default AddCustomCategory;
