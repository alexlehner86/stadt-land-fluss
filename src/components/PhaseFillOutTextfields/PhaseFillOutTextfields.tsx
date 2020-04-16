import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import React, { ChangeEvent } from 'react';
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

const PhaseFillOutTextfields: React.FunctionComponent<PhaseFillOutTextfieldsProps> = props => {
    const { currentRound, gameConfig, gameRoundInputs } = props;
    const currentLetter = gameConfig.letters[currentRound - 1];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newGameRoundInputs = [...gameRoundInputs];
        newGameRoundInputs[index] = { ...newGameRoundInputs[index], text: event.target.value };
        props.updateCurrentRoundInputs(newGameRoundInputs);
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
                    startAdornment: <InputAdornment position="start">{currentLetter}:</InputAdornment>
                }}
            />
        </div>
    );

    return (
        <React.Fragment>
            <GameRoundChip currentLetter={currentLetter} currentRound={currentRound} />
            <form className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createTextfieldElement)}
                <IconButton
                    type="button"
                    className="fixed-bottom-right-button"
                    color="secondary"
                    title="Abschicken"
                    aria-label="Abschicken"
                    onClick={() => props.sendRoundFinishedMessage()}
                >
                    <EmailIcon />
                </IconButton>
            </form>
        </React.Fragment>
    );
}

export default PhaseFillOutTextfields;
