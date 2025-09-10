import chalk from "chalk";
import { isAre, plural } from "../utils";
import { indentLevel3 } from "../2-args";
import { type AlianItem } from "./9-types";

export function printAllLinks(filename: string, alienFiles: AlianItem[], localFiles: AlianItem[]) {
    console.log(chalk.green(`\nProcessing: "${filename}"`));
    console.log(chalk.gray(
        `  1. The document has ${alienFiles.length} link${plural(alienFiles.length)} ` +
        `(${localFiles.length} of them ${isAre(localFiles.length)} local link${plural(localFiles.length)}):`));

    alienFiles.forEach(printAlienItem);
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
}

export function printFilteredFiles(localFiles: AlianItem[]) {
    console.log(chalk.gray(`  1.1. After filtering duplicates:`));
    localFiles.filter((item) => !item.isDuplicate).forEach(printAlienItem);
}

function printAlienItem(alienFile: AlianItem, idx: number) {
    const attrs =
        Object.entries(alienFile.el.attribs || {})
            .map(
                ([key, val]) => (
                    isHrefDataProtocol(key, val) // shorten data: urls
                        ? ` ${key}="data:..."`
                        : ` ${key}${val ? `="${val}"` : ''}`
                )
            )
            .filter(Boolean)
            .join('');
    const line = `<${alienFile.el.tagName}${attrs}>`;
    console.log(`${indentLevel3}${idx}: ${chalk.cyan(`${line}`)}`);
}

function isHrefDataProtocol(key: string, val: string): boolean {
    return key === 'href' && !!val.match(/^data:/);
}
