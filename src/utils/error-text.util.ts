import { MAX_NUMBER_OF_ROUNDS, MIN_NUMBER_OF_CATEGORIES, MIN_NUMBER_OF_ROUNDS, STANDARD_ALPHABET } from '../constants/game.constant';
import { makePluralIfCountIsNotOne } from './general.utils';


export const getInvalidNameError = (): string => {
    return 'Du musst einen Spielernamen eingeben';
};

export const getInvalidGameIdError = (): string => {
    return 'Du musst eine Spiel-ID eingeben';
};

export const getInvalidRoundsError = (): string => {
    return `Die Anzahl an Runden muss zwischen ${MIN_NUMBER_OF_ROUNDS} und ${MAX_NUMBER_OF_ROUNDS} liegen`;
};

export const getTooFewCategoriesError = (): string => {
    return `Wähle mindestens ${MIN_NUMBER_OF_CATEGORIES} Kategorien aus. Zum Beispiel: Stadt, Land und Fluss/Gewässer`;
};

export const getTooManyLettersExcludedError = (numberOfRounds: number): string => {
    const round = makePluralIfCountIsNotOne(numberOfRounds, 'Runde', 'Runden'); 
    const maxNumberToExclude = STANDARD_ALPHABET.length - numberOfRounds;
    return `Du hast zu viele Buchstaben ausgeschlossen! Bei ${numberOfRounds} ${round} darfst du maximal ${maxNumberToExclude} Buchstaben ausschließen`;
};
