import { Button, Snackbar, SnackbarContent, TextField } from '@material-ui/core';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { LiveMessage } from 'react-aria-live';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import {
    RejoinRunningGameHint,
    RejoinRunningGameHintContext,
} from '../../components/RejoinRunningGameHint/RejoinRunningGameHint';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import { PLAYER_NAME_MAX_LENGTH } from '../../constants/app.constant';
import { GAME_ID_LABEL, PLAYER_NAME_LABEL } from '../../constants/text.constant';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { getInvalidGameIdError, getInvalidNameError } from '../../utils/error-text.util';
import { convertDateToUnixTimestamp } from '../../utils/general.utils';
import {
    removeAllDataOfRunningGameFromLocalStorage,
    setPlayerInfoInLocalStorage,
    setRunningGameInfoInLocalStorage,
} from '../../utils/local-storage.utils';
import styles from './JoinGame.module.css';

interface JoinGamePropsFromStore {
    gameId: string | null;
    joinGameErrorMessage: string | null;
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}
interface JoinGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface JoinGameProps extends JoinGamePropsFromStore, JoinGameDispatchProps, RouteComponentProps { }
interface JoinGameState {
    a11yMessageAssertive: string;
    idInput: string;
    isSnackbarOpen: boolean;
    nameInput: string;
    snackBarMessage: string;
    validateInputs: boolean;
}

class JoinGame extends Component<JoinGameProps, JoinGameState> {
    public state: JoinGameState = {
        a11yMessageAssertive: '',
        idInput: '',
        isSnackbarOpen: false,
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
        snackBarMessage: '',
        validateInputs: false
    };

    public render() {
        const playerNameAriaLabel = `${PLAYER_NAME_LABEL} (maximal ${PLAYER_NAME_MAX_LENGTH} Zeichen)`;
        const playerNameVisibleLabel = `${PLAYER_NAME_LABEL} (max. ${PLAYER_NAME_MAX_LENGTH} Zeichen)`;
        const isNameInvalid = this.state.validateInputs && !this.state.nameInput;
        const isIdInvalid = this.state.validateInputs && !this.state.idInput;
        const joinGameForm = (
            <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                <label htmlFor="player-name-input" className="sr-only">{playerNameAriaLabel}</label>
                <TextField
                    name="nameInput"
                    label={playerNameVisibleLabel}
                    value={this.state.nameInput}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    error={isNameInvalid}
                    helperText={isNameInvalid ? getInvalidNameError() : ''}
                    inputProps={{
                        id: 'player-name-input',
                        autoComplete: 'nickname',
                        maxLength: PLAYER_NAME_MAX_LENGTH
                    }}
                    onChange={this.handleInputChange}
                />
                <label htmlFor="game-id-input" className="sr-only">{GAME_ID_LABEL}</label>
                <TextField
                    name="idInput"
                    label={GAME_ID_LABEL}
                    value={this.state.idInput}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    error={isIdInvalid}
                    helperText={isIdInvalid ? getInvalidGameIdError() : ''}
                    inputProps={{ id: 'game-id-input' }}
                    onChange={this.handleInputChange}
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
                {this.props.gameId ? <RejoinRunningGameHint context={RejoinRunningGameHintContext.joingame} /> : null}
                <div className="material-card-style">
                    <SectionHeader text="Spiel beitreten"></SectionHeader>
                    {joinGameForm}
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.isSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackBarClose}
                >
                    <SnackbarContent
                        classes={{ root: styles.alert_snackbar }}
                        message={this.state.snackBarMessage}
                    ></SnackbarContent>
                </Snackbar>
                <LiveMessage
                    message={this.state.a11yMessageAssertive}
                    aria-live="assertive"
                    clearOnUnmount="true"
                />
            </div>
        );
    }

    public componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.has('id')) {
            this.setState({ idInput: query.get('id') as string });
        }
        // TODO: Show snackbar!
        console.log('error message', this.props.joinGameErrorMessage);
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
        const trimmedName = this.state.nameInput.trim();
        if (trimmedName && this.state.idInput) {
            this.joinGame();
        } else {
            this.setState({ nameInput: trimmedName, validateInputs: true });
            this.alertUser(!trimmedName ? getInvalidNameError() : getInvalidGameIdError());
        }
    }

    private alertUser = (message: string) => this.setState(
        { a11yMessageAssertive: message, isSnackbarOpen: true, snackBarMessage: message }
    );

    private handleSnackBarClose = () => this.setState({ isSnackbarOpen: false });

    private joinGame = () => {
        const playerInfo = this.props.playerInfo as PlayerInfo;
        const idCreationTimestamp = this.props.playerIdCreationTimestamp;
        const { idInput, nameInput } = this.state;
        removeAllDataOfRunningGameFromLocalStorage();
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        setRunningGameInfoInLocalStorage({ gameId: idInput, idCreationTimestamp: convertDateToUnixTimestamp(new Date()), isPlayerAdmin: false });
        this.props.onSetGameData({
            gameConfig: null,
            gameId: idInput,
            isRejoiningGame: false,
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
        gameId: state.gameId,
        joinGameErrorMessage: state.joinGameErrorMessage,
        playerIdCreationTimestamp: state.playerIdCreationTimestamp,
        playerInfo: state.playerInfo
    };
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): JoinGameDispatchProps => {
    return {
        onSetGameData: (payload: SetDataForNewGamePayload) => dispatch(setDataForNewGame(payload))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
