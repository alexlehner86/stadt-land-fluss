import { some, uniq } from 'lodash';
import randomnItem from 'random-item';

import { ONLY_ANSWER_POINTS, SAME_WORD_POINTS, STANDARD_POINTS } from '../constants/game.constant';
import { Collection } from '../models/collection.interface';
import { GameConfigScoringOptions, HallOfFameEntry, PlayerInput } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { EXTRA_POINTS } from './../constants/game.constant';
import {
    GameConfig,
    GameResultsGroup,
    GameRound,
    GameRoundEvaluation,
    PlayerInputEvaluation,
} from './../models/game.interface';
import { createAndFillArray, getCleanText } from './general.utils';

/**
* Returns an array of randomly selected, unique letters.
*/
export const getRandomLetters = (numberOfLetters: number, possibleLetters: string[]): string[] => {
    if (numberOfLetters > possibleLetters.length) {
        throw new Error('Cannot create more randomn unique letters than the number of possibleLetters provided!');
    }
    const randomnLetters: string[] = [];
    let lettersToSelectFrom = [...possibleLetters];
    for (let i = 0; i < numberOfLetters; i++) {
        const randomnLetter = randomnItem(lettersToSelectFrom);
        randomnLetters.push(randomnLetter);
        lettersToSelectFrom = lettersToSelectFrom.filter(letter => letter !== randomnLetter);
    }
    return randomnLetters;
};

/**
* Returns an array of randomly selected categories.
*/
export const getRandomCategories = (
    numberOfCategories: number, categoryPool: string[], preselectedCategories: string[]
): string[] => {
    const randomCategories: string[] = [...preselectedCategories];
    const numberOfRandomSelections = numberOfCategories - preselectedCategories.length;
    let categoriesToSelectFrom = categoryPool.filter(category => !preselectedCategories.includes(category));
    for (let i = 0; i < numberOfRandomSelections; i++) {
        const randomCategory = randomnItem(categoriesToSelectFrom);
        randomCategories.push(randomCategory);
        categoriesToSelectFrom = categoriesToSelectFrom.filter(c => c !== randomCategory);
    }
    return randomCategories;
};

export const getPlayersInAlphabeticalOrder = (players: Map<string, PlayerInfo>): PlayerInfo[] => {
    const playerInfoArray = Array.from(players).map(data => data[1]);
    return playerInfoArray.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
    });
};

/**
 * Returns an array of PlayerInput objects with empty strings and default settings (standard points, stars=0, valid=true).
 */
export const getEmptyRoundInputs = (numberOfInputs: number): PlayerInput[] => {
    return createAndFillArray<PlayerInput>(numberOfInputs, { points: STANDARD_POINTS, stars: 0, text: '', valid: true });
};

/**
* Checks each PlayerInput object whether it contains text.
* If text string is empty, valid is set to false, otherwise to true.
* The text is also trimmed in order to support correct scoring (finding duplicates).
*/
export const markEmptyPlayerInputsAsInvalid = (playerInputs: PlayerInput[]): PlayerInput[] => {
    return playerInputs.map(input => {
        const trimmedText = input.text.trim();
        return { ...input, text: trimmedText, valid: trimmedText !== '' };
    });
};

export const createGameRoundEvaluation = (players: Map<string, PlayerInfo>, categories: string[]): GameRoundEvaluation => {
    const gameRoundEvaluation = new Map<string, PlayerInputEvaluation[]>();
    players.forEach(evaluatedPlayer => {
        const evaluationsForAllCategories: PlayerInputEvaluation[] = [];
        categories.forEach(() => {
            const evaluationForOneCategory: PlayerInputEvaluation = new Map<string, boolean>();
            players.forEach(evaluatingPlayer => {
                // The default evaluation for each input is valid (= true).
                evaluationForOneCategory.set(evaluatingPlayer.id, true);
            });
            evaluationsForAllCategories.push(evaluationForOneCategory);
        });
        gameRoundEvaluation.set(evaluatedPlayer.id, evaluationsForAllCategories);
    });
    return gameRoundEvaluation;
};

/**
 * Calculates the points for the round's inputs according to the active scoring options.
 * `equalAnswers`: The answers manually marked equal by the admin for each category (key = index).
 */
export const calculatePointsForRound = (
    scoringOptions: GameConfigScoringOptions, round: GameRound, equalAnswers: Map<number, string[]>
): void => {
    if (!scoringOptions.checkForDuplicates && !scoringOptions.onlyPlayerWithValidAnswer) { return; }
    const playerId = round.keys().next().value;
    const playerInputsOfPlayer1 = round.get(playerId) as PlayerInput[];
    // Loop through all categories.
    for (let categoryIndex = 0; categoryIndex < playerInputsOfPlayer1.length; categoryIndex++) {
        calculatePointsForCategory(scoringOptions, round, categoryIndex, equalAnswers.get(categoryIndex));
    }
};

/**
 * Calculates the points for the round's inputs for one category according to the active scoring options.
 * `equalAnswersForCategory`: The answers manually marked equal by the admin.
 */
export const calculatePointsForCategory = (
    scoringOptions: GameConfigScoringOptions, round: GameRound, categoryIndex: number, equalAnswersForCategory: string[] = []
): void => {
    if (!scoringOptions.checkForDuplicates && !scoringOptions.onlyPlayerWithValidAnswer) { return; }
    Array.from(round.keys()).forEach(playerId => {
        const playerInputs = round.get(playerId) as PlayerInput[];
        // Only check valid inputs.
        if (playerInputs[categoryIndex].valid) {
            if (scoringOptions.onlyPlayerWithValidAnswer && isOnlyPlayerWithValidAnswer(playerId, round, categoryIndex)) {
                playerInputs[categoryIndex].points = ONLY_ANSWER_POINTS;
            } else {
                const awardSameWordPoints = scoringOptions.checkForDuplicates
                    && isDuplicateOfOtherPlayersInput(playerId, round, categoryIndex, equalAnswersForCategory);
                playerInputs[categoryIndex].points = awardSameWordPoints ? SAME_WORD_POINTS : STANDARD_POINTS;
            }
        }
    });
};

export const isOnlyPlayerWithValidAnswer = (playerId: string, round: GameRound, categoryIndex: number): boolean => {
    const otherPlayersIds = Array.from(round.keys()).filter(id => id !== playerId);
    let isOnlyPlayer = true;
    otherPlayersIds.forEach(id => isOnlyPlayer = isOnlyPlayer && !(round.get(id) as PlayerInput[])[categoryIndex].valid);
    return isOnlyPlayer;
};

/**
 * Returns true if a duplicate for playerId's input was found.
 * `equalAnswers`: The answers manually marked equal by the admin.
 */
export const isDuplicateOfOtherPlayersInput = (
    playerId: string, round: GameRound, categoryIndex: number, equalAnswers: string[]
): boolean => {
    const playerInputText = getCleanText((round.get(playerId) as PlayerInput[])[categoryIndex].text);
    const otherPlayersIds = Array.from(round.keys()).filter(id => id !== playerId);
    return equalAnswers.includes(playerInputText) || some(otherPlayersIds, id => {
        const otherPlayersInput = (round.get(id) as PlayerInput[])[categoryIndex];
        return otherPlayersInput.valid && playerInputText === getCleanText(otherPlayersInput.text);
    });
};

/**
 * Determines the minimum number of players that need to mark a player's input as invalid
 * for the input text to be set to invalid and not count as a point for the player.
 */
export const getMinNumberOfInvalids = (numberOfPlayers: number): number => numberOfPlayers <= 3 ? 1 : 2;

/**
 * Returns how many players marked the input as invalid.
 */
export const getNumberOfInvalids = (evaluations: PlayerInputEvaluation): number => {
    let count = 0;
    evaluations.forEach(markedAsValid => count = markedAsValid ? count : count + 1);
    return count;
};

/**
 * Returns the players that marked the input as invalid in alphabetical order. Parameters:
 * - evaluations: Evaluations of all players for one player's input for one category.
 * - players: All players taking part in the running game of "Stadt-Land-Fluss".
 */
export const getRejectingPlayers = (evaluations: PlayerInputEvaluation, players: Map<string, PlayerInfo>): PlayerInfo[] => {
    const rejectingPlayers = new Map<string, PlayerInfo>();
    evaluations.forEach((markedAsValid, playerId) => {
        if (!markedAsValid) {
            const playerInfo = players.get(playerId);
            if (playerInfo) {
                rejectingPlayers.set(playerId, playerInfo);
            }
        }
    });
    return getPlayersInAlphabeticalOrder(rejectingPlayers);
};

/**
 * Adds extra points for "creative answer" stars if scoring option is active
 * and sets invalid answer's points to zero.
 */
export const applyValidFlagAndCreativeStarsToPoints = (scoringOptions: GameConfigScoringOptions, round: GameRound): void => {
    round.forEach(playerInputs => {
        playerInputs.forEach(input => {
            if (!input.valid) {
                input.points = 0;
            } else if (scoringOptions.creativeAnswersExtraPoints && input.stars > 0) {
                input.points += EXTRA_POINTS * input.stars;
            }
        });
    });
};

/**
 * Calculates game results, groups them by points and sorts them in descending order.
 */
export const calculateGameResults = (allPlayers: Map<string, PlayerInfo>, gameRounds: GameRound[]): GameResultsGroup[] => {
    // 1. Calculate the points for each player.
    const gameResultForPlayer: Collection<{ name: string, points: number }> = {};
    allPlayers.forEach((playerInfo, playerId) => gameResultForPlayer[playerId] = { name: playerInfo.name, points: 0 });
    gameRounds.forEach(round => {
        round.forEach((inputs, playerId) => gameResultForPlayer[playerId].points += inputs.reduce((total, item) => total + item.points, 0));
    });
    // 2. Group the results by points.
    const allPoints: number[] = [];
    const gameResultsMap = new Map<number, string[]>();
    Object.keys(gameResultForPlayer).forEach(playerId => {
        const { name, points } = gameResultForPlayer[playerId];
        allPoints.push(points);
        const playerNames = gameResultsMap.get(points) || [];
        gameResultsMap.set(points, [...playerNames, name]);
    });
    // 3. Return the results groups sorted in descending order.
    const groupedGameResults: GameResultsGroup[] = [];
    uniq(allPoints)
        .sort((a, b) => b - a)
        .forEach(points => groupedGameResults.push({ playerNames: (gameResultsMap.get(points) as string[]).sort(), points }));
    return groupedGameResults;
};

/**
 * Creates a list of entries for the "Hall of Fame", the list of answers that received "creative answer" stars.
 */
export const createHallOfFameData = (allPlayers: Map<string, PlayerInfo>, gameConfig: GameConfig, gameRounds: GameRound[]): HallOfFameEntry[] => {
    const hallOfFameData: HallOfFameEntry[] = [];
    gameRounds.forEach(round => {
        round.forEach((playerInputs, playerId) => {
            const playerInfo = allPlayers.get(playerId) as PlayerInfo;
            playerInputs.forEach((playerInput, categoryIndex) => {
                if (playerInput.valid && playerInput.stars > 0) {
                    hallOfFameData.push({
                        category: gameConfig.categories[categoryIndex],
                        playerName: playerInfo.name,
                        text: playerInput.text
                    });
                }
            });
        });
    });
    return hallOfFameData;
};
