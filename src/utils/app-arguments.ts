import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import chalk from 'chalk';
import { runOptions } from './app-types';

function help() {
    const helpText = 
`
gluehtml is utility to glue .js and .css local files into HTML.

Run: gluehtml htmlFile | folder

Options:
    --suffix - string to add to the new file
    --nofav - not include default favicon if missing (default false)
    --keepmaps or -k don't remove source maps with patterns like: /*# sourceMappingURL=style.css.map */ (default false)
    --replace or -r - following string in format: a=b to replace a with b
`;
    console.log(helpText);
}

export function getArguments(): string {
    const args = minimist(process.argv.slice(2), {
        boolean: ['nofav', 'keepmaps'],
        string: ['replace', 'suffix'],
        alias: {
            n: 'nofav',
            r: 'replace',
            k: 'keepmaps',
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
        console.log(chalk.yellow(`No files to glue.`));
        process.exit(1);
    }

    if (args.suffix && typeof args.suffix === 'string') {
        runOptions.suffix = `--${args.suffix}`;
    }

    runOptions.favicon = !args.nofav;
    runOptions.keepmaps = args.keepmaps;

    args.replace.forEach((_: string) => {
        const pair = _.split('=');
        if (pair.length === 2) {
            runOptions.replace.push({key: pair[0], to: pair[1]});
        } else {
            help();
            console.log(chalk.yellow(`invalid pair" '${_}'`));
            process.exit(2);
        }
    });

    return target;
}
