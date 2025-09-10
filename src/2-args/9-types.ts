export type ReplacePair = { // replace url parts with new value; following string in format: a=b to replace a with b
    key: string;
    to: string;
}

export type InOptions = {
    favicon: boolean;       // add missing favicon
    suffix: string;         // add suffix to filename
    replace: ReplacePair[]; // pairs to replace inside document urls
    keepmaps: boolean;      // don't remove source-maps
    output?: string;        // output folder
}

export const runOptions: InOptions = {
    favicon: true,
    suffix: '--single',
    replace: [],
    keepmaps: false,
};
