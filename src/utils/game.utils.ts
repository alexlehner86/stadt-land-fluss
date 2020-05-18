import { cloneDeep, some } from 'lodash';
import randomnItem from 'random-item';
import { ONLY_ANSWER_POINTS, SAME_WORD_POINTS, STANDARD_POINTS } from '../constants/game.constant';
import { Collection } from '../models/collection.interface';
import { GameConfigScoringOptions, PlayerInput } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { GameResultForPlayer, GameRound, GameRoundEvaluation, PlayerInputEvaluation } from './../models/game.interface';
import { createAndFillArray } from './general.utils';
import { getRunningGameRoundFromLocalStorage } from './local-storage.utils';

/**
* Returns an array of unique letters. The number of letters is defined by the parameter numberOfLetters.
* If the second argument is not provided, then the standard alphabet (excluding Q, X and Y) is used.
*/
export const getRandomnLetters = (numberOfLetters: number, possibleLetters: string[]): string[] => {
    if (numberOfLetters > possibleLetters.length) {
        throw new Error('Cannot create more randomn unique letters than the number of possibleLetters provided!');
    }
    const randomnLetters: string[] = [];
    let lettersToRandomnlySelectFrom = [...possibleLetters];
    for (let i = 0; i < numberOfLetters; i++) {
        const randomnLetter = randomnItem(lettersToRandomnlySelectFrom);
        randomnLetters.push(randomnLetter);
        lettersToRandomnlySelectFrom = lettersToRandomnlySelectFrom.filter(letter => letter !== randomnLetter);
    }
    return randomnLetters;
};

export const getPlayersInAlphabeticalOrder = (players: Map<string, PlayerInfo>): PlayerInfo[] => {
    let playerInfoArray = Array.from(players).map(data => data[1]);
    return playerInfoArray.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
        if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
        return 0;
    });
}

/**
 * Returns an array of PlayerInput objects with empty strings and default settings (isMarkedCreative=false, valid=true, standard points).
 */
export const getEmptyRoundInputs = (numberOfInputs: number): PlayerInput[] => {
    return createAndFillArray<PlayerInput>(numberOfInputs, { points: STANDARD_POINTS, star: false, text: '', valid: true });
}

/**
* Checks each PlayerInput object whether it contains text.
* If text string is empty, valid is set to false, otherwise to true.
* The text is also trimmed in order to support correct scoring (finding duplicates).
*/
export const markEmptyPlayerInputsAsInvalid = (playerInputs: PlayerInput[]): PlayerInput[] => {
    return playerInputs.map(input => ({ ...input, text: input.text.trim(), valid: !!input.text }));
};

export const createGameRoundEvaluation = (players: Map<string, PlayerInfo>, categories: string[]): GameRoundEvaluation => {
    const gameRoundEvaluation = new Map<string, PlayerInputEvaluation[]>();
    players.forEach(evaluatedPlayer => {
        const evaluationsForAllCategories: PlayerInputEvaluation[] = [];
        categories.forEach(_ => {
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
 */
export const calculatePointsForRound = (scoringOptions: GameConfigScoringOptions, round: GameRound) => {
    if (!scoringOptions.checkForDuplicates && !scoringOptions.onlyPlayerWithValidAnswer) { return; }
    const playerId = round.keys().next().value;
    const playerInputsOfPlayer1 = round.get(playerId) as PlayerInput[];
    // Loop through all categories.
    for (let categoryIndex = 0; categoryIndex < playerInputsOfPlayer1.length; categoryIndex++) {
        calculatePointsForCategory(scoringOptions, round, categoryIndex);
    }
}

/**
 * Calculates the points for the round's inputs for one category according to the active scoring options.
 */
export const calculatePointsForCategory = (scoringOptions: GameConfigScoringOptions, round: GameRound, categoryIndex: number) => {
    if (!scoringOptions.checkForDuplicates && !scoringOptions.onlyPlayerWithValidAnswer) { return; }
    Array.from(round.keys()).forEach(playerId => {
        const playerInputs = round.get(playerId) as PlayerInput[];
        // Only check valid inputs.
        if (playerInputs[categoryIndex].valid) {
            if (scoringOptions.onlyPlayerWithValidAnswer && isOnlyPlayerWithValidAnswer(playerId, round, categoryIndex)) {
                playerInputs[categoryIndex].points = ONLY_ANSWER_POINTS;
            } else {
                if (scoringOptions.checkForDuplicates && isDuplicateOfOtherPlayersInput(playerId, round, categoryIndex)) {
                    playerInputs[categoryIndex].points = SAME_WORD_POINTS;
                } else {
                    playerInputs[categoryIndex].points = STANDARD_POINTS;
                }
            }
        }
    });
}

export const isOnlyPlayerWithValidAnswer = (playerId: string, round: GameRound, categoryIndex: number): boolean => {
    const otherPlayersIds = Array.from(round.keys()).filter(id => id !== playerId);
    let isOnlyPlayer = true;
    otherPlayersIds.forEach(id => isOnlyPlayer = isOnlyPlayer && !(round.get(id) as PlayerInput[])[categoryIndex].valid);
    return isOnlyPlayer;
}

/**
 * Returns true if a duplicate (removes all non-alphanumeric characters for comparison) for playerId's input was found.
 */
export const isDuplicateOfOtherPlayersInput = (playerId: string, round: GameRound, categoryIndex: number): boolean => {
    const otherPlayersIds = Array.from(round.keys()).filter(id => id !== playerId);
    const playerInputText = (round.get(playerId) as PlayerInput[])[categoryIndex].text.toLowerCase().replace(/[^0-9a-z]/gi, '');
    return some(otherPlayersIds, id => {
        const otherPlayersInput = (round.get(id) as PlayerInput[])[categoryIndex];
        return otherPlayersInput.valid && playerInputText === otherPlayersInput.text.toLowerCase().replace(/[^0-9a-z]/gi, '');
    });
}

/**
 * Determines the minimum number of players that need to mark a player's input as invalid
 * for the input text to be set to invalid and not count as a point for the player.
 */
export const getMinNumberOfInvalids = (numberOfPlayers: number): number => {
    return numberOfPlayers <= 3 ? 1 : 2;
};

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
    return getPlayersInAlphabeticalOrder(rejectingPlayers);;
};

/**
 * Calculates game results and sorts them by points in descending order.
 */
export const calculateGameResults = (allPlayers: Map<string, PlayerInfo>, gameRounds: GameRound[]): GameResultForPlayer[] => {
    const gameResults: GameResultForPlayer[] = [];
    const pointsPerPlayer: Collection<GameResultForPlayer> = {};
    allPlayers.forEach((playerInfo, playerId) => pointsPerPlayer[playerId] = { playerName: playerInfo.name, points: 0 });
    gameRounds.forEach(round => {
        round.forEach((playerInputs, playerId) => {
            const points = playerInputs.reduce((total, input) => input.valid ? total + input.points : total, 0);
            pointsPerPlayer[playerId].points += points;
        });
    });
    Object.keys(pointsPerPlayer).forEach(playerId => gameResults.push(pointsPerPlayer[playerId]));
    return gameResults.sort((a, b) => b.points - a.points);
}

export const shouldUserRespondToRequestGameDataMessage = (user: PlayerInfo, allPlayers: Map<string, PlayerInfo>, requestingPlayerId: string): boolean => {
    // User should not respond to their own message.
    if (user.id === requestingPlayerId) { return false; }
    // If user is admin, then they should respond to the message.
    if (user.isAdmin) { return true; }
    // If the requesting user is the admin, then an algorithm determines who of
    // the remaining players is the one to respond to the admin's message.
    const requestingPlayerInfo = allPlayers.get(requestingPlayerId);
    if (requestingPlayerInfo && requestingPlayerInfo.isAdmin) {
        const playersWithoutRequestingPlayer = cloneDeep(allPlayers);
        playersWithoutRequestingPlayer.delete(requestingPlayerId);
        const playersSortedById = Array.from(playersWithoutRequestingPlayer).map(data => data[1]).sort((a, b) => {
            if (a.id < b.id) { return -1; }
            if (a.id > b.id) { return 1; }
            return 0;
        });
        return playersSortedById[0].id === user.id;
    }
    return false;
};

/**
 * Transforms the GameRoundEvaluation object from a nested Map into a nested array.
 * The order of the players in sortedPlayers defines the order of the information in the arrays.
 */
export const compressGameRoundEvaluation = (gameRoundEvaluation: GameRoundEvaluation, sortedPlayers: PlayerInfo[]): boolean[][][] => {
    const evaluationsAsArrays = new Map<string, boolean[][]>();
    gameRoundEvaluation.forEach((data, playerId) => {
        evaluationsAsArrays.set(playerId, data.map(item => {
            const booleanArray: boolean[] = [];
            sortedPlayers.forEach(player => booleanArray.push(item.get(player.id) as boolean));
            return booleanArray;
        }));
    });
    const compressedGameRoundEvaluation: boolean[][][] = [];
    sortedPlayers.forEach(player => compressedGameRoundEvaluation.push(evaluationsAsArrays.get(player.id) as boolean[][]));
    return compressedGameRoundEvaluation;
};

/**
 * Transforms the GameRoundEvaluation object from a nested array into a nested Map.
 * The order of the players in sortedPlayers defines the order of the information in the arrays.
 */
export const decompressGameRoundEvaluation = (compressedData: boolean[][][], sortedPlayers: PlayerInfo[]): GameRoundEvaluation => {
    const gameRoundEvaluation: GameRoundEvaluation = new Map<string, PlayerInputEvaluation[]>();
    sortedPlayers.forEach((evaluatedPlayer, evaluatedPlayerIndex) => {
        const evaluations: PlayerInputEvaluation[] = compressedData[evaluatedPlayerIndex].map(playerData => {
            const playerInputEvaluation = new Map<string, boolean>();
            sortedPlayers.forEach((evaluatingPlayer, evaluatingPlayerIndex) => playerInputEvaluation.set(evaluatingPlayer.id, playerData[evaluatingPlayerIndex]));
            return playerInputEvaluation;
        });
        gameRoundEvaluation.set(evaluatedPlayer.id, evaluations);
    });
    return gameRoundEvaluation;
};

export const restoreGameRoundsOfRunningGameFromLocalStorage = (numberOfRoundsToRestore: number): GameRound[] => {
    const gameRounds: GameRound[] = [];
    for (let round = 1; round <= numberOfRoundsToRestore; round++) {
        const data = getRunningGameRoundFromLocalStorage(round);
        if (data) {
            gameRounds.push(data);
        }
    }
    return gameRounds;
};

/**
 * Sets points and validity of player inputs for player who is rejoining the game in evaluation phase.
 */
export const setPointsAndValidityOfPlayerInputs = (
    scoringOptions: GameConfigScoringOptions, gameRoundEvaluation: GameRoundEvaluation, minNumberOfInvalids: number, round: GameRound
) => {
    // First evaluate validity
    round.forEach((playerInputs, playerId) => {
        const evaluations = gameRoundEvaluation.get(playerId) as PlayerInputEvaluation[];
        playerInputs.forEach((input, categoryIndex) => {
            // Only evaluate validity for originally valid inputs (not empty text inputs).
            if (input.valid) {
                input.valid = getNumberOfInvalids(evaluations[categoryIndex]) < minNumberOfInvalids;
            }
        });
    });
    // Second calculate points
    calculatePointsForRound(scoringOptions, round);
};
