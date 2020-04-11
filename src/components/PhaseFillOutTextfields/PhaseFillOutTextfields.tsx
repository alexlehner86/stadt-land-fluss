import { InputAdornment, TextField, IconButton, makeStyles, createStyles } from '@material-ui/core';
import React, { ChangeEvent, FormEvent } from 'react';
import { GameConfig, PlayerInput } from '../../models/game.interface';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(_ =>
    createStyles({
        submitButton: {
            position: 'fixed',
            right: '1rem',
            bottom: '1rem',
            backgroundColor: 'rgba(250, 250, 250, 0.9)'
        }
    }),
);

interface PhaseFillOutTextfieldsProps {
    currentRound: number;
    gameConfig: GameConfig;
    gameRoundInputs: PlayerInput[];
    updateCurrentRoundInputs: (newCurrentRoundInputs: PlayerInput[]) => void;
    sendRoundFinishedMessage: () => void;
}

const PhaseFillOutTextfields = (props: PhaseFillOutTextfieldsProps) => {
    const classes = useStyles();
    const { currentRound, gameConfig, gameRoundInputs } = props;
    const currentLetter = gameConfig.letters[currentRound - 1];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newGameRoundInputs = [...gameRoundInputs];
        newGameRoundInputs[index] = { ...newGameRoundInputs[index], text: event.target.value };
        props.updateCurrentRoundInputs(newGameRoundInputs);
    }
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        props.sendRoundFinishedMessage();
    }
    const createTextfieldElement = (category: string, index: number): JSX.Element => {
        return (
            <div
                key={'slf-input-for-category-no-' + index}
                className="material-card-style"
            >
                <SectionHeader text={category}></SectionHeader>
                <TextField
                    value={gameRoundInputs[index].text}
                    onChange={event => handleInputChange(event, index)}
                    className="app-form-input"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currentLetter}</InputAdornment>
                    }}
                />
            </div>
        );
    }

    return (
        <React.Fragment>
            <GameRoundChip currentLetter={currentLetter} currentRound={currentRound} />
            <form onSubmit={handleSubmit} className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createTextfieldElement)}
                <IconButton type="submit" className={classes.submitButton} color="primary" title="Abschicken" aria-label="Abschicken">
                    <SendIcon />
                </IconButton>
            </form>
        </React.Fragment>
    );
}

export default PhaseFillOutTextfields;
