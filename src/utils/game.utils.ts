import { cloneDeep } from 'lodash';
import randomnItem from 'random-item';
import { ALPHABET_WITHOUT_QXY } from '../constants/game.constant';
import { PlayerInput } from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { GameResultForPlayer, GameRound, GameRoundEvaluation, PlayerInputEvaluation } from './../models/game.interface';

/**
* Returns an array of unique letters. The number of letters is defined by the parameter numberOfLetters.
* If the second argument is not provided, then the standard alphabet (excluding Q, X and Y) is used.
*/
export const getRandomnLetters = (numberOfLetters: number, possibleLetters = ALPHABET_WITHOUT_QXY): string[] => {
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
    return playerInfoArray.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
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
    const pointsPerPlayer: { [key: string]: GameResultForPlayer } = {};
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
