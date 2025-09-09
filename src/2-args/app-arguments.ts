import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import chalk from 'chalk';
import { runOptions } from '../utils/app-types';
import { help } from '../utils/app-help';

export function getArguments(): string {
    const args = minimist(process.argv.slice(2), {
        boolean: ['nofav', 'keepmaps'],
        string: ['replace', 'suffix', 'output'],
        alias: {
            n: 'nofav',
            r: 'replace',
            k: 'keepmaps',
            o: 'output',
        },
        default: {
            nofav: false,
            replace: [],
            keepmaps: false,
        }
    });

    //console.log(chalk.green(JSON.stringify(args)));

    let target: string = args.path || args['_'][0];

    if (!target || !fs.existsSync(target)) {
        help();
        console.log(chalk.yellow(`No HTML files to glue in '${target}'\n`));
        process.exit(0);
    }

    if (args.suffix && typeof args.suffix === 'string') {
        runOptions.suffix = `--${args.suffix}`;
    }

    runOptions.favicon = !args.nofav;
    runOptions.keepmaps = args.keepmaps;
    runOptions.output = args.output;

    args.replace.forEach((line: string) => {
        const pair = line.split('=');
        if (pair.length === 2) {
            runOptions.replace.push({
                key: pair[0],
                to: pair[1],
            });
        } else {
            help();
            console.log(chalk.yellow(`invalid pair" '${line}'`));
            process.exit(2);
        }
    });

    return target;
}

export function getFilenamesToProcess(target: string): string[] {
    let fileNames: string[] = [];

    let src = path.normalize(target);

    if (fs.statSync(src).isDirectory()) {
        fileNames =
            fs.readdirSync(src)
                .filter(fname => path.extname(fname) === '.html' && !~fname.indexOf(runOptions.suffix))
                .map(fname => path.join(src, fname));
    } else {
        fileNames = [src];
    }

    if (!fileNames.length) {
        console.log(chalk.yellow(`  No HTML files found in folder "${src}"`));
    }

    return fileNames;
}
