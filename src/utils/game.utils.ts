import { PlayerInput } from '../models/game.interface';

 /**
 * Checks each PlayerInput object whether it contains text.
 * If text string is empty, valid is set to false, otherwise to true.
 */
export const evaluatePlayerInputs = (playerInputs: PlayerInput[]): PlayerInput[] => {
    return playerInputs.map(input => ({ ...input, valid: !!input.text }));
};
