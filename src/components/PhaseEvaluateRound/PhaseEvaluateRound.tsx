import './PhaseEvaluateRound.css';
import { Checkbox, IconButton, InputAdornment, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import React, { ChangeEvent, FormEvent } from 'react';
import { GameConfig, GameRound, GameRoundEvaluation, PlayerInput, PlayerInputEvaluation } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import { SectionHeader } from '../SectionHeader/SectionHeader';

interface PhaseEvaluateRoundProps {
    allPlayers: Map<string, PlayerInfo>;
    currentRound: number;
    currentRoundEvaluation: GameRoundEvaluation;
    gameConfig: GameConfig;
    gameRounds: GameRound[];
    /** Player info for the user of this instance of the "Stadt-Land-Fluss" app. */
    playerInfo: PlayerInfo;
    // updateCurrentRoundInputs: (newCurrentRoundInputs: PlayerInput[]) => void;
    // sendRoundFinishedMessage: () => void;
}

const PhaseEvaluateRound = (props: PhaseEvaluateRoundProps) => {
    const { currentRound, gameConfig, playerInfo } = props;
    // Retrieve data for finished round; e.g. if current round is 1, then data is at index 0.
    const finishedGameRound = props.gameRounds[currentRound - 1];
    const currentLetter = gameConfig.letters[currentRound - 1];
    // Sort players alphabetically.
    let sortedPlayers = Array.from(props.allPlayers).map(data => data[1]);
    sortedPlayers = sortedPlayers.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));

    const handleCheckboxChange = (
        event: ChangeEvent<HTMLInputElement>, checkboxOwner: PlayerInfo, categoryIndex: number, indexInSortedPlayers: number
    ) => {
        if (checkboxOwner.id === playerInfo.id) {
            const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
            // TODO: send evaluation change via PubNub Message
            console.log('Your evaluation', evaluatedPlayer, categoryIndex, event.target.checked);
        }
    }
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // props.sendRoundFinishedMessage();
    };
    /**
     * Creates a group of checkboxes for each player in the game that represent their evaluation of
     * the text input of one of the players (including themselves) for one category. Users can either
     * mark a text input as valid (= checkbox checked) or invalid (= checkbox not checked).
     * The first checkbox represents the user's evaluation and is the only one that triggers a PubNub
     * message to the other players (and themselves) with the updated state of the checkbox.
     */
    const createEvaluationCheckboxes = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        // Make sure that current player's checkbox is first in line.
        const players = [playerInfo, ...(sortedPlayers.filter(player => player.id !== playerInfo.id))];
        const evaluationForPlayer = props.currentRoundEvaluation.get(sortedPlayers[indexInSortedPlayers].id) as PlayerInputEvaluation[];
        const evaluationForCategory = evaluationForPlayer[categoryIndex];
        return (
            <div
                key={`slf-evaluation-checkboxes-wrapper-${categoryIndex}-${indexInSortedPlayers}`}
                className="slf-evaluation-checkboxes-wrapper"
            >
                {players.map((player, index) => (
                    <Checkbox
                        key={`slf-evaluation-checkboxes-${categoryIndex}-${indexInSortedPlayers}-${index}`}
                        checked={!!evaluationForCategory.get(player.id)}
                        onChange={event => handleCheckboxChange(event, player, categoryIndex, indexInSortedPlayers)}
                        color={player.id === playerInfo.id ? 'primary' : 'default'}
                        inputProps={{ 'title': player.name }}
                    />
                ))}
            </div>
        );
    }
    /**
     * Creates a section for each category of the current game. It displays the category in the header,
     * followed by one textfield for each player showing their input for the finished round. If the
     * player input isn't an empty string, then on the right side of the textfield a group of
     * checkboxes is displayed which serve to evaluate the player's input (valid or invalid).
     */
    const createCategorySection = (category: string, categoryIndex: number): JSX.Element => (
        <div
            key={'slf-evaluation-for-category-no-' + categoryIndex}
            className="material-card-style"
        >
            <SectionHeader showDivider={false} text={category}></SectionHeader>
            {sortedPlayers.map((player, indexInSortedPlayers) => (
                <div
                    key={`slf-evaluation-textfield-wrapper-${categoryIndex}-${indexInSortedPlayers}`}
                    className="slf-evaluation-textfield-wrapper"
                >
                    <TextField
                        key={'slf-textfield-category-no-' + categoryIndex + '-player-' + indexInSortedPlayers}
                        value={(finishedGameRound.get(player.id) as PlayerInput[])[categoryIndex].text}
                        className="slf-evaluation-textfield"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{player.name}</InputAdornment>
                        }}
                    />
                    {(finishedGameRound.get(player.id) as PlayerInput[])[categoryIndex].text ?
                        createEvaluationCheckboxes(categoryIndex, indexInSortedPlayers) : null}
                </div>
            ))}
        </div>
    );

    return (
        <React.Fragment>
            <GameRoundChip currentLetter={currentLetter} currentRound={currentRound} />
            <form onSubmit={handleSubmit} className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createCategorySection)}
                <IconButton
                    type="submit"
                    className="fixed-bottom-right-button"
                    color="primary"
                    title="Akzeptieren"
                    aria-label="Akzeptieren"
                >
                    <SendIcon />
                </IconButton>
            </form>
        </React.Fragment>
    );
}

export default PhaseEvaluateRound;
