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
import SelectRandomCategories from '../../components/SelectRandomCategories/SelectRandomCategories';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import {
    AVAILABLE_CATEGORIES,
    DEFAULT_DURATION_OF_COUNTDOWN,
    DEFAULT_NUMBER_OF_ROUNDS,
    MAX_NUMBER_OF_ROUNDS,
    MIN_NUMBER_OF_CATEGORIES,
    MIN_NUMBER_OF_ROUNDS,
    STANDARD_ALPHABET,
    STANDARD_CATEGORIES,
    STANDARD_EXCLUDED_LETTERS,
    UseCountdownRadioButton,
} from '../../constants/game.constant';
import { GameConfigScoringOptions } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { getRandomCategories, getRandomLetters } from '../../utils/game.utils';
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
    durationOfCountdown: number;
    isSnackbarOpen: boolean;
    lettersToExclude: string[];
    nameInput: string;
    numberOfRoundsInput: number;
    scoringOptions: GameConfigScoringOptions;
    selectedCategories: string[];
    snackBarMessage: string;
    useCountdown: boolean;
    validateInputs: boolean;
}

class NewGame extends Component<NewGameProps, NewGameState> {
    public state: NewGameState = {
        availableCategories: AVAILABLE_CATEGORIES,
        durationOfCountdown: DEFAULT_DURATION_OF_COUNTDOWN,
        isSnackbarOpen: false,
        lettersToExclude: [...STANDARD_EXCLUDED_LETTERS],
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
        numberOfRoundsInput: DEFAULT_NUMBER_OF_ROUNDS,
        selectedCategories: STANDARD_CATEGORIES,
        scoringOptions: {
            checkForDuplicates: true,
            creativeAnswersExtraPoints: false,
            onlyPlayerWithValidAnswer: true,
        },
        snackBarMessage: '',
        useCountdown: false,
        validateInputs: false
    };

    public render() {
        const numberOfRoundsInputLabel = `Anzahl Runden (${MIN_NUMBER_OF_ROUNDS}-${MAX_NUMBER_OF_ROUNDS})`;
        const maxNumberOfCategories = this.state.availableCategories.length + this.state.selectedCategories.length;
        const newGameForm = (
            <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                <TextField
                    name="nameInput"
                    label="Spielername (max. 20 Zeichen)"
                    value={this.state.nameInput}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    autoFocus
                    error={this.state.validateInputs && !this.state.nameInput}
                    inputProps={{ 'maxLength': '20' }}
                    onChange={this.handleNameInputChange}
                />
                <TextField
                    name="numberOfRoundsInput"
                    label={numberOfRoundsInputLabel}
                    type="number"
                    value={this.state.numberOfRoundsInput}
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{ 'min': MIN_NUMBER_OF_ROUNDS, 'max': MAX_NUMBER_OF_ROUNDS }}
                    onChange={this.handleNumberOfRoundsInputChange}
                />
                <NewGameOptionsPanel
                    durationOfCountdown={this.state.durationOfCountdown}
                    lettersToExclude={this.state.lettersToExclude}
                    scoringOptions={this.state.scoringOptions}
                    useCountdown={this.state.useCountdown}
                    handleCountdownInputChange={this.handleCountdownInputChange}
                    handleGameOptionChange={this.handleGameOptionChange}
                    handleLetterToExcludeChange={this.handleLetterToExcludeChange}
                    handleUseCountdownChange={this.handleUseCountdownChange}
                />
                <p className={styles.options_label}>
                    <span>Ausgewählte Kategorien (mind. {MIN_NUMBER_OF_CATEGORIES}):</span>
                    <SelectRandomCategories
                        maxNumberOfCategories={maxNumberOfCategories}
                        selectCategoriesRandomly={this.selectCategoriesRandomly}
                    />
                </p>
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
                    message={this.state.snackBarMessage}
                    onClose={this.handleSnackBarClose}
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

    private handleGameOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            scoringOptions: {
                ...this.state.scoringOptions,
                [event.target.name]: event.target.checked
            }
        });
    }

    private handleCountdownInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ durationOfCountdown: +event.target.value });
    }

    private handleLetterToExcludeChange = (event: ChangeEvent<HTMLInputElement>, letter: string) => {
        const { lettersToExclude } = this.state;
        const newLettersToExclude = event.target.checked ? [...lettersToExclude, letter] : lettersToExclude.filter(l => l !== letter);
        this.setState({ lettersToExclude: newLettersToExclude });
    }

    private handleUseCountdownChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ useCountdown: (event.target as HTMLInputElement).value === UseCountdownRadioButton.countdown });
    };

    private selectCategoriesRandomly = (numberOfCategories: number, retainSelection: boolean) => {
        const categoryPool = [...this.state.availableCategories, ...this.state.selectedCategories];
        const selectedCategories = getRandomCategories(
            numberOfCategories, categoryPool, retainSelection ? this.state.selectedCategories : []
        );
        const availableCategories = categoryPool.filter(c => !selectedCategories.includes(c)).sort();
        this.setState({ availableCategories, selectedCategories });
    }

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
        const { durationOfCountdown, nameInput, numberOfRoundsInput, scoringOptions, selectedCategories, useCountdown } = this.state;
        const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        removeAllDataOfRunningGameFromLocalStorage();
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        setRunningGameInfoInLocalStorage({ gameId, idCreationTimestamp: convertDateToUnixTimestamp(new Date()), isPlayerAdmin: true });
        this.props.onSetGameData({
            gameConfig: {
                categories: selectedCategories,
                durationOfCountdown,
                letters: getRandomLetters(numberOfRoundsInput, xor(STANDARD_ALPHABET, this.state.lettersToExclude)),
                numberOfRounds: numberOfRoundsInput,
                scoringOptions,
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
