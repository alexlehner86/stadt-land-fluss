import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    Snackbar,
    SnackbarContent,
    TextField,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { xor } from 'lodash';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { LiveMessage } from 'react-aria-live';
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
import { PLAYER_NAME_MAX_LENGTH } from '../../constants/app.constant';
import {
    AVAILABLE_CATEGORIES,
    DEFAULT_DURATION_OF_COUNTDOWN,
    DEFAULT_NUMBER_OF_ROUNDS,
    MAX_NUMBER_OF_ROUNDS,
    MIN_DURATION_OF_COUNTDOWN,
    MIN_NUMBER_OF_CATEGORIES,
    MIN_NUMBER_OF_ROUNDS,
    STANDARD_ALPHABET,
    STANDARD_CATEGORIES,
    STANDARD_EXCLUDED_LETTERS,
} from '../../constants/game.constant';
import { NUMBER_OF_ROUNDS_LABEL, PLAYER_NAME_LABEL } from '../../constants/text.constant';
import { EndRoundMode, GameConfigScoringOptions } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, prepareRejoiningGame, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import {
    getInvalidNameError,
    getInvalidRoundsError,
    getTooFewCategoriesError,
    getTooManyLettersExcludedError,
} from '../../utils/error-text.util';
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
    onPrepareRejoiningGame: () => void;
    onSetGameData: (payload: SetDataForNewGamePayload) => void;
}
interface NewGameProps extends NewGamePropsFromStore, NewGameDispatchProps, RouteComponentProps { }
interface NewGameState {
    a11yMessageAssertive: string;
    a11yMessagePolite: string;
    availableCategories: string[];
    durationOfCountdown: number;
    endRoundMode: EndRoundMode;
    isNumberOfRoundsInputValid: boolean;
    isSnackbarOpen: boolean;
    lettersToExclude: string[];
    nameInput: string;
    numberOfRoundsInput: number;
    scoringOptions: GameConfigScoringOptions;
    selectedCategories: string[];
    snackBarMessage: string;
    validateInputs: boolean;
}

class NewGame extends Component<NewGameProps, NewGameState> {
    public state: NewGameState = {
        a11yMessageAssertive: '',
        a11yMessagePolite: '',
        availableCategories: AVAILABLE_CATEGORIES,
        durationOfCountdown: DEFAULT_DURATION_OF_COUNTDOWN,
        endRoundMode: EndRoundMode.allPlayersSubmit,
        isNumberOfRoundsInputValid: true,
        isSnackbarOpen: false,
        lettersToExclude: [...STANDARD_EXCLUDED_LETTERS],
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
        numberOfRoundsInput: DEFAULT_NUMBER_OF_ROUNDS,
        selectedCategories: STANDARD_CATEGORIES,
        scoringOptions: {
            checkForDuplicates: true,
            creativeAnswersExtraPoints: true,
            onlyPlayerWithValidAnswer: true,
        },
        snackBarMessage: '',
        validateInputs: false
    };

    private submitButton: React.RefObject<HTMLButtonElement>;

    constructor(props: NewGameProps) {
        super(props);
        this.submitButton = React.createRef();
    }

    public render() {
        const playerNameAriaLabel = `${PLAYER_NAME_LABEL} (maximal ${PLAYER_NAME_MAX_LENGTH} Zeichen)`;
        const playerNameVisibleLabel = `${PLAYER_NAME_LABEL} (max. ${PLAYER_NAME_MAX_LENGTH} Zeichen)`;
        const numberOfRoundsAriaLabel = `${NUMBER_OF_ROUNDS_LABEL} (maximal ${MAX_NUMBER_OF_ROUNDS})`;
        const numberOfRoundsVisibleLabel = `${NUMBER_OF_ROUNDS_LABEL} (max. ${MAX_NUMBER_OF_ROUNDS})`;
        const maxNumberOfCategories = this.state.availableCategories.length + this.state.selectedCategories.length;
        const isNameInvalid = this.state.validateInputs && !this.state.nameInput;
        const isNumberOfRoundsInvalid = this.state.validateInputs && !this.state.isNumberOfRoundsInputValid;
        const isNumberOfCategoriesInvalid = this.state.validateInputs && this.state.selectedCategories.length < MIN_NUMBER_OF_CATEGORIES;
        const areTooManyLettersExcluded = this.state.validateInputs && (STANDARD_ALPHABET.length - this.state.lettersToExclude.length < this.state.numberOfRoundsInput);
        const tooFewCategoriesError = (
            <FormHelperText className={'MuiFormHelperText-contained ' + styles.too_few_categories_error} error>
                {getTooFewCategoriesError()}
            </FormHelperText>
        );
        const tooManyLettersExcludedError = (
            <FormHelperText className={'MuiFormHelperText-contained ' + styles.too_many_letters_excluded_error} error>
                {getTooManyLettersExcludedError(this.state.numberOfRoundsInput)}
            </FormHelperText>
        );
        const newGameForm = (
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
                    onChange={this.handleNameInputChange}
                />
                <label htmlFor="number-of-rounds-input" className="sr-only">{numberOfRoundsAriaLabel}</label>
                <TextField
                    name="numberOfRoundsInput"
                    label={numberOfRoundsVisibleLabel}
                    type="number"
                    value={this.state.numberOfRoundsInput}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    error={isNumberOfRoundsInvalid}
                    helperText={isNumberOfRoundsInvalid ? getInvalidRoundsError() : ''}
                    inputProps={{
                        id: 'number-of-rounds-input',
                        min: MIN_NUMBER_OF_ROUNDS,
                        max: MAX_NUMBER_OF_ROUNDS
                    }}
                    onChange={this.handleNumberOfRoundsInputChange}
                />
                <FormControl component="fieldset" classes={{ root: styles.custom_fieldset }}>
                    <FormLabel
                        component="legend"
                        className={styles.custom_legend}
                    >
                        Beenden der Runde durch
                    </FormLabel>
                    <RadioGroup
                        className={styles.radio_group}
                        name="usecountdown"
                        value={this.state.endRoundMode}
                        onChange={this.handleUseCountdownChange}
                    >
                        <FormControlLabel
                            value={EndRoundMode.allPlayersSubmit}
                            control={<Radio color="primary" />}
                            label="Alle Spielenden gemeinsam"
                        />
                        <FormControlLabel
                            value={EndRoundMode.firstPlayerSubmits}
                            control={<Radio color="primary" />}
                            label="Schnellster Spieler"
                        />
                        <div className={styles.countdown_wrapper}>
                            <FormControlLabel
                                value={EndRoundMode.countdownEnds}
                                control={<Radio color="primary" />}
                                label="Countdown (Sekunden)"
                            />
                            <Input
                                type="number"
                                value={this.state.durationOfCountdown}
                                className={styles.countdown_input}
                                disabled={this.state.endRoundMode !== EndRoundMode.countdownEnds}
                                inputProps={{ 'aria-label': 'Dauer des Countdowns', 'min': MIN_DURATION_OF_COUNTDOWN }}
                                onChange={this.handleCountdownInputChange}
                            />
                        </div>
                    </RadioGroup>
                </FormControl>
                <NewGameOptionsPanel
                    lettersToExclude={this.state.lettersToExclude}
                    scoringOptions={this.state.scoringOptions}
                    handleGameOptionChange={this.handleGameOptionChange}
                    handleLetterToExcludeChange={this.handleLetterToExcludeChange}
                />
                {areTooManyLettersExcluded && !isNumberOfRoundsInvalid ? tooManyLettersExcludedError : null}
                <div className={styles.selected_categories_wrapper}>
                    <SelectRandomCategories
                        maxNumberOfCategories={maxNumberOfCategories}
                        selectCategoriesRandomly={this.selectCategoriesRandomly}
                    />
                    <FormControl
                        component="fieldset"
                        classes={{ root: isNumberOfCategoriesInvalid ? styles.custom_fieldset_error : styles.custom_fieldset }}
                    >
                        <FormLabel
                            component="legend"
                            className={styles.custom_legend}
                        >
                            Ausgewählte Kategorien (mind. {MIN_NUMBER_OF_CATEGORIES})
                        <span className="sr-only">
                                Klicke auf eine Kategorie, um diese aus der Liste
                                der ausgewählten Kategorien zu entfernen.
                        </span>
                        </FormLabel>
                        <ChipsArray
                            chipsArray={this.state.selectedCategories}
                            chipType={ChipType.selected}
                            removeChip={(chipToRemove) => this.updateCategoryArrays(chipToRemove, CategoryArray.selected)}
                        />
                    </FormControl>
                    <AddCustomCategory addCustomCategory={this.addCustomCategory} />
                </div>
                {isNumberOfCategoriesInvalid ? tooFewCategoriesError : null}
                <button
                    type="button"
                    className={styles.jump_to_end_button}
                    onClick={this.scrollToAndFocusSubmitButton}
                >
                    <span>Zum Formularende springen</span>
                    <KeyboardArrowDownIcon className={styles.jump_to_end_button_icon} />
                </button>
                <FormControl
                    component="fieldset"
                    classes={{ root: styles.custom_fieldset }}
                >
                    <FormLabel
                        component="legend"
                        className={styles.custom_legend}
                    >
                        Verfügbare Kategorien
                        <span className="sr-only">
                            Klicke auf eine Kategorie, um diese der Liste
                            der ausgewählten Kategorien hinzuzufügen.
                        </span>
                    </FormLabel>
                    <ChipsArray
                        chipsArray={this.state.availableCategories}
                        chipType={ChipType.available}
                        removeChip={(chipToRemove) => this.updateCategoryArrays(chipToRemove, CategoryArray.available)}
                    />
                </FormControl>
                <div className="button-wrapper add-margin-top">
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        size="large"
                        startIcon={<AddCircleIcon />}
                        ref={this.submitButton}
                    >Spiel erstellen</Button>
                </div>
            </form>
        );
        const rejoinRunningGameElement = (
            <RejoinRunningGameHint
                context={RejoinRunningGameHintContext.newgame}
                rejoinRunningGame={this.rejoinRunningGame}
            />
        );
        return (
            <div className="main-content-wrapper">
                {this.props.gameId ? rejoinRunningGameElement : null}
                <div className="material-card-style">
                    <SectionHeader text="Neues Spiel" />
                    {newGameForm}
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
                <LiveMessage
                    message={this.state.a11yMessagePolite}
                    aria-live="polite"
                    clearOnUnmount="true"
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
        const value = +event.target.value;
        const isNumberOfRoundsInputValid = value >= MIN_NUMBER_OF_ROUNDS && value <= MAX_NUMBER_OF_ROUNDS;
        this.setState({ isNumberOfRoundsInputValid, numberOfRoundsInput: value });
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
        this.setState({ endRoundMode: event.target.value as EndRoundMode });
    };

    private selectCategoriesRandomly = (numberOfCategories: number, retainSelection: boolean) => {
        const categoryPool = [...this.state.availableCategories, ...this.state.selectedCategories];
        const selectedCategories = getRandomCategories(
            numberOfCategories, categoryPool, retainSelection ? this.state.selectedCategories : []
        );
        const availableCategories = categoryPool.filter(c => !selectedCategories.includes(c)).sort();
        this.setState({ availableCategories, selectedCategories });
        // Trigger a11y message after short timeout so that screen reader reads new position of focus first.
        setTimeout(() => {
            const a11yMessagePolite = `Es wurden ${numberOfCategories} Kategorien zufällig ausgewählt.`;
            this.setState({ a11yMessagePolite });
        }, 500);
    }

    private updateCategoryArrays = (chipToRemove: string, removeFromArray: CategoryArray) => {
        let newSelectedCategories: string[];
        let newAvailableCategories: string[];
        let a11yMessagePolite: string;
        if (removeFromArray === CategoryArray.selected) {
            newSelectedCategories = this.state.selectedCategories.filter(category => category !== chipToRemove);
            newAvailableCategories = [...this.state.availableCategories];
            newAvailableCategories.push(chipToRemove);
            a11yMessagePolite = `Kategorie ${chipToRemove} wurde aus der Liste der ausgewählten Kategorien entfernt.`;
        } else {
            newAvailableCategories = this.state.availableCategories.filter(category => category !== chipToRemove);
            newSelectedCategories = [...this.state.selectedCategories];
            newSelectedCategories.push(chipToRemove);
            a11yMessagePolite = `Kategorie ${chipToRemove} wurde der Liste der ausgewählten Kategorien hinzugefügt.`;
        }
        this.setState({
            a11yMessagePolite,
            availableCategories: newAvailableCategories,
            selectedCategories: newSelectedCategories
        });
    }

    private addCustomCategory = (newCategory: string) => {
        this.setState({ selectedCategories: [...this.state.selectedCategories, newCategory] });
        // Trigger a11y message after short timeout so that screen reader reads new position of focus first.
        setTimeout(() => {
            const a11yMessagePolite = `Die Kategorie ${newCategory} wurde der Liste der ausgewählten Kategorien hinzugefügt.`;
            this.setState({ a11yMessagePolite });
        }, 500);
    }

    private scrollToAndFocusSubmitButton = () => {
        this.submitButton.current?.scrollIntoView();
        this.submitButton.current?.focus();
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
        const { isNumberOfRoundsInputValid, lettersToExclude, numberOfRoundsInput, selectedCategories } = this.state;
        if (!this.state.nameInput.trim()) {
            this.alertUser(getInvalidNameError());
            return false;
        }
        if (!isNumberOfRoundsInputValid) {
            this.alertUser(getInvalidRoundsError());
            return false;
        }
        if (selectedCategories.length < MIN_NUMBER_OF_CATEGORIES) {
            this.alertUser(getTooFewCategoriesError());
            return false;
        }
        if (STANDARD_ALPHABET.length - lettersToExclude.length < numberOfRoundsInput) {
            this.alertUser(getTooManyLettersExcludedError(numberOfRoundsInput));
            return false;
        }
        return true;
    }

    private alertUser = (message: string) => this.setState(
        { a11yMessageAssertive: message, isSnackbarOpen: true, snackBarMessage: message }
    );

    private handleSnackBarClose = () => this.setState({ isSnackbarOpen: false });

    private startNewGame = () => {
        const playerInfo = this.props.playerInfo as PlayerInfo;
        const idCreationTimestamp = this.props.playerIdCreationTimestamp;
        const { durationOfCountdown, endRoundMode, nameInput, numberOfRoundsInput, scoringOptions, selectedCategories } = this.state;
        const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        removeAllDataOfRunningGameFromLocalStorage();
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        setRunningGameInfoInLocalStorage({ gameId, idCreationTimestamp: convertDateToUnixTimestamp(new Date()), isPlayerAdmin: true });
        this.props.onSetGameData({
            gameConfig: {
                categories: selectedCategories,
                durationOfCountdown,
                endRoundMode,
                letters: getRandomLetters(numberOfRoundsInput, xor(STANDARD_ALPHABET, this.state.lettersToExclude)),
                numberOfRounds: numberOfRoundsInput,
                scoringOptions,
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

    private rejoinRunningGame = () => {
        this.props.onPrepareRejoiningGame();
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
};
const mapDispatchToProps = (dispatch: Dispatch<AppAction>): NewGameDispatchProps => {
    return {
        onPrepareRejoiningGame: () => dispatch(prepareRejoiningGame()),
        onSetGameData: (payload: SetDataForNewGamePayload) => dispatch(setDataForNewGame(payload))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
