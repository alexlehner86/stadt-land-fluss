import './PhaseEvaluateRound.css';
import { Badge, createStyles, IconButton, InputAdornment, TextField, Theme, Tooltip, withStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SearchIcon from '@material-ui/icons/Search';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import React from 'react';
import {
    EvaluationOfPlayerInput,
    GameConfig,
    GameRound,
    GameRoundEvaluation,
    PlayerInput,
    PlayerInputEvaluation,
} from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import {
    getMinNumberOfMarkedAsInvalid as getMinNumberOfNecessaryMarkedAsInvalid,
    getNumberOfInvalids,
    getPlayersInAlphabeticalOrder,
    getRejectingPlayers,
} from '../../utils/game.utils';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import { SectionHeader } from '../SectionHeader/SectionHeader';

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: -3,
            top: '100%',
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }),
)(Badge);

interface PhaseEvaluateRoundProps {
    allPlayers: Map<string, PlayerInfo>;
    currentRound: number;
    currentRoundEvaluation: GameRoundEvaluation;
    gameConfig: GameConfig;
    gameRounds: GameRound[];
    /** Player info for the user of this instance of the "Stadt-Land-Fluss" app. */
    playerInfo: PlayerInfo;
    updateEvaluationOfPlayerInput: (newEvaluation: EvaluationOfPlayerInput) => void;
    sendEvaluationFinishedMessage: () => void;
}
const PhaseEvaluateRound: React.FunctionComponent<PhaseEvaluateRoundProps> = props => {
    const { allPlayers, currentRound, currentRoundEvaluation, gameConfig, playerInfo } = props;
    const minNumberOfInvalids = getMinNumberOfNecessaryMarkedAsInvalid(allPlayers.size);
    // Retrieve data for finished round; e.g. if current round is 1, then data is at index 0.
    const finishedGameRound = props.gameRounds[currentRound - 1];
    const currentLetter = gameConfig.letters[currentRound - 1];
    const sortedPlayers = getPlayersInAlphabeticalOrder(allPlayers);

   /**
     * Toggles the user's evaluation of a player's input for a category.
     */
    const handleEvaluationButtonClick = (
        categoryIndex: number, evaluatedPlayerId: string, currentEvaluation: boolean
    ) => {
        props.updateEvaluationOfPlayerInput({ categoryIndex, evaluatedPlayerId, markedAsValid: !currentEvaluation });
    }
    /**
     * Displays a button that allows the user to reject a player's input for a category.
     * A badge attached to the button shows the total number of rejections. If the player
     * didn't type any text, then a not clickable thumb down icon is shown instead,
     * which indicates that the input was automatically rejected by the application.
     */
    const createEvaluationButton = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const allEvaluationsForPlayer = currentRoundEvaluation.get(evaluatedPlayer.id) as PlayerInputEvaluation[];
        const evaluationForCategory = allEvaluationsForPlayer[categoryIndex];
        const isInputAcceptedByUser = evaluationForCategory.get(playerInfo.id) as boolean;
        const rejectingPlayers = getRejectingPlayers(evaluationForCategory, allPlayers);
        const tooltipText = rejectingPlayers.length === 0 ? 'Keine Ablehnungen' :
            'Abgelehnt von ' + rejectingPlayers.map(p => p.name).join(', ');
        const hasPlayerTypedText = !!(finishedGameRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text;
        return (
            <div
                key={`slf-evaluation-button-wrapper-${categoryIndex}-${indexInSortedPlayers}`}
                className="slf-evaluation-button-wrapper"
            >
                {hasPlayerTypedText ? (
                    <Tooltip
                        key={`slf-evaluation-tooltip-${categoryIndex}-${indexInSortedPlayers}`}
                        title={tooltipText}
                    >
                        <IconButton
                            className="slf-evaluation-button"
                            color={isInputAcceptedByUser ? 'default' : 'secondary'}
                            onClick={() => handleEvaluationButtonClick(categoryIndex, evaluatedPlayer.id, isInputAcceptedByUser)}
                        >
                            <StyledBadge badgeContent={rejectingPlayers.length} color="secondary">
                                <ThumbDownRoundedIcon />
                            </StyledBadge>
                        </IconButton>
                    </Tooltip>
                ) : (
                        <Tooltip
                            key={`slf-evaluation-tooltip-${categoryIndex}-${indexInSortedPlayers}`}
                            title="Automatisch abgelehnt"
                        >
                            <ThumbDownRoundedIcon color="secondary" className="slf-auto-reject-icon" />
                        </Tooltip>
                    )}
            </div>
        );
    }
    /**
     * Creates a search link for a specific category and player input.
     */
    const createSearchLink = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const category = gameConfig.categories[categoryIndex];
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const playerInput = (finishedGameRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text;
        const searchLink = `https://www.ecosia.org/search?q=${encodeURIComponent(category)}+${encodeURIComponent(playerInput)}`
        return (
            <div
                key={`slf-search-link-container-${categoryIndex}-${indexInSortedPlayers}`}
                className="slf-search-link-container"
            >
                <a
                    key={`slf-evaluation-search-link-${categoryIndex}-${indexInSortedPlayers}`}
                    className="slf-evaluation-search-link"
                    href={searchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Begriff nachschlagen"
                >
                    <Tooltip
                        title="Begriff nachschlagen"
                        placement="right"
                    >
                        <SearchIcon color="primary" />
                    </Tooltip>
                </a>
            </div>
        );
    }
    /**
     * Creates a text input showing the player's input for a category. If the player input isn't an empty string,
     * then on the right side of the textfield a search link and clickable evaluation button are displayed.
     */
    const playerEvaluationElements = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const hasPlayerTypedText = !!(finishedGameRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text;
        const isInputValid = getNumberOfInvalids((currentRoundEvaluation.get(evaluatedPlayer.id) as PlayerInputEvaluation[])[categoryIndex]) < minNumberOfInvalids;
        return (
            <div
                key={`slf-evaluation-textfield-wrapper-${categoryIndex}-${indexInSortedPlayers}`}
                className="slf-evaluation-textfield-wrapper"
            >
                <TextField
                    key={'slf-textfield-category-no-' + categoryIndex + '-player-' + indexInSortedPlayers}
                    value={(finishedGameRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{evaluatedPlayer.name}:</InputAdornment>,
                        className: !hasPlayerTypedText || !isInputValid ? 'invalid-player-input' : ''
                    }}
                />
                {hasPlayerTypedText ? createSearchLink(categoryIndex, indexInSortedPlayers) : null}
                {createEvaluationButton(categoryIndex, indexInSortedPlayers)}
            </div>
        );
    }
    /**
     * Creates a section for each category of the current game. It displays the category in the header,
     * followed by one textfield for each player showing their input for the finished round.
     * If the input isn't empty, a search link and clickable evaluation button are displayed.
     */
    const createCategorySection = (category: string, categoryIndex: number): JSX.Element => (
        <div
            key={'slf-evaluation-for-category-no-' + categoryIndex}
            className="material-card-style"
        >
            <SectionHeader showDivider={false} text={category}></SectionHeader>
            {sortedPlayers.map((_, indexInSortedPlayers) => playerEvaluationElements(categoryIndex, indexInSortedPlayers))}
        </div>
    );

    return (
        <React.Fragment>
            <GameRoundChip
                currentLetter={currentLetter}
                currentRound={currentRound}
                numberOfRounds={gameConfig.numberOfRounds}
            />
            <form className="app-form" noValidate autoComplete="off">
                {gameConfig.categories.map(createCategorySection)}
                <IconButton
                    type="button"
                    className="fixed-bottom-right-button"
                    color="secondary"
                    title="Akzeptieren"
                    aria-label="Akzeptieren"
                    onClick={() => props.sendEvaluationFinishedMessage()}
                >
                    <CheckCircleIcon />
                </IconButton>
            </form>
        </React.Fragment>
    );
}

export default PhaseEvaluateRound;
