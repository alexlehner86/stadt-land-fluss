export interface GameConfigScoringOptions {
    checkForDuplicates: boolean;
    creativeAnswersExtraPoints: boolean;
    onlyPlayerWithValidAnswer: boolean;
}

export interface GameConfig {
    categories: string[];
    letters: string[];
    numberOfRounds: number;
    scoringOptions: GameConfigScoringOptions;
    /**
     * Whether to use a countdown that determines how much time each player has
     * to fill out the text fields in one round of the game. If useCountdown is
     * set to false, then the first player to click "Finish round" ends the round.
     */
    useCountdown: boolean;
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
    /** The points the player gains with this input if it is valid */
    points: number;
    /** Whether input is marked as very creative, funny etc answer */
    star: boolean;
    /** The text input by the player */
    text: string;
    /** Is the input valid or was it rejected by the other players */
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
    categoryIndex: number;
    evaluatedPlayerId: string;
    markedAsValid: boolean;
}

/**
 * Represents whether a player's input for a category is deemed a very creative answer.
 */
export interface IsPlayerInputVeryCreativeStatus {
    categoryIndex: number;
    evaluatedPlayerId: string;
    markedAsCreative: boolean;
}

export interface GameResultForPlayer {
    playerName: string;
    points: number;
}

/**
 * Player inputs that are marked as "very creative" by other players are
 * displayed in a "Hall of Fame" at the end of the game.
 */
export interface HallOfFameEntry {
    category: string;
    playerName: string;
    text: string;
}
