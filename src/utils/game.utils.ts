import { PlayerInput } from '../models/game.interface';
import randomnItem from 'random-item';

/**
* Returns an array of unique letters of the alphabet (excluding Q, X and Y).
* The number of letters is defined by the parameter numberOfLetters (max: 23).
*/
export const getRandomnLetters = (numberOfLetters: number): string[] => {
    if (numberOfLetters > 23) {
        throw new Error('Cannot create more than 23 randomn unique letters of the alphabet (without Q, X and Y)!');
    }
    const randomnLetters: string[] = [];
    let alphabetWithoutQXY = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'
    ];
    for (let i = 0; i < numberOfLetters; i++) {
        const randomnLetter = randomnItem(alphabetWithoutQXY);
        randomnLetters.push(randomnLetter);
        alphabetWithoutQXY = alphabetWithoutQXY.filter(letter => letter !== randomnLetter);
    }
    return randomnLetters;
};

 /**
 * Checks each PlayerInput object whether it contains text.
 * If text string is empty, valid is set to false, otherwise to true.
 */
export const evaluatePlayerInputs = (playerInputs: PlayerInput[]): PlayerInput[] => {
    return playerInputs.map(input => ({ ...input, valid: !!input.text }));
};
