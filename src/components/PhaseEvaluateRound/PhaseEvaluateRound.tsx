import { Badge, Box, Chip, createStyles, Divider, IconButton, Theme, Tooltip, withStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import React, { useState } from 'react';

import { EXTRA_POINTS } from '../../constants/game.constant';
import {
    EvaluationOfPlayerInput,
    GameConfig,
    GameRound,
    GameRoundEvaluation,
    IsPlayerInputVeryCreativeStatus,
    PlayerInput,
    PlayerInputEvaluation,
} from '../../models/game.interface';
import { PlayerInfo } from '../../models/player.interface';
import { getPlayersInAlphabeticalOrder, getRejectingPlayers } from '../../utils/game.utils';
import { joinWithAnd } from '../../utils/general.utils';
import GameRoundChip from '../GameRoundChip/GameRoundChip';
import styles from './PhaseEvaluateRound.module.css';

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
    playersThatFinishedEvaluation: Map<string, boolean>;
    sendEvaluationFinishedMessage: () => void;
    updateEvaluationOfPlayerInput: (newEvaluation: EvaluationOfPlayerInput) => void;
    updateIsPlayerInputVeryCreativeStatus: (newStatus: IsPlayerInputVeryCreativeStatus) => void;
}
const PhaseEvaluateRound: React.FunctionComponent<PhaseEvaluateRoundProps> = props => {
    const [hasFinishedEvaluation, setHasFinishedEvaluation] = useState(props.playersThatFinishedEvaluation.has(props.playerInfo.id));
    const { allPlayers, currentRound, currentRoundEvaluation, gameConfig, playerInfo, playersThatFinishedEvaluation } = props;
    // Retrieve data for finished round; e.g. if current round is 1, then data is at index 0.
    const finishedRound = props.gameRounds[currentRound - 1];
    const currentLetter = gameConfig.letters[currentRound - 1];
    const sortedPlayers = getPlayersInAlphabeticalOrder(allPlayers);
    const notFinishedPlayers: string[] = [];
    sortedPlayers.forEach(player => {
        if (!playersThatFinishedEvaluation.has(player.id)) {
            notFinishedPlayers.push(player.name);
        }
    });

    /**
      * Toggles the user's evaluation of a player's input for a category.
      */
    const handleEvaluationButtonClick = (
        categoryIndex: number, evaluatedPlayerId: string, currentEvaluation: boolean
    ) => {
        props.updateEvaluationOfPlayerInput({ categoryIndex, evaluatedPlayerId, markedAsValid: !currentEvaluation });
    };

    /**
     * Displays a button that allows the user to reject a player's input for a category.
     * A badge attached to the button shows the total number of rejections. If the player
     * didn't type any text, then a not clickable thumb down icon is shown instead,
     * which indicates that the input was automatically rejected by the application.
     */
    const createEvaluationButtonOrIcon = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const allEvaluationsForPlayer = currentRoundEvaluation.get(evaluatedPlayer.id) as PlayerInputEvaluation[];
        const evaluationForCategory = allEvaluationsForPlayer[categoryIndex];
        const isInputAcceptedByUser = evaluationForCategory.get(playerInfo.id) as boolean;
        const rejectingPlayers = getRejectingPlayers(evaluationForCategory, allPlayers);
        const tooltipText = rejectingPlayers.length === 0 ? 'Keine Ablehnungen' :
            'Abgelehnt von ' + joinWithAnd(rejectingPlayers.map(p => p.name), 'und');
        const hasPlayerTypedText = !!(finishedRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text;

        const createEvaluationButton = () => {
            const evaluationButton = (
                <IconButton
                    className="slf-evaluation-button"
                    color={isInputAcceptedByUser ? 'default' : 'secondary'}
                    size="small"
                    aria-label={isInputAcceptedByUser ? 'Antwort ablehnen' : 'Antwort akzeptieren'}
                    disabled={hasFinishedEvaluation}
                    onClick={() => handleEvaluationButtonClick(categoryIndex, evaluatedPlayer.id, isInputAcceptedByUser)}
                >
                    <StyledBadge badgeContent={rejectingPlayers.length} color="secondary">
                        <ThumbDownRoundedIcon />
                    </StyledBadge>
                </IconButton>
            );
            return hasFinishedEvaluation ? evaluationButton
                : (
                    <Tooltip
                        key={`slf-evaluation-tooltip-${categoryIndex}-${indexInSortedPlayers}`}
                        title={tooltipText}
                        arrow
                    >
                        {evaluationButton}
                    </Tooltip>
                );
        };
        const createAutoRejectIcon = () => (
            <Tooltip
                key={`slf-evaluation-tooltip-${categoryIndex}-${indexInSortedPlayers}`}
                title="Automatisch abgelehnt"
                arrow
            >
                <ThumbDownRoundedIcon color={hasFinishedEvaluation ? 'disabled' : 'secondary'} className={styles.auto_reject_icon} />
            </Tooltip>
        );
        return hasPlayerTypedText ? createEvaluationButton() : createAutoRejectIcon();
    };

    /**
      * Toggles the "marked as very creative" status of a player's input for a category.
      */
    const handleMarkAsCreativeAnswerToggleClick = (
        categoryIndex: number, evaluatedPlayerId: string, isMarkedAsCreative: boolean
    ) => {
        props.updateIsPlayerInputVeryCreativeStatus({ categoryIndex, evaluatedPlayerId, markedAsCreative: !isMarkedAsCreative });
    };

    /**
     * Creates a "mark as creative answer" toggle button for a specific category and player input.
     */
    const createMarkAsCreativeAnswerToggle = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const playerInput = (finishedRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex];
        const isDisabled = hasFinishedEvaluation || evaluatedPlayer.id === props.playerInfo.id;
        const iconColor = hasFinishedEvaluation ? 'disabled' : 'primary';
        const createButton = () => (
            <IconButton
                color="primary"
                size="small"
                disabled={isDisabled}
                onClick={() => handleMarkAsCreativeAnswerToggleClick(categoryIndex, evaluatedPlayer.id, playerInput.star)}
            >
                {playerInput.star ? <StarIcon color={iconColor} /> : <StarBorderIcon color={iconColor} />}
            </IconButton>
        );
        return isDisabled ? createButton() : (
            <Tooltip
                title={playerInput.star ? 'Kreativ-Markierung aufheben' : 'Als besonders kreativ markieren'}
                placement="bottom"
                arrow
            >
                {createButton()}
            </Tooltip>
        );
    };

    /**
     * Creates a search link for a specific category and player input.
     */
    const createSearchLink = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const category = gameConfig.categories[categoryIndex];
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const playerInput = (finishedRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex].text;
        const searchLink = `https://www.ecosia.org/search?q=${encodeURIComponent(category)}+${encodeURIComponent(playerInput)}`;
        return (
            <a
                className={styles.search_link}
                href={searchLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Begriff nachschlagen"
            >
                <Tooltip
                    title="Begriff nachschlagen"
                    placement="bottom"
                    arrow
                >
                    <SearchIcon color="primary" />
                </Tooltip>
            </a>
        );
    };

    const calculatePoints = (evaluatedPlayerInput: PlayerInput): number => {
        return gameConfig.scoringOptions.creativeAnswersExtraPoints && evaluatedPlayerInput.star
            ? evaluatedPlayerInput.points + EXTRA_POINTS : evaluatedPlayerInput.points;
    };
    const createPointsChip = (evaluatedPlayerInput: PlayerInput): JSX.Element => {
        const label = '+' + (evaluatedPlayerInput.valid ? calculatePoints(evaluatedPlayerInput) : 0);
        const color = evaluatedPlayerInput.valid ? 'primary' : 'default';
        return (
            <div className={styles.points_wrapper}>
                <Chip label={label} color={color} classes={{ root: styles.points }} />
                <span className="sr-only">Punkte</span>
            </div>
        );
    };

    /**
     * Shows the player's input for a category. If the player input isn't an empty string, then on the right upper
     * side of the textfield a search link, "mark as creative" button and evaluation button are displayed.
     */
    const playerEvaluationElements = (categoryIndex: number, indexInSortedPlayers: number): JSX.Element => {
        const evaluatedPlayer = sortedPlayers[indexInSortedPlayers];
        const evaluatedPlayerInput = (finishedRound.get(evaluatedPlayer.id) as PlayerInput[])[categoryIndex];
        const hasPlayerTypedText = !!evaluatedPlayerInput.text;
        const isInputValid = evaluatedPlayerInput.valid;
        const isCreativeAnswer = isInputValid && evaluatedPlayerInput.star;
        const emptyAnswerHint = <span className="sr-only">Leere Antwort wurde automatisch abgelehnt.</span>;
        const answerRejectedHint = <span className="sr-only">Antwort wurde abgelehnt.</span>;
        const markedCreativeHint = <span className="sr-only">Antwort wurde als besonders kreativ markiert.</span>;
        return (
            <div
                key={`slf-answer-box-wrapper-${categoryIndex}-${indexInSortedPlayers}`}
                role="listitem"
                className={styles.answer_box_wrapper}
            >
                <Box
                    boxShadow={1}
                    tabIndex={0}
                    className={isCreativeAnswer ? styles.answer_box_creative : styles.answer_box}
                >

                    <p className={styles.player_name}>
                        <span className="sr-only">Antwort von</span>
                        {evaluatedPlayer.name}
                        <span className="sr-only">:</span>
                    </p>
                    <Divider light aria-hidden="true" />
                    <p
                        className={isInputValid ? styles.answer : styles.invalid_answer}
                        aria-hidden={!hasPlayerTypedText}
                    >
                        {hasPlayerTypedText ? evaluatedPlayerInput.text : '(leer)'}
                        <span className="sr-only">.</span>
                    </p>
                    {!hasPlayerTypedText ? emptyAnswerHint : null}
                    {hasPlayerTypedText && !isInputValid ? answerRejectedHint : null}
                    {isCreativeAnswer ? markedCreativeHint : null}
                    {createPointsChip(evaluatedPlayerInput)}
                </Box>
                <div className={styles.button_wrapper}>
                    {hasPlayerTypedText ? createSearchLink(categoryIndex, indexInSortedPlayers) : null}
                    {isInputValid ? createMarkAsCreativeAnswerToggle(categoryIndex, indexInSortedPlayers) : null}
                    {createEvaluationButtonOrIcon(categoryIndex, indexInSortedPlayers)}
                </div>
            </div>
        );
    };

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
            <h3
                id={'slf-category-no-' + categoryIndex}
                className="section-header"
            >{category}</h3>
            <div
                role="list"
                aria-labelledby={'slf-category-no-' + categoryIndex}
            >
                {sortedPlayers.map((_, indexInSortedPlayers) => playerEvaluationElements(categoryIndex, indexInSortedPlayers))}
            </div>
        </div>
    );

    const onAcceptEvaluationButtonClick = () => {
        setHasFinishedEvaluation(true);
        props.sendEvaluationFinishedMessage();
    };

    return (
        <React.Fragment>
            <GameRoundChip
                currentLetter={currentLetter}
                currentRound={currentRound}
                isEvaluationPhase={true}
                numberOfRounds={gameConfig.numberOfRounds}
            />
            {gameConfig.categories.map(createCategorySection)}
            <div className="material-card-style">
                Bestätigung ausstehend: <span className="bold-text">{notFinishedPlayers.join(', ')}</span>
            </div>
            <IconButton
                type="button"
                className="fixed-bottom-right-button"
                title="Bestätigen"
                aria-label="Bestätigen"
                disabled={hasFinishedEvaluation}
                onClick={onAcceptEvaluationButtonClick}
            >
                {hasFinishedEvaluation ? <CheckCircleIcon color="secondary" /> : <RadioButtonUncheckedIcon color="secondary" />}
            </IconButton>
        </React.Fragment>
    );
};

export default PhaseEvaluateRound;
