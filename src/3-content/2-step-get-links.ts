import chalk from "chalk";
import { type ReplacePair } from "../utils";
import { type Item } from "./9-types";

function isLoadable(item: Item): boolean {
    let canbe = true;
    if (item.el.tagName === 'link') { // skip 'rel=icon', rel="modulepreload", but allow =stylesheet and ="stylesheet"
        const rel = item.rel?.trim().toLowerCase() || '';
        canbe = !!rel.match(/stylesheet/); // !!rel.match(/(?:stylesheet|modulepreload)/): for now just keep stylesheet only
    }
    return canbe && !item.url?.match(/^https?|^data:/);
}

export const indentLevel3 = '      ';

export function step_GetDocumentLinks($: cheerio.Root, filename: string, replacePairs: ReplacePair[]): Item[] {
    const allFiles: Item[] = [];

    // 1. Scan document

    $('link').each((idx: number, el: cheerio.Element) => {
        const elm = el as cheerio.TagElement;
        elm.attribs.href && allFiles.push({
            el: elm,
            url: elm.attribs.href,
            rel: elm.attribs.rel,
        });
    });

    $('script').each((idx: number, el: cheerio.Element) => {
        const elm = el as cheerio.TagElement;
        elm.attribs.src && allFiles.push({
            el: elm,
            url: elm.attribs.src,
        });
    });

    allFiles.forEach((file) => file.isLoadable = isLoadable(file));

    // 2. Skip items to remote files
    let files = allFiles.filter((file) => file.isLoadable);

    // 2.1. Print links
    function printAllLinks() {
        console.log(chalk.green(`\nHTML file: ${filename}`));
        console.log(chalk.gray(`  document links ${allFiles.length} (${files.length} of them ${files.length === 1 ? 'is' : 'are'} local link${files.length === 1 ? '' : 's'}):`));
        allFiles.forEach(
            (file) => {
                const attrs = Object.entries(file.el.attribs || {})
                    .map(
                        ([key, val]) => (
                            key === 'href' && val.match(/^data:/)
                                ? ` "${key}"="data:..."`
                                : val
                                    ? ` "${key}"="${val}"`
                                    : ` ${key}`
                        )
                    )
                    .filter(Boolean).join('');
                console.log(`${indentLevel3}${chalk.cyan(`<${file.el.tagName}${attrs}>`)}`);
                //console.log(`${indentLevel3}url: ${chalk.cyan(file.url)} ${chalk.cyan(`<${file.el.tagName}${attrs}>`)}`);
                //console.log(chalk.gray(`${indentLevel3}url: ${chalk.cyan(file.url)}`));
            }
        );
        console.log(chalk.gray(`  merging local file${files.length === 1 ? '' : 's'}:`));
    }
    printAllLinks();

    // 3. Remap url name pairs
    files.forEach((file: Item) => {
        replacePairs.forEach(({ key, to }: ReplacePair) => file.url = file.url.replace(key, to));
    });

    return files;
}
