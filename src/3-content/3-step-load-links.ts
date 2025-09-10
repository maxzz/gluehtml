import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { osStuff, plural } from "../utils";
import { type Item } from "./9-types";
import { indentLevel3 } from "../2-args";

export function step_LoadLinksContentAndEmbed($: cheerio.Root, filesToLoad: Item[], rootDir: string) {
    console.log(chalk.gray(`  2. Embedding local file${plural(filesToLoad.length)}:`));

    // 4. Load the content of externals relative to the HTML file location (server locations are ignored).
    console.log(chalk.gray(`  2. Embedding local file${plural(filesToLoad.length)}:`));
    loadfiles(filesToLoad, rootDir);
    
    // 5. Replace cheerio links with loaded files content.
    console.log(chalk.gray(`  2. Embedding local stylesheet${plural(filesToLoad.length)}:`));
    embedStylesheetsAndscripts(filesToLoad, $);
}

function loadfiles(filesToLoad: Item[], rootDir: string) {
    filesToLoad.forEach(
        (item: Item) => {
            try {
                const fname = path.join(rootDir, item.url);
                if (fs.existsSync(fname)) {
                    console.log(chalk.gray(`${indentLevel3}${chalk.cyan(fname)}`));
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

function embedStylesheetsAndscripts(filesToLoad: Item[], $: cheerio.Root) {
    filesToLoad.forEach(
        (item: Item) => {
            if (!item.cnt) {
                return;
            }

            const { el } = item;
            const orgTag = el.tagName;
            const orgRel = el.attribs?.rel || '';
            let newElement = '';

            if (orgTag === 'link') {
                if (orgRel === 'stylesheet') {
                    const tag = 'style';
                    newElement = `\n    <${tag}>\n${item.cnt}\n    </${tag}>\n\n`;
                } else if (orgRel === 'modulepreload') {
                    const tag = 'script';
                    newElement = `\n    <${tag} type="module">\n${item.cnt}\n    </${tag}>\n\n`;
                }
            }
            else if (orgTag === 'script') {
                const module = el.attribs?.type ? ` type="${el.attribs.type}"` : '';
                const tag = 'script';
                newElement = `\n    <${tag}${module}>\n${item.cnt}\n    </${tag}>\n\n`;

                // move script inside body tag
                const thisEl = $(item.el);
                thisEl.remove();
                $('body').append(thisEl);
            }

            if (newElement) {
                $(item.el).replaceWith(newElement);
            } else {
                console.log(chalk.yellow(`skip tag ${orgTag} generation`));
            }
        }
    );
}