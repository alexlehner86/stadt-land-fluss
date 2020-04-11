import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import React, { ChangeEvent, FormEvent } from 'react';
import { GameConfig, PlayerInput } from '../../models/game.interface';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import { SectionHeader } from '../SectionHeader/SectionHeader';

interface PhaseFillOutTextfieldsProps {
    currentRound: number;
    gameConfig: GameConfig;
    gameRoundInputs: PlayerInput[];
    updateCurrentRoundInputs: (newCurrentRoundInputs: PlayerInput[]) => void;
    sendRoundFinishedMessage: () => void;
}

const PhaseFillOutTextfields = (props: PhaseFillOutTextfieldsProps) => {
    const { currentRound, gameConfig, gameRoundInputs } = props;
    const currentLetter = gameConfig.letters[currentRound - 1];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newGameRoundInputs = [...gameRoundInputs];
        newGameRoundInputs[index] = { ...newGameRoundInputs[index], text: event.target.value };
        props.updateCurrentRoundInputs(newGameRoundInputs);
    };
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        props.sendRoundFinishedMessage();
    };
    const createTextfieldElement = (category: string, index: number): JSX.Element => (
        <div
            key={'slf-input-for-category-no-' + index}
            className="material-card-style"
        >
            <SectionHeader showDivider={false} text={category}></SectionHeader>
            <TextField
                value={gameRoundInputs[index].text}
                onChange={event => handleInputChange(event, index)}
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: <InputAdornment position="start">{currentLetter}</InputAdornment>
                }}
            />
        </div>
    );

    return (
        <React.Fragment>
            <GameRoundChip currentLetter={currentLetter} currentRound={currentRound} />
            <form onSubmit={handleSubmit} className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createTextfieldElement)}
                <IconButton
                    type="submit"
                    className="fixed-bottom-right-button"
                    color="primary"
                    title="Abschicken"
                    aria-label="Abschicken"
                >
                    <SendIcon />
                </IconButton>
            </form>
        </React.Fragment>
    );
}

export default PhaseFillOutTextfields;
