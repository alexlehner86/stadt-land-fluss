import './JoinGame.css';
import { Button, TextField } from '@material-ui/core';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';

interface JoinGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface JoinGameProps extends JoinGameDispatchProps, RouteComponentProps { }
interface JoinGameState {
    idInput: string;
    nameInput: string;
    validateInputs: boolean;
}

class JoinGame extends Component<JoinGameProps, JoinGameState> {
    public state: JoinGameState = {
        idInput: '',
        nameInput: '',
        validateInputs: false
    };

    public render() {
        const joinGameForm = (
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
                    autoFocus
                    error={this.state.validateInputs && !this.state.nameInput}
                />
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
        );
        return (
            <div className="main-content-wrapper">
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Spiel beitreten"></SectionHeader>
                    {joinGameForm}
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
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
        event.preventDefault();
        if (this.state.idInput && this.state.nameInput.trim()) {
            this.props.onSetGameData({
                gameConfig: null,
                gameId: this.state.idInput,
                playerInfo: {
                    id: PUBNUB_CONFIG.uuid as string,
                    isAdmin: false,
                    name: this.state.nameInput.trim()
                }
            });
            this.props.history.push('/play');
        } else {
            this.setState({ nameInput: this.state.nameInput.trim(), validateInputs: true });
        }
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): JoinGameDispatchProps => {
    return {
        onSetGameData: (payload: SetDataForNewGamePayload) => {
            dispatch(setDataForNewGame(payload))
        }
    }
};
export default connect(null, mapDispatchToProps)(JoinGame);
