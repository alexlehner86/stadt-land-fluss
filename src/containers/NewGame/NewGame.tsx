import { Button, Snackbar, TextField } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { xor } from 'lodash';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import AddCustomCategory from '../../components/AddCustomCategory/AddCustomCategory';
import ChipsArray, { ChipType } from '../../components/ChipsArray/ChipsArray';
import NewGameOptionsPanel from '../../components/NewGameOptionsPanel/NewGameOptionsPanel';
import {
    RejoinRunningGameHint,
    RejoinRunningGameHintContext,
} from '../../components/RejoinRunningGameHint/RejoinRunningGameHint';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import {
    AVAILABLE_CATEGORIES,
    DEFAULT_DURATION_OF_COUNTDOWN,
    DEFAULT_NUMBER_OF_ROUNDS,
    GameOptionCheckboxName,
    MAX_NUMBER_OF_ROUNDS,
    MIN_NUMBER_OF_CATEGORIES,
    MIN_NUMBER_OF_ROUNDS,
    STANDARD_ALPHABET,
    STANDARD_CATEGORIES,
    STANDARD_EXCLUDED_LETTERS,
    UseCountdownRadioButton,
} from '../../constants/game.constant';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { getRandomnLetters } from '../../utils/game.utils';
import { convertDateToUnixTimestamp } from '../../utils/general.utils';
import {
    removeAllDataOfRunningGameFromLocalStorage,
    setPlayerInfoInLocalStorage,
    setRunningGameInfoInLocalStorage,
} from '../../utils/local-storage.utils';
import styles from './NewGame.module.css';

enum CategoryArray {
    available = 'available',
    selected = 'selected'
}

interface NewGamePropsFromStore {
    gameId: string | null;
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}
interface NewGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface NewGameProps extends NewGamePropsFromStore, NewGameDispatchProps, RouteComponentProps { }
interface NewGameState {
    availableCategories: string[];
    [GameOptionCheckboxName.checkForDuplicates]: boolean;
    [GameOptionCheckboxName.creativeAnswersExtraPoints]: boolean;
    durationOfCountdown: number;
    isSnackbarOpen: boolean;
    lettersToExclude: string[];
    nameInput: string;
    numberOfRoundsInput: number;
    [GameOptionCheckboxName.onlyPlayerWithValidAnswer]: boolean;
    selectedCategories: string[];
    snackBarMessage: string;
    useCountdown: boolean;
    validateInputs: boolean;
}

class NewGame extends Component<NewGameProps, NewGameState> {
    public state: NewGameState = {
        availableCategories: AVAILABLE_CATEGORIES,
        checkForDuplicates: true,
        creativeAnswersExtraPoints: false,
        durationOfCountdown: DEFAULT_DURATION_OF_COUNTDOWN,
        isSnackbarOpen: false,
        lettersToExclude: [...STANDARD_EXCLUDED_LETTERS],
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
        numberOfRoundsInput: DEFAULT_NUMBER_OF_ROUNDS,
        onlyPlayerWithValidAnswer: true,
        selectedCategories: STANDARD_CATEGORIES,
        snackBarMessage: '',
        useCountdown: false,
        validateInputs: false
    };

    public render() {
        const numberOfRoundsInputLabel = `Anzahl Runden (${MIN_NUMBER_OF_ROUNDS}-${MAX_NUMBER_OF_ROUNDS})`;
        const newGameForm = (
            <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                <TextField
                    name="nameInput"
                    label="Spielername (max. 20 Zeichen)"
                    value={this.state.nameInput}
                    onChange={this.handleNameInputChange}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    error={this.state.validateInputs && !this.state.nameInput}
                    inputProps={{ 'maxLength': '20' }}
                />
                <TextField
                    name="numberOfRoundsInput"
                    label={numberOfRoundsInputLabel}
                    type="number"
                    value={this.state.numberOfRoundsInput}
                    onChange={this.handleNumberOfRoundsInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{ 'min': MIN_NUMBER_OF_ROUNDS, 'max': MAX_NUMBER_OF_ROUNDS }}
                />
                <NewGameOptionsPanel
                    checkForDuplicates={this.state.checkForDuplicates}
                    creativeAnswersExtraPoints={this.state.creativeAnswersExtraPoints}
                    durationOfCountdown={this.state.durationOfCountdown}
                    lettersToExclude={this.state.lettersToExclude}
                    onlyPlayerWithValidAnswer={this.state.onlyPlayerWithValidAnswer}
                    useCountdown={this.state.useCountdown}
                    handleGameOptionChange={this.handleGameOptionChange}
                    handleLetterToExcludeChange={this.handleLetterToExcludeChange}
                    handleUseCountdownChange={this.handleUseCountdownChange}
                />
                <p className={styles.options_label}>Ausgewählte Kategorien (mind. {MIN_NUMBER_OF_CATEGORIES}):</p>
                <ChipsArray
                    chipsArray={this.state.selectedCategories}
                    chipType={ChipType.selected}
                    removeChip={(chipToRemove) => this.updateCategoryArrays(chipToRemove, CategoryArray.selected)}
                />
                <p className={styles.options_label}>Verfügbare Kategorien:</p>
                <ChipsArray
                    chipsArray={this.state.availableCategories}
                    chipType={ChipType.available}
                    removeChip={(chipToRemove) => this.updateCategoryArrays(chipToRemove, CategoryArray.available)}
                >
                    <AddCustomCategory addCustomCategory={this.addCustomCategory} />
                </ChipsArray>
                <div className="button-wrapper add-margin-top">
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        startIcon={<AddCircleIcon />}
                    >Spiel erstellen</Button>
                </div>
            </form>
        );
        return (
            <div className="main-content-wrapper">
                {this.props.gameId ? <RejoinRunningGameHint context={RejoinRunningGameHintContext.newgame} /> : null}
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Neues Spiel" />
                    {newGameForm}
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.isSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackBarClose}
                    message={this.state.snackBarMessage}
                />
            </div>
        );
    }

    public componentDidUpdate(prevProps: NewGameProps) {
        if (this.props.playerInfo && this.props.playerInfo !== prevProps.playerInfo) {
            this.setState({ nameInput: this.props.playerInfo.name });
        }
    }

    private handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ nameInput: event.target.value });
    }

    private handleNumberOfRoundsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = +event.target.value;
        if (value >= MIN_NUMBER_OF_ROUNDS && value <= MAX_NUMBER_OF_ROUNDS) {
            this.setState({ numberOfRoundsInput: value });
        }
    }

    private handleGameOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
    }

    private handleLetterToExcludeChange = (event: React.ChangeEvent<HTMLInputElement>, letter: string) => {
        const { lettersToExclude } = this.state;
        const newLettersToExclude = event.target.checked ? [...lettersToExclude, letter] : lettersToExclude.filter(l => l !== letter);
        this.setState({ lettersToExclude: newLettersToExclude });
    }

    private handleUseCountdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ useCountdown: (event.target as HTMLInputElement).value === UseCountdownRadioButton.countdown });
    };

    private updateCategoryArrays = (chipToRemove: string, removeFromArray: CategoryArray) => {
        let newSelectedCategories: string[];
        let newAvailableCategories: string[];
        if (removeFromArray === CategoryArray.selected) {
            newSelectedCategories = this.state.selectedCategories.filter(category => category !== chipToRemove);
            newAvailableCategories = [...this.state.availableCategories];
            newAvailableCategories.push(chipToRemove);
        } else {
            newAvailableCategories = this.state.availableCategories.filter(category => category !== chipToRemove);
            newSelectedCategories = [...this.state.selectedCategories];
            newSelectedCategories.push(chipToRemove);
        }
        this.setState({
            availableCategories: newAvailableCategories,
            selectedCategories: newSelectedCategories
        });
    }

    private addCustomCategory = (newCategory: string) => {
        this.setState({ availableCategories: [...this.state.availableCategories, newCategory] });
    }

    private handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (this.isReadyToStartGame()) {
            this.startNewGame();
        } else {
            this.setState({ nameInput: this.state.nameInput.trim(), validateInputs: true });
        }
    }

    private isReadyToStartGame = (): boolean => {
        if (this.state.selectedCategories.length < MIN_NUMBER_OF_CATEGORIES) {
            this.showSnackBar(`Du musst mindestens ${MIN_NUMBER_OF_CATEGORIES} Kategorien auswählen!`);
            return false;
        }
        if (STANDARD_ALPHABET.length - this.state.lettersToExclude.length < this.state.numberOfRoundsInput) {
            this.showSnackBar(`Du hast zu viele Buchstaben ausgeschlossen!`);
            return false;
        }
        return !!this.state.nameInput.trim();
    }

    private showSnackBar = (message: string) => this.setState({ isSnackbarOpen: true, snackBarMessage: message });
    private handleSnackBarClose = () => this.setState({ isSnackbarOpen: false });

    private startNewGame = () => {
        const playerInfo = this.props.playerInfo as PlayerInfo;
        const idCreationTimestamp = this.props.playerIdCreationTimestamp
        const { nameInput, numberOfRoundsInput, selectedCategories, useCountdown } = this.state;
        const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        removeAllDataOfRunningGameFromLocalStorage();
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        setRunningGameInfoInLocalStorage({ gameId, idCreationTimestamp: convertDateToUnixTimestamp(new Date()), isPlayerAdmin: true });
        this.props.onSetGameData({
            gameConfig: {
                categories: selectedCategories,
                letters: getRandomnLetters(numberOfRoundsInput, xor(STANDARD_ALPHABET, this.state.lettersToExclude)),
                numberOfRounds: numberOfRoundsInput,
                scoringOptions: {
                    checkForDuplicates: this.state.checkForDuplicates,
                    creativeAnswersExtraPoints: this.state.creativeAnswersExtraPoints,
                    onlyPlayerWithValidAnswer: this.state.onlyPlayerWithValidAnswer
                },
                useCountdown
            },
            gameId,
            isRejoiningGame: false,
            playerInfo: {
                id: playerInfo.id,
                isAdmin: true,
                name: nameInput.trim()
            }
        });
        this.props.history.push('/play');
    }

    private returnToDashboard = () => {
        this.props.history.push('/');
    }
}

const mapStateToProps = (state: AppState): NewGamePropsFromStore => {
    return {
        gameId: state.gameId,
        playerIdCreationTimestamp: state.playerIdCreationTimestamp,
        playerInfo: state.playerInfo
    };
}
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): NewGameDispatchProps => {
    return {
        onSetGameData: (payload: SetDataForNewGamePayload) => dispatch(setDataForNewGame(payload))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
