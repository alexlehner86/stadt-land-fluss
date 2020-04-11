export interface GameConfig {
    categories: string[];
    letters: string[];
    numberOfRounds: number;
}

/**
 * Represents a player's input for one category in one round of the game.
 */
export interface PlayerInput {
    text: string;
    valid: boolean;
}

/**
 * Holds the inputs for all players (key = player's id) for one round of the game.
 */
export type GameRound = Map<string, PlayerInput[]>;
