export enum GameOption {
    checkForDuplicates = 'checkForDuplicates',
    creativeAnswersExtraPoints = 'creativeAnswersExtraPoints',
    onlyPlayerWithValidAnswer = 'onlyPlayerWithValidAnswer',
}

export interface GameConfigScoringOptions {
    [GameOption.checkForDuplicates]: boolean;
    [GameOption.creativeAnswersExtraPoints]: boolean;
    [GameOption.onlyPlayerWithValidAnswer]: boolean;
}

export enum EndRoundMode {
    /**
     * All players have to click "Finish round" to end the round.
     */
    allPlayersSubmit = 'allPlayers',
    /**
     * Use a countdown that determines how much time each player has
     * to fill out the text fields in one round of the game.
     */
    countdownEnds = 'countdownEnds',
    /**
     * The first player to click "Finish round" ends the round.
     */
    firstPlayerSubmits = 'firstPlayer',
}

export interface GameConfig {
    categories: string[];
    durationOfCountdown: number;
    endRoundMode: EndRoundMode;
    letters: string[];
    numberOfRounds: number;
    scoringOptions: GameConfigScoringOptions;
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
    /** Number of "creative" stars awarded by other players. Each player can award one star per answer */
    stars: number;
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
 * Used to track which answers were marked by the player as creative (represented as star shaped toggle buttons).
 * This information is used to determine whether the player can mark a specific answer as creative or undo this decision.
 * `Key`: other player's id. `Value`: answers (represented by category index) marked creative.
 */
export type CreativeStarsAwardedByPlayer = Map<string, number[]>;

/**
 * Represents a "creative answer" star that a player adds to or removes from another player's input.
 */
export interface PlayerInputMarkedCreativeStatus {
    categoryIndex: number;
    evaluatedPlayerId: string;
    /**
     * If `true`, then a star is added. `False` means a star is removed.
     */
    markedAsCreative: boolean;
}

export interface EqualAnswersOfCategory {
    /** category index */
    c: number;
    /** value = equal answers */
    v: string[];
}

/**
 * Contains the names of the players with the same number of points.
 */
export interface GameResultsGroup {
    playerNames: string[];
    points: number;
}

/**
 * Player inputs that receive "creative answer" stars from other players
 * are displayed in a "Hall of Fame" at the end of the game.
 */
export interface HallOfFameEntry {
    category: string;
    playerName: string;
    text: string;
}
