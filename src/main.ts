import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { runOptions } from './utils/app-types';
import { getArguments } from './utils/app-arguments';
import { Content } from './utils/app-content';
import { exitProcess } from './utils/utils-errors';
import { help } from './utils/app-help';
import { notes } from './utils/app-notes';

function processSingleHtml(filename: string): void {
    filename = path.resolve(filename);
    const rootDir = path.dirname(filename);

    const newCnt = Content.createSolidHtmlContent({
        rootDir,
        filename,
        addMissingFavicon: runOptions.favicon,
        replace: runOptions.replace,
        keepmaps: runOptions.keepmaps
    });

    const destName = path.join(rootDir, `${path.basename(filename, '.html')}${runOptions.suffix}${path.extname(filename)}`);

    fs.writeFileSync(destName, newCnt);
}

export function main() {
    const target = getArguments();
    //return;

    try {
        let src = path.normalize(target);
        if (fs.statSync(src).isDirectory()) {
            const fileNames: string[] =
                fs.readdirSync(src)
                    .filter(_ => path.extname(_) === '.html' && !~_.indexOf(runOptions.suffix))
                    .map(_ => path.join(src, _));

            if (fileNames.length) {
                fileNames.forEach(processSingleHtml);
            } else {
                console.log(chalk.yellow(`  No HTML files found in folder "${src}"`));
            }
        } else {
            processSingleHtml(src);
        }
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('Done'));
}
