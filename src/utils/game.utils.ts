import { cloneDeep } from 'lodash';
import randomnItem from 'random-item';
import { STANDARD_POINTS } from '../constants/game.constant';
import { Collection } from '../models/collection.interface';
import { PlayerInput } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { GameResultForPlayer, GameRound, GameRoundEvaluation, PlayerInputEvaluation } from './../models/game.interface';
import { createAndFillArray } from './general.utils';

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
    return createAndFillArray<PlayerInput>(numberOfInputs, { isMarkedCreative: false, points: STANDARD_POINTS, text: '', valid: true });
}

 /**
 * Checks each PlayerInput object whether it contains text.
 * If text string is empty, valid is set to false, otherwise to true.
 */
export const markEmptyPlayerInputsAsInvalid = (playerInputs: PlayerInput[]): PlayerInput[] => {
    return playerInputs.map(input => ({ ...input, valid: !!input.text }));
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
 * Determines the minimum number of players that need to mark a player's input as invalid
 * for the input text to be set to invalid and not count as a point for the player.
 */
export const getMinNumberOfMarkedAsInvalid = (numberOfPlayers: number): number => {
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

export const processPlayerInputEvaluations = (
    gameRound: GameRound, roundEvaluation: GameRoundEvaluation, minNumberOfInvalids: number
): GameRound => {
    const evaluatedGameRound = cloneDeep(gameRound);
    evaluatedGameRound.forEach((playerInputs, playerId) => {
        const evaluations = roundEvaluation.get(playerId) as PlayerInputEvaluation[];
        for (let i = 0; i < playerInputs.length; i++) {
            // Only process evaluations for inputs that were not
            // already marked as invalid because of being empty strings.
            if (playerInputs[i].valid) {
                playerInputs[i].valid = getNumberOfInvalids(evaluations[i]) < minNumberOfInvalids;
            }
        }
    });
    return evaluatedGameRound;
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
            const points = playerInputs.reduce((total, input) => input.valid ? total + 1 : total, 0);
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
