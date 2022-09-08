export type ReplacePair = {
    key: string;
    to: string;
}

export type InOptions = {
    favicon: boolean;   // add missing favicon
    suffix: string;
    replace: ReplacePair[];
    keepmaps: boolean;  // don't remove source-maps
    output?: string;    // output filename path and filename
}

export const runOptions: InOptions = {
    favicon: true,
    suffix: '--single',
    replace: [],
    keepmaps: false,
};
