import './NewGame.css';
import { Button, TextField } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { ChangeEvent, Component, Dispatch, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import ChipsArray, { ChipType } from '../../components/ChipsArray/ChipsArray';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { PUBNUB_CONFIG } from '../../config/pubnub.config';
import {
    AVAILABLE_CATEGORIES,
    MAX_NUMBER_OF_ROUNDS,
    MIN_NUMBER_OF_ROUNDS,
    STANDARD_CATEGORIES,
} from '../../constants/game.constant';
import { AppAction, setDataForNewGame, SetDataForNewGamePayload } from '../../store/app.actions';
import { getRandomnLetters } from '../../utils/game.utils';

enum CategoryArray {
    available = 'available',
    selected = 'selected'
}

interface NewGameDispatchProps {
    onSetGameData: (payload: SetDataForNewGamePayload) => void
}
interface NewGameProps extends NewGameDispatchProps, RouteComponentProps {}
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
        nameInput: '',
        numberOfRoundsInput: MIN_NUMBER_OF_ROUNDS,
        selectedCategories: STANDARD_CATEGORIES,
        validateInputs: false
    };

    public render() {
        const numberOfRoundsInputLabel = `Anzahl Runden (${MIN_NUMBER_OF_ROUNDS}-${MAX_NUMBER_OF_ROUNDS})`;
        const newGameForm = (
            <form onSubmit={this.handleSubmit} className="app-form" noValidate autoComplete="off">
                <TextField
                    name="nameInput"
                    label="Spielername"
                    value={this.state.nameInput}
                    onChange={this.handleNameInputChange}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    required
                    error={this.state.validateInputs && !this.state.nameInput}
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
                />
                <p className="category-array-label">Ausgewählte Kategorien:</p>
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
                />
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
            </div>
        );
    }

    private handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ nameInput: event.target.value });
    }

    private handleNumberOfRoundsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = +event.target.value;
        value = value < MIN_NUMBER_OF_ROUNDS ? MIN_NUMBER_OF_ROUNDS : value;
        value = value > MAX_NUMBER_OF_ROUNDS ? MAX_NUMBER_OF_ROUNDS : value;
        this.setState({ numberOfRoundsInput: value });
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

    private handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        this.setState({ validateInputs: true });
        if (this.state.nameInput && this.state.selectedCategories.length >= 3) {
            const gameId = uuidv4(); // ⇨ e.g. '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
            const letters = getRandomnLetters(this.state.numberOfRoundsInput);
            this.props.onSetGameData({
                gameConfig: {
                    categories: this.state.selectedCategories,
                    letters,
                    numberOfRounds: this.state.numberOfRoundsInput
                },
                gameId,
                playerInfo: {
                    id: PUBNUB_CONFIG.uuid as string,
                    isAdmin: true,
                    name: this.state.nameInput
                }
            });
            this.props.history.push('/play')
        }
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>): NewGameDispatchProps => {
    return {
        onSetGameData: (payload: SetDataForNewGamePayload) => {
            dispatch(setDataForNewGame(payload))
        }
    }
};
export default connect(null, mapDispatchToProps)(NewGame);
