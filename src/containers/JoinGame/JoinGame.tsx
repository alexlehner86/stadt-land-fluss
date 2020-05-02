import './JoinGame.css';
import { Button, TextField } from '@material-ui/core';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { setPlayerInfoInLocalStorage } from '../../utils/local-storage.utils';
import { AppState } from '../../store/app.reducer';
import { PlayerInfo } from '../../models/player.interface';

interface JoinGamePropsFromStore {
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}
interface JoinGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface JoinGameProps extends JoinGamePropsFromStore, JoinGameDispatchProps, RouteComponentProps { }
interface JoinGameState {
    idInput: string;
    nameInput: string;
    validateInputs: boolean;
}

class JoinGame extends Component<JoinGameProps, JoinGameState> {
    public state: JoinGameState = {
        idInput: '',
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
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

    public componentDidUpdate(prevProps: JoinGameProps) {
        if (this.props.playerInfo && this.props.playerInfo !== prevProps.playerInfo) {
            this.setState({ nameInput: this.props.playerInfo.name });
        }
    }

    private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as any);
    }

    private handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (this.state.idInput && this.state.nameInput.trim()) {
            this.joinGame();
        } else {
            this.setState({ nameInput: this.state.nameInput.trim(), validateInputs: true });
        }
    }

    private joinGame = () => {
        const playerInfo = this.props.playerInfo as PlayerInfo;
        const idCreationTimestamp = this.props.playerIdCreationTimestamp
        const { idInput, nameInput } = this.state;
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        this.props.onSetGameData({
            gameConfig: null,
            gameId: idInput,
            playerInfo: {
                id: playerInfo.id,
                isAdmin: false,
                name: nameInput.trim()
            }
        });
        this.props.history.push('/play');
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
    }
}

const mapStateToProps = (state: AppState): JoinGamePropsFromStore => {
    return {
        playerIdCreationTimestamp: state.playerIdCreationTimestamp,
        playerInfo: state.playerInfo
    };
}
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): JoinGameDispatchProps => {
    return {
        onSetGameData: (payload: SetDataForNewGamePayload) => {
            dispatch(setDataForNewGame(payload))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
