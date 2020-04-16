import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React, { FormEvent, useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        lessPadding: {
            padding: '0.375rem 0.5rem'
        },
        dialog: {
            minWidth: '20rem'
        }
    }),
);

export interface CustomCategoryDialogProps {
    open: boolean;
    onClose: (newCategory: string | null) => void;
}
const CustomCategoryDialog: React.FunctionComponent<CustomCategoryDialogProps> = props => {
    const classes = useStyles();
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
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <form onSubmit={handleSubmit} className={classes.dialog} noValidate autoComplete="off">
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
    addCustomCategory: (newCategory: string) => any;
}
const AddCustomCategory: React.FunctionComponent<AddCustomCategoryProps> = props => {
    const classes = useStyles();
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
                className={classes.lessPadding}
                title="Neue Kategorie hinzufügen"
                aria-label="Neue Kategorie hinzufügen"
                onClick={() => setOpen(true)}
            >
                <AddCircleOutlineIcon />
            </IconButton>
            <CustomCategoryDialog open={open} onClose={newCategory => handleClose(newCategory)} />
        </React.Fragment>
    );
}

export default AddCustomCategory;
