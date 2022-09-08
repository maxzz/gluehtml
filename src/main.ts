import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { getArguments, getFilenamesToProcess } from './utils/app-arguments';
import { runOptions } from './utils/app-types';
import { createSolidHtmlContent } from './utils/app-content';
import { osStuff } from './utils/utils-os';

function handleSingleHtml(fname: string): void {
    fname = path.resolve(fname);
    const rootDir = path.dirname(fname);

    const newCnt = createSolidHtmlContent({
        rootDir,
        filename: fname,
        addMissingFavicon: runOptions.favicon,
        replace: runOptions.replace,
        keepmaps: runOptions.keepmaps
    });

    let destName = '';

    if (runOptions.output) {
        const dir = runOptions.output;
        fs.mkdirSync(dir, { recursive: true });
        destName = path.join(runOptions.output, path.basename(fname));
    } else {
        const base = osStuff.fnameWoExt(path.basename(fname));
        const ext = path.extname(fname);
        destName = path.join(rootDir, `${base}${runOptions.suffix}${ext}`);
    }

    fs.writeFileSync(destName, newCnt);

    console.log(chalk.gray(`  new file saved to: ${destName}`));
}

export function main() {
    const target = getArguments();
    const fileNames = getFilenamesToProcess(target);

    try {
        fileNames.forEach(handleSingleHtml);
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('\nAll done'));
}
