import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import React, { ChangeEvent } from 'react';

import { EndRoundMode, GameConfig, PlayerInput } from '../../models/game.interface';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import RoundCountdown from '../RoundCountdown/RoundCountdown';

interface PhaseFillOutTextfieldsProps {
    currentRound: number;
    gameConfig: GameConfig;
    gameRoundInputs: PlayerInput[];
    updateCurrentRoundInputs: (newCurrentRoundInputs: PlayerInput[]) => void;
    finishRoundOnCountdownComplete: () => void;
    finishRoundOnUserAction: () => void;
}

const PhaseFillOutTextfields: React.FunctionComponent<PhaseFillOutTextfieldsProps> = props => {
    const { currentRound, gameConfig, gameRoundInputs } = props;
    const currentLetter = gameConfig.letters[currentRound - 1];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newGameRoundInputs = [...gameRoundInputs];
        newGameRoundInputs[index] = { ...newGameRoundInputs[index], text: event.target.value };
        props.updateCurrentRoundInputs(newGameRoundInputs);
    };
    const createTextfieldElement = (category: string, index: number): JSX.Element => {
        const uniqueId = 'slf-input-for-category-no-' + index;
        return (
            <div
                key={uniqueId}
                className="material-card-style"
            >
                <label htmlFor={uniqueId} className="section-header">
                    {category}<span className="sr-only"> mit Buchstabe ({currentLetter})</span>
                </label>
                <TextField
                    value={gameRoundInputs[index].text}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        id: uniqueId,
                        startAdornment: <InputAdornment position="start">{currentLetter}:</InputAdornment>,
                        spellCheck: false
                    }}
                    onChange={event => handleInputChange(event, index)}
                />
            </div>
        );
    };
    const endRoundButton = (
        <IconButton
            type="button"
            className="fixed-bottom-right-button"
            color="secondary"
            title="Abschicken"
            aria-label="Abschicken"
            onClick={props.finishRoundOnUserAction}
        >
            <EmailIcon fontSize="large" />
        </IconButton>
    );
    const countdownElement = (
        <RoundCountdown
            duration={props.gameConfig.durationOfCountdown}
            onComplete={props.finishRoundOnCountdownComplete}
        />
    );

    return (
        <React.Fragment>
            <GameRoundChip
                currentLetter={currentLetter}
                currentRound={currentRound}
                isEvaluationPhase={false}
                numberOfRounds={gameConfig.numberOfRounds}
            />
            <form className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createTextfieldElement)}
                {gameConfig.endRoundMode === EndRoundMode.countdownEnds ? countdownElement : endRoundButton}
            </form>
        </React.Fragment>
    );
};

export default PhaseFillOutTextfields;
