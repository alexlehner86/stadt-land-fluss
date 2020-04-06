import './NewGame.css';
import { Button, TextField } from '@material-ui/core';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { AppAction, setGameData, SetGameDataPayload } from '../../store/app.actions';

interface NewGameDispatchProps {
    onSetGameData: (payload: SetGameDataPayload) => void
}
interface NewGameProps extends NewGameDispatchProps, RouteComponentProps {}
interface NewGameState {
    nameInput: string;
    validateInputs: boolean;
}

class NewGame extends Component<NewGameProps, NewGameState> {
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
            this.props.onSetGameData({
                gameId,
                isAdmin: true,
                playerName: this.state.nameInput
            });
            this.props.history.push('/play')
        }
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): NewGameDispatchProps => {
    return {
        onSetGameData: (payload: SetGameDataPayload) => {
            dispatch(setGameData(payload))
        }
    }
};
export default connect(null, mapDispatchToProps)(NewGame);
