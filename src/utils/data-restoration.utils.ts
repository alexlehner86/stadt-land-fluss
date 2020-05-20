import { cloneDeep } from 'lodash';
import {
    GameConfigScoringOptions,
    GameRound,
    GameRoundEvaluation,
    PlayerInput,
    PlayerInputEvaluation,
} from '../models/game.interface';
import { PlayerInfo } from '../models/player.interface';
import { calculatePointsForRound, getNumberOfInvalids } from './game.utils';
import { getRunningGameRoundFromLocalStorage } from './local-storage.utils';

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

/**
 * Transforms the GameRoundEvaluation object from a nested Map into a nested array.
 * The order of the players in sortedPlayers defines the order of the information in the arrays.
 */
export const compressMarkedAsCreativeFlags = (round: GameRound, sortedPlayers: PlayerInfo[]): boolean[][] => {
    const markedAsCreativeArrays: boolean[][] = [];
    sortedPlayers.forEach(player => {
        const playerInputs = round.get(player.id) as PlayerInput[];
        markedAsCreativeArrays.push(playerInputs.map(input => input.star));
    });
    return markedAsCreativeArrays;
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
 * Sets points and validity of player inputs for a player who is rejoining the game in evaluation phase.
 */
export const setPointsAndValidity = (
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

/**
 * Applies the "marked as very creative" flags to the player inputs for a player who is rejoining the game in evaluation phase.
 */
export const applyMarkedAsCreativeFlags = (compressedData: boolean[][], sortedPlayers: PlayerInfo[], round: GameRound) => {
    sortedPlayers.forEach((player, playerIndex) => {
        const markedAsCreativeAnswer = compressedData[playerIndex];
        (round.get(player.id) as PlayerInput[]).forEach((input, categoryIndex) => input.star = markedAsCreativeAnswer[categoryIndex]);
    });
};
