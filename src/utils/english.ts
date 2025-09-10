export function plural(n: number): string {
    return n === 1 ? '' : 's';
}

export function isAre(n: number): string {
    return n === 1 ? 'is' : 'are';
}
