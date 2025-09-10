import chalk from "chalk";
import { isAre, plural } from "../utils";
import { indentLevel3, type ReplacePair } from "../2-args";
import { type AlianItem } from "./9-types";

export function step_GetDocumentLinks(filename: string, replacePairs: ReplacePair[], $: cheerio.Root): AlianItem[] {
    const alienFiles: AlianItem[] = [];

    // 1. Scan document
    $('link').each(
        (idx: number, el: cheerio.Element) => {
            const elm = el as cheerio.TagElement;
            elm.attribs.href && alienFiles.push({
                el: elm,
                tag: 'link',
                url: elm.attribs.href,
                rel: (elm.attribs.rel || '').trim().toLowerCase(),
            });
        }
    );

    $('script').each(
        (idx: number, el: cheerio.Element) => {
            const elm = el as cheerio.TagElement;
            elm.attribs.src && alienFiles.push({
                el: elm,
                tag: 'script',
                url: elm.attribs.src,
                rel: '',
            });
        }
    );

    alienFiles.forEach((file) => file.isLoadable = isLoadable(file));

    // 2. Skip items to remote files
    let localFiles = alienFiles.filter((file) => file.isLoadable);

    // 2.1. Print links
    printAllLinks(filename, alienFiles, localFiles);

    // 3. Filter duplicates
    localFiles = filterDuplicates(localFiles);
    printAllLinks(filename, alienFiles, localFiles);

    // 4. Remap url name pairs defined by user through --replace option
    localFiles.forEach(
        (file: AlianItem) => {
            replacePairs.forEach(
                ({ key, to }: ReplacePair) => file.url = file.url.replace(key, to)
            );
        }
    );

    return localFiles;
}

function filterDuplicates(localFiles: AlianItem[]): AlianItem[] {
    const existing = new Set<string>();
    const unique = localFiles.reduce((acc, item) => {
        if (!existing.has(item.url)) {
            existing.add(item.url);
            acc.push(item);
        }
        return acc;
    }, [] as AlianItem[]);
    return unique;
}

function isLoadable(alianItem: AlianItem): boolean {
    let canbe = true;
    if (alianItem.tag === 'link') {                     // skip 'rel=icon', rel="modulepreload", but allow =stylesheet and ="stylesheet"
        canbe = !!alianItem.rel.match(/stylesheet/);    // !!rel.match(/(?:stylesheet|modulepreload)/): for now just keep stylesheet only
    }
    return canbe && !alianItem.url?.match(/^https?|^data:/);
}

function isHrefDataProtocol(key: string, val: string): boolean {
    return key === 'href' && !!val.match(/^data:/);
}

function printAllLinks(filename: string, alienFiles: AlianItem[], localFiles: AlianItem[]) {
    console.log(chalk.green(`\nProcessing: "${filename}"`));
    console.log(chalk.gray(
        `  1. The document has ${alienFiles.length} link${plural(alienFiles.length)} ` +
        `(${localFiles.length} of them ${isAre(localFiles.length)} local link${plural(localFiles.length)}):`));

    alienFiles.forEach(
        (file, idx) => {
            const attrs =
                Object.entries(file.el.attribs || {})
                    .map(
                        ([key, val]) => (
                            isHrefDataProtocol(key, val) // shorten data: urls
                                ? ` ${key}="data:..."`
                                : ` ${key}${val ? `="${val}"` : ''}`
                        )
                    )
                    .filter(Boolean)
                    .join('');
            const line = `<${file.el.tagName}${attrs}>`;
            console.log(`${indentLevel3}${idx}: ${chalk.cyan(`${line}`)}`);
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
}
