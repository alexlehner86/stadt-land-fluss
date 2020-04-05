import './NewGame.css';
import { Button, TextField } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import React, { ChangeEvent, Component, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';

interface NewGameState {
    nameInput: string;
    validateInputs: boolean;
}

export class NewGame extends Component<RouteComponentProps, NewGameState> {
    public state: NewGameState = {
        nameInput: '',
        validateInputs: false
    };

    public render() {
        return (
            <div className="material-card-style">
                <SectionHeader text="Neues Spiel starten"></SectionHeader>
                <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                    <TextField
                        name="nameInput"
                        label="Spielername"
                        value={this.state.nameInput}
                        onChange={this.handleInputChange}
                        className="app-form-input"
                        variant="outlined"
                        fullWidth
                        required
                        error={this.state.validateInputs && !this.state.nameInput}
                    />
                    <br />
                    Kategorien auswählen: (TODO)
                    <br />_
                    <div className="button-wrapper">
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            startIcon={<PlayCircleFilled />}
                        >Starten</Button>
                    </div>
                </form>
            </div>
        );
    }

    private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as any);
    }

    private handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        this.setState({ validateInputs: true });
        if (this.state.nameInput) {
            const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
            // TODO: set data in store
            this.props.history.push('/play')
        }
    }
}
