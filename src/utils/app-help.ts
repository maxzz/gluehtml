import chalk from 'chalk';

let cfg = require('../../package.json');

export const { name: programName, version: programVersion } = cfg;

export function help() {
    const helpText = 
    // gluehtml is utility to glue .js and .css local files into HTML.
`
Run: gluehtml htmlFile | folder

Options:
    --output or -o     output folder
    --suffix           string to add to the new file
    --nofav            not include default favicon if missing (default false)
    --keepmaps or -k   don't remove source maps with patterns like: /*# sourceMappingURL=style.css.map */ (default false)
    --replace or -r    replace url parts with new value; following string in format: a=b to replace a with b
`;
    console.log(helpText);
}
