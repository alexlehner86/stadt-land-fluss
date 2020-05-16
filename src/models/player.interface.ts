/**
 * The information about a player relevant for a specific game of "Stadt-Land-Fluss".
 */
export interface PlayerInfo {
    id: string;
    isAdmin: boolean;
    name: string;
}

/**
 * Used to store a player's id (uuid4) and name in local storage.
 * The timestamp allows the app to know when to renew the id after a determined time span.
 */
export interface StoredPlayerInfo {
    /** Version 4 UUID */
    id: string;
    /** UNIX timestamp */
    idCreationTimestamp: number;
    name: string;
}
