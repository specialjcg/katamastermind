type Color = "RED" | "BLUE" | "GREEN" | "PURPLE" | "PINK" | "YELLOW";

type PinsCount = 0 | 1 | 2 | 3 | 4


interface Indication {
    wellPlaced: PinsCount;
    misplaced: PinsCount;


}

const wellPlaced = (secret: Colors, guess: Colors): Color[] =>
    secret.filter((color, index) => color === guess[index]);

const pinsWellPlaced = (secret: Colors, guess: Colors): PinsCount =>
    (wellPlaced(secret, guess).length as PinsCount);

const exclude = <T>(first: T[], second: T[]): T[] => {
    const rest = [...second];
    const exclusion: T[] = []
    first.forEach(current => {
        if (rest.includes(current)) {
            rest.splice(rest.indexOf(current), 1);
            return;
        }
        exclusion.push(current)
    })
    return exclusion
};

const intersect = <T>(first: T[], second: T[]): T[] => {
    const rest = [...second];
    const intersection: T[] = []
    first.forEach(current => {
        if (rest.includes(current)) {
            rest.splice(rest.indexOf(current), 1);
            intersection.push(current)
        }
    })
    return intersection
};

const pinsMisplaced = (secret: Colors, guess: Colors): PinsCount => {
    let pins = wellPlaced(secret, guess);
    const secretNotFound = exclude(secret, pins)
    const guessNotFound = exclude(guess, pins)
    return intersect(secretNotFound, guessNotFound).length as PinsCount;

};

type Colors = [Color, Color, Color, Color]

const evaluate = (secret: Colors, guess: Colors): Indication => ({
    wellPlaced: pinsWellPlaced(secret, guess),
    misplaced: pinsMisplaced(secret, guess)
});

describe('test mastermind', () => {
    it('should give 0,0 indication when no color match', () => {
        expect(evaluate(["BLUE", "BLUE", "BLUE", "BLUE"], ["RED", "RED", "RED", "RED"])).toEqual<Indication>({
            wellPlaced: 0, misplaced: 0
        })
    });
    it('should give 1,0 indication when one color well placed and no color misplaced', () => {
        expect(evaluate(["GREEN", "BLUE", "BLUE", "BLUE"], ["GREEN", "RED", "RED", "RED"])).toEqual<Indication>({
            wellPlaced: 1, misplaced: 0
        })
    });
    it('should give 0,1 indication when one color is misplaced and other colors not matching', () => {
        expect(evaluate(["RED", "PURPLE", "YELLOW", "PINK"], ["PURPLE", "GREEN", "BLUE", "BLUE"])).toEqual<Indication>({
            wellPlaced: 0, misplaced: 1
        })
    });
    it('should give 1,0 indication when one color is well placed in mono color secret', () => {
        expect(evaluate(["RED", "RED", "RED", "RED"], ["RED", "GREEN", "BLUE", "BLUE"])).toEqual<Indication>({
            wellPlaced: 1, misplaced: 0
        })
    });
    it('should give 1,0 indication when one color is well placed in mono color guess', () => {
        expect(evaluate(["RED", "GREEN", "BLUE", "BLUE"], ["RED", "RED", "RED", "RED"])).toEqual<Indication>({
            wellPlaced: 1, misplaced: 0
        })
    });
    it('should give 1,1 indication when on color is well placed and same color misplaced', () => {
        expect(evaluate(["RED", "BLUE", "RED", "BLUE"], ["RED", "RED", "GREEN", "RED"])).toEqual<Indication>({
            wellPlaced: 1, misplaced: 1
        })
    });

    it('should give 4,0 when all is well placed', () => {
        expect(evaluate(["RED", "GREEN", "BLUE", "YELLOW"], ["RED", "GREEN", "BLUE", "YELLOW"])).toEqual<Indication>({
            wellPlaced: 4, misplaced: 0
        })
    });
});
