import './JoinGame.css';
import { Button, TextField } from '@material-ui/core';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import React, { ChangeEvent, Component, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';

interface JoinGameState {
    idInput: string;
    nameInput: string;
    validateInputs: boolean;
}

export class JoinGame extends Component<RouteComponentProps, JoinGameState> {
    public state: JoinGameState = {
        idInput: '',
        nameInput: '',
        validateInputs: false
    };

    public render() {
        return (
            <div className="material-card-style">
                <SectionHeader text="Spiel beitreten"></SectionHeader>
                <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                    <TextField
                        name="idInput"
                        label="Spiel-ID"
                        value={this.state.idInput}
                        onChange={this.handleInputChange}
                        className="app-form-input"
                        variant="outlined"
                        fullWidth
                        required
                        error={this.state.validateInputs && !this.state.idInput}
                    />
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
                    <div className="button-wrapper">
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            size="large"
                            startIcon={<DirectionsWalkIcon />}
                        >Beitreten</Button>
                    </div>
                </form>
            </div>
        );
    }

    public componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.has('id')) {
            this.setState({ idInput: query.get('id') as string });
        }
    }

    private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as any);
    }

    private handleSubmit = (event: FormEvent) => {
        this.setState({ validateInputs: true });
        console.log('submitted: ', this.state);
        event.preventDefault();
    }
}
