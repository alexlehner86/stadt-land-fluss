import './PhaseEvaluateRound.css';
import { IconButton, InputAdornment, TextField, Checkbox } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import React, { FormEvent } from 'react';
import { GameConfig, GameRound, PlayerInput } from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import { SectionHeader } from '../SectionHeader/SectionHeader';

interface PhaseEvaluateRoundProps {
    allPlayers: Map<string, PlayerInfo>;
    currentRound: number;
    gameConfig: GameConfig;
    gameRounds: GameRound[];
    playerInfo: PlayerInfo;
    // updateCurrentRoundInputs: (newCurrentRoundInputs: PlayerInput[]) => void;
    // sendRoundFinishedMessage: () => void;
}

const PhaseEvaluateRound = (props: PhaseEvaluateRoundProps) => {
    const { currentRound, gameConfig, playerInfo } = props;
    const finishedGameRound = props.gameRounds[currentRound - 1];
    const currentLetter = gameConfig.letters[currentRound - 1];
    let sortedPlayers = Array.from(props.allPlayers).map(data => data[1]);
    sortedPlayers = sortedPlayers.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // props.sendRoundFinishedMessage();
    };
    const createEvaluationCheckboxes = (categoryIndex: number, evaluatedPlayerIndex: number): JSX.Element => {
        // Make sure that current player's checkbox is first in line.
        const players = [playerInfo, ...(sortedPlayers.filter(player => player.id !== playerInfo.id))];
        return (
            <div
                key={`slf-evaluation-checkboxes-wrapper-${categoryIndex}-${evaluatedPlayerIndex}`}
                className="slf-evaluation-checkboxes-wrapper"
            >
                {players.map((player, index) => (
                    <Checkbox
                        key={`slf-evaluation-checkboxes-${categoryIndex}-${evaluatedPlayerIndex}-${index}`}
                        checked={true}
                        // onChange={handleChange}
                        color={player.id === playerInfo.id ? 'primary' : 'default'}
                        inputProps={{ 'title': player.name }}
                    />
                ))}
            </div>
        );
    }
    const createCategorySection = (category: string, categoryIndex: number): JSX.Element => (
        <div
            key={'slf-evaluation-for-category-no-' + categoryIndex}
            className="material-card-style"
        >
            <SectionHeader showDivider={false} text={category}></SectionHeader>
            {sortedPlayers.map((player, playerIndex) => (
                <div
                    key={`slf-evaluation-textfield-wrapper-${categoryIndex}-${playerIndex}`}
                    className="slf-evaluation-textfield-wrapper"
                >
                    <TextField
                        key={'slf-textfield-category-no-' + categoryIndex + '-player-' + playerIndex}
                        value={(finishedGameRound.get(player.id) as PlayerInput[])[categoryIndex].text}
                        className="slf-evaluation-textfield"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{player.name}</InputAdornment>
                        }}
                    />
                    {(finishedGameRound.get(player.id) as PlayerInput[])[categoryIndex].text ?
                        createEvaluationCheckboxes(categoryIndex, playerIndex) : null}
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
