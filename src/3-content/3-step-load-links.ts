import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { osStuff, plural } from "../utils";
import { type AlianItem } from "./9-types";
import { indentLevel3 } from "../2-args";

export function step_LoadLinksContentAndEmbed(alienFiles: AlianItem[], rootDir: string, $: cheerio.Root) {
    // 4. Load the content of externals relative to the HTML file location (server locations are ignored).
    console.log(chalk.gray(`  2.1. Loading local file${plural(alienFiles.length)}:`));
    loadfiles(alienFiles, rootDir);

    // 5. Replace cheerio links with loaded files content.
    console.log(chalk.gray(`  2.2. Embedding local stylesheet${plural(alienFiles.length)}:`));
    embedStylesheetsAndscripts(alienFiles, $);
}

function loadfiles(alienFiles: AlianItem[], rootDir: string) {
    alienFiles.forEach(
        (item: AlianItem, idx: number) => {
            try {
                const fname = path.join(rootDir, item.url);
                if (fs.existsSync(fname)) {
                    console.log(chalk.gray(`${indentLevel3}${idx}: ${chalk.cyan(fname)}`));
                    item.cnt = osStuff.stripBOM(fs.readFileSync(fname).toString()).trim();
                } else {
                    console.log(chalk.yellow(`${indentLevel3}${fname} - missing local file`));
                }
            } catch (error) {
                console.log(chalk.red(`${indentLevel3}${item.url} - failed to load\n   ${error}`));
            }
        }
    );
}

function embedStylesheetsAndscripts(alienFiles: AlianItem[], $: cheerio.Root) {
    alienFiles.forEach(
        (item: AlianItem) => {
            if (item.isDuplicate) {
                $(item.el).remove();
                return;
            }
            
            if (!item.cnt) {
                return;
            }

            const { el, tag } = item;
            let newElement = '';

            if (tag === 'link') {
                const orgRel = el.attribs?.rel || '';
                if (orgRel === 'stylesheet') {
                    newElement = `\n    <style>\n${item.cnt}\n    </style>\n\n`;
                }
                else if (orgRel === 'modulepreload') {
                    newElement = `\n    <script type="module">\n${item.cnt}\n    </script>\n\n`;
                }
            }
            else if (tag === 'script') {
                const module = el.attribs?.type ? ` type="${el.attribs.type}"` : '';
                newElement = `\n    <script${module}>\n${item.cnt}\n    </script>\n\n`;

                // move script inside body tag
                const thisEl = $(el);
                thisEl.remove();
                $('body').append(thisEl);
            }

            if (newElement) {
                $(item.el).replaceWith(newElement);
            } else {
                console.log(chalk.yellow(`skip tag ${tag} generation`));
            }
        }
    );
}