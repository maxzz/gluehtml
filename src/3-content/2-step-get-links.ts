import chalk from "chalk";
import { type ReplacePair } from "../utils";
import { type Item } from "./9-types";

export function step_GetDocumentLinks($: cheerio.Root, filename: string, replacePairs: ReplacePair[]): Item[] {
    const allFiles: Item[] = [];

    // 1. Scan document
    $('link').each(
        (idx: number, el: cheerio.Element) => {
            const elm = el as cheerio.TagElement;
            elm.attribs.href && allFiles.push({
                el: elm,
                url: elm.attribs.href,
                rel: elm.attribs.rel,
            });
        }
    );

    $('script').each(
        (idx: number, el: cheerio.Element) => {
            const elm = el as cheerio.TagElement;
            elm.attribs.src && allFiles.push({
                el: elm,
                url: elm.attribs.src,
            });
        }
    );

    allFiles.forEach((file) => file.isLoadable = isLoadable(file));

    // 2. Skip items to remote files
    let localFiles = allFiles.filter((file) => file.isLoadable);

    // 2.1. Print links
    printAllLinks(filename, allFiles, localFiles);

    // 3. Remap url name pairs
    localFiles.forEach(
        (file: Item) => {
            replacePairs.forEach(({ key, to }: ReplacePair) => file.url = file.url.replace(key, to));
        }
    );

    return localFiles;
}

export const indentLevel3 = '      ';

function isLoadable(item: Item): boolean {
    let canbe = true;
    if (item.el.tagName === 'link') { // skip 'rel=icon', rel="modulepreload", but allow =stylesheet and ="stylesheet"
        const rel = item.rel?.trim().toLowerCase() || '';
        canbe = !!rel.match(/stylesheet/); // !!rel.match(/(?:stylesheet|modulepreload)/): for now just keep stylesheet only
    }
    return canbe && !item.url?.match(/^https?|^data:/);
}

function printAllLinks(filename: string, allFiles: Item[], localFiles: Item[]) {
    console.log(chalk.green(`\nProcessing: "${filename}"`));
    console.log(chalk.gray(
        `  The document has ${allFiles.length} link${plural(allFiles.length)} ` +
        `(${localFiles.length} of them ${isAre(localFiles.length)} local link${plural(localFiles.length)}):`));

    allFiles.forEach(
        (file, idx) => {
            const attrs = Object.entries(file.el.attribs || {})
                .map(
                    ([key, val]) => (
                        key === 'href' && val.match(/^data:/) // shorten data: urls
                            ? ` "${key}"="data:..."`
                            : val
                                ? ` ${key}="${val}"`
                                : ` ${key}`
                    )
                )
                .filter(Boolean)
                .join('');
            const line = `<${file.el.tagName}${attrs}>`;
            console.log(`${indentLevel3}${idx}: ${chalk.cyan(`${line}`)}`);

            //console.log(`${indentLevel3}url: ${chalk.cyan(file.url)} ${chalk.cyan(`${text}`)}`);
            //console.log(chalk.gray(`${indentLevel3}url: ${chalk.cyan(file.url)}`));
        }
    );

    /*
    The document has 10 links (10 of them are local links):
        0: <link "rel"="stylesheet" "href"="./css/style.css">
        1: <link "rel"="stylesheet" "href"="./css/style.css">
        2: <link "rel"="stylesheet" "href"="./css/style.css">
        3: <link "rel"="stylesheet" "href"="./css/style.css">
        4: <link "rel"="stylesheet" "href"="./css/style.css">
        5: <link "rel"="stylesheet" "href"="./css/style.css">
        6: <script "src"="./js/index.js">
        7: <script "src"="js/index.js">
        8: <script "src"="./js/index.js">
        9: <script "src"="./js/index.js">
     */
    console.log(chalk.gray(`  merging local file${plural(localFiles.length)}:`));
}

function plural(n: number): string {
    return n === 1 ? '' : 's';
}

function isAre(n: number): string {
    return n === 1 ? 'is' : 'are';
}
