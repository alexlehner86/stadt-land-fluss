import './NewGame.css';
import { Button, TextField } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import AddCustomCategory from '../../components/AddCustomCategory/AddCustomCategory';
import ChipsArray, { ChipType } from '../../components/ChipsArray/ChipsArray';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import ToDashboardButton from '../../components/ToDashboardButton/ToDashboardButton';
import {
    AVAILABLE_CATEGORIES,
    DEFAULT_NUMBER_OF_ROUNDS,
    MAX_NUMBER_OF_ROUNDS,
    MIN_NUMBER_OF_ROUNDS,
    STANDARD_CATEGORIES,
} from '../../constants/game.constant';
import { PlayerInfo } from '../../models/player.interface';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { AppState } from '../../store/app.reducer';
import { getRandomnLetters } from '../../utils/game.utils';
import { convertDateToUnixTimestamp } from '../../utils/general.utils';
import { setPlayerInfoInLocalStorage, setRunningGameInfoInLocalStorage } from '../../utils/local-storage.utils';

enum CategoryArray {
    available = 'available',
    selected = 'selected'
}

interface NewGamePropsFromStore {
    playerIdCreationTimestamp: number;
    playerInfo: PlayerInfo | null;
}
interface NewGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface NewGameProps extends NewGamePropsFromStore, NewGameDispatchProps, RouteComponentProps { }
interface NewGameState {
    availableCategories: string[];
    nameInput: string;
    numberOfRoundsInput: number;
    selectedCategories: string[];
    validateInputs: boolean;
}

class NewGame extends Component<NewGameProps, NewGameState> {
    public state: NewGameState = {
        availableCategories: AVAILABLE_CATEGORIES,
        nameInput: this.props.playerInfo ? this.props.playerInfo.name : '',
        numberOfRoundsInput: DEFAULT_NUMBER_OF_ROUNDS,
        selectedCategories: STANDARD_CATEGORIES,
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
                <p className="category-array-label">Ausgewählte Kategorien (mind. 3):</p>
                <ChipsArray
                    chipsArray={this.state.selectedCategories}
                    chipType={ChipType.selected}
                    removeChip={(chipToRemove) => this.updateCategoryArrays(chipToRemove, CategoryArray.selected)}
                />
                <p className="category-array-label">Verfügbare Kategorien:</p>
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
                <div className="material-card-style">
                    <SectionHeader showDivider={true} text="Neues Spiel" />
                    {newGameForm}
                </div>
                <ToDashboardButton onReturnToDashboard={this.returnToDashboard} />
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
        if (this.state.nameInput.trim() && this.state.selectedCategories.length >= 3) {
            this.startNewGame();
        } else {
            this.setState({ nameInput: this.state.nameInput.trim(), validateInputs: true });
        }
    }

    private startNewGame = () => {
        const playerInfo = this.props.playerInfo as PlayerInfo;
        const idCreationTimestamp = this.props.playerIdCreationTimestamp
        const { nameInput, numberOfRoundsInput, selectedCategories } = this.state;
        setPlayerInfoInLocalStorage({ id: playerInfo.id, idCreationTimestamp, name: nameInput.trim() });
        const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        setRunningGameInfoInLocalStorage({ gameId, idCreationTimestamp: convertDateToUnixTimestamp(new Date()), isPlayerAdmin: true });
        this.props.onSetGameData({
            gameConfig: {
                categories: selectedCategories,
                letters: getRandomnLetters(numberOfRoundsInput),
                numberOfRounds: numberOfRoundsInput
            },
            gameId,
            playerInfo: {
                id: playerInfo.id,
                isAdmin: true,
                isRejoiningGame: false,
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
