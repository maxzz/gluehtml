import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { getArguments, getFilenamesToProcess } from './utils/app-arguments';
import { runOptions } from './utils/app-types';
import { createSolidHtmlContent } from './utils/app-content';

function processSingleHtml(fname: string): void {
    fname = path.resolve(fname);
    const rootDir = path.dirname(fname);

    const newCnt = createSolidHtmlContent({
        rootDir,
        filename: fname,
        addMissingFavicon: runOptions.favicon,
        replace: runOptions.replace,
        keepmaps: runOptions.keepmaps
    });

    const destName = path.join(rootDir, `${path.basename(fname, '.html')}${runOptions.suffix}${path.extname(fname)}`);

    fs.writeFileSync(destName, newCnt);
}

export function main() {
    const target = getArguments();
    const fileNames = getFilenamesToProcess(target);

    try {
        fileNames.forEach(processSingleHtml);
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('Done'));
}
