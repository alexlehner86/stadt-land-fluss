import { GameConfig } from "./game-config.interface";
import { PlayerInfo } from "./player.interface";

export interface PubNubUserState {
    gameConfig?: GameConfig;
    playerInfo: PlayerInfo;
}
