export interface GameConfigScoringSystem {
    checkForDuplicates: boolean;
    creativeAnswersExtraPoints: boolean;
    onlyPlayerWithValidAnswer: boolean;
}

export interface GameConfig {
    categories: string[];
    letters: string[];
    numberOfRounds: number;
    scoringOptions: GameConfigScoringSystem;
}

export interface StoredRunningGameInfo {
    /** Version 4 UUID */
    gameId: string;
    /** UNIX timestamp */
    idCreationTimestamp: number;
    isPlayerAdmin: boolean;
}

/**
 * Represents a player's input for one category in one round of the game.
 */
export interface PlayerInput {
    isMarkedCreative: boolean;
    points: number;
    text: string;
    valid: boolean;
}

/**
 * Holds the inputs for all players (key = player's id) for one round of the game.
 */
export type GameRound = Map<string, PlayerInput[]>;

/**
 * Represents the evaluation of all players for one player's input for one category in one round of the game.
 * The players' ids are used as keys for the map. The value represents whether the input is valid.
 */
export type PlayerInputEvaluation = Map<string, boolean>;

/**
 * Represents the evaluation of all players' inputs in one round of the game. The players' ids
 * are used as keys for the map. The array holds one PlayerInputEvaluation object for each category.
 */
export type GameRoundEvaluation = Map<string, PlayerInputEvaluation[]>;

/**
 * Represents the user's evaluation of a player's input for a category.
 */
export interface EvaluationOfPlayerInput {
    evaluatedPlayerId: string;
    categoryIndex: number;
    markedAsValid: boolean;
}

export interface GameResultForPlayer {
    playerName: string;
    points: number;
}
