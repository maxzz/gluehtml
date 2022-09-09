import path from 'path';
import fs from 'fs-extra';
import cheerio from 'cheerio';
import chalk from 'chalk';
import { ReplacePair } from "./app-types";
import { osStuff } from './utils-os';

type Item = {
    el: cheerio.TagElement; // DOM element
    url: string;            // element url
    rel?: string;           // skip 'rel=icon' but handle =stylesheet and ="stylesheet"
    cnt?: string;           // file content
    isLoadable?: boolean;   // is file local and can be embedded (i.e. not: image, svg (except favicon), font, js module)
};

function isLoadable(item: Item): boolean {
    let canbe = true;
    if (item.el.tagName === 'link') { // skip 'rel=icon', rel="modulepreload", but allow =stylesheet and ="stylesheet"
        const rel = item.rel?.trim().toLowerCase() || '';
        canbe = !!rel.match(/stylesheet/); // !!rel.match(/(?:stylesheet|modulepreload)/): for now just keep stylesheet only
    }
    return canbe && !item.url?.match(/^https?|^data:/);
}

export const indentLevel3 = '      ';

function step_GetDocumentLinks($: cheerio.Root, filename: string, replacePairs: ReplacePair[]): Item[] {
    const allFiles: Item[] = [];

    // 1. Scan document

    $('link').each((idx: number, el: cheerio.TagElement) => {
        el.attribs.href && allFiles.push({
            el: el,
            url: el.attribs.href,
            rel: el.attribs.rel,
        });
    });

    $('script').each((idx: number, el: cheerio.TagElement) => {
        el.attribs.src && allFiles.push({
            el: el,
            url: el.attribs.src,
        });
    });

    allFiles.forEach((file) => file.isLoadable = isLoadable(file));

    // 2. Skip items to remote files
    let files = allFiles.filter((file) => file.isLoadable);

    console.log(chalk.green(`\nHTML file: ${filename}`));
    console.log(chalk.gray(`  document links ${allFiles.length} (${files.length} of them ${files.length === 1 ? 'is' : 'are'} local link${files.length === 1 ? '' : 's'}):`));
    allFiles.forEach((file) => {
        const attrs = file.el.attribs ? Object.entries(file.el.attribs).map(([key, val]) => ` "${key}"="${val}"`).join('') : '';
        
        console.log(`${indentLevel3}${chalk.cyan(`<${file.el.tagName}${attrs}>`)}`);
        //console.log(`${indentLevel3}url: ${chalk.cyan(file.url)} ${chalk.cyan(`<${file.el.tagName}${attrs}>`)}`);
        //console.log(chalk.gray(`${indentLevel3}url: ${chalk.cyan(file.url)}`));
    });
    console.log(chalk.gray(`  merging local file${files.length === 1 ? '' : 's'}:`));

    // 3. Remap file names
    files.forEach((file: Item) => {
        replacePairs.forEach((pair: ReplacePair) => {
            file.url = file.url.replace(pair.key, pair.to);
        });
    });

    return files;
}

function step_LoadLinksContentAndEmbed($: cheerio.Root, files: Item[], rootDir: string) {
    // 4. Load the content of externals relative to the HTML file location (server locations are ignored).
    files.forEach((item: Item) => {
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
    });

    // 5. Replace links with loaded files content.
    files.forEach((item: Item) => {
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
                newElement = `\n\n    <${tag}>\n${item.cnt}\n    </${tag}>\n\n`;
            } else if (orgRel === 'modulepreload') {
                const tag = 'script';
                newElement = `\n\n    <${tag} type="module">\n${item.cnt}\n    </${tag}>\n\n`;
            }
        } else if (orgTag === 'script') {
            const module = el.attribs?.type ? ` type="${el.attribs.type}"` : '';
            const tag = 'script';
            newElement = `\n\n    <${tag}${module}>\n${item.cnt}\n    </${tag}>\n\n`;
        }

        if (newElement) {
            $(item.el).replaceWith(newElement);
        } else {
            console.log(chalk.yellow(`skip tag ${orgTag} generation`));
        }
    });
}

function step_EmbedIcon($: cheerio.Root, files: Item[], rootDir: string, addMissingFavicon: boolean) {
    // 6. Try to embed favicon
    //const DEF_FAVICON = 'data:image/png;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QQCDuEEAg7hBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBM4O4QTODuEEAg7hBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QQuDuEGxg7hBsYO4QQuDuEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBWoO4QfeDuEH3g7hBWoO4QQCDuEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QRqDuEHJg7hB/4O4Qf+DuEHJg7hBGoO4QQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBeoO4Qf6DuEH/g7hB/4O4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';

    function readIconAsString(fname: string): string {
        let buf = fs.readFileSync(fname);
        let b64 = `data:image/png;base64,${buf.toString('base64')}`;
        return b64;
    }

    let iconEl = files.find(_ => _.rel && ~_.rel.indexOf('icon') && _.url);
    if (iconEl) {
        try {
            const isLocalFname = iconEl.url && !iconEl.url.match(/^https?|^data:/);
            if (isLocalFname) {
                const fname = path.join(rootDir, iconEl.url);
                const b64 = readIconAsString(fname);

                const el = `<link rel="shortcut icon" type="image/x-icon" href="${b64}"></link>\n`;
                $(iconEl.el).replaceWith(el);
            } else {
                console.log(chalk.gray(`${indentLevel3}Skipped favicon with protocol <data:...>`));
            }
        } catch (err) {
            console.log(`${indentLevel3}Cannot load favicon: '${iconEl.url}'`, err);
        }
    } else if (addMissingFavicon) {
        //let el = `<link rel="shortcut icon" type="image/x-icon" href="${DEF_FAVICON}"></link>\n`;
        let el = `\n\n    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-20 -20 140 140%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>" >\n\n`;
        $('head').append(el);
    }
}

function step_loadAndParseHtml(filename: string): cheerio.Root {
    let htmlAsStr = '';

    try {
        htmlAsStr = osStuff.stripBOM(fs.readFileSync(filename).toString());
    } catch (error) {
        console.log(chalk.red(`cannot read file:\n${filename}`));
        process.exit(3);
    }

    try {
        return cheerio.load(htmlAsStr);
    } catch (error) {
        console.log(chalk.red(`cannot parse file as HTML:\n${filename}`));
        process.exit(4);
    }
}

type createSolidHtmlContentParams = {
    rootDir: string;
    filename: string;
    addMissingFavicon: boolean;
    replace: ReplacePair[];
    keepmaps: boolean;
};

export function createSolidHtmlContent(options: createSolidHtmlContentParams): string {
    const { rootDir, filename, addMissingFavicon, replace: replacePairs, keepmaps } = options;

    let $ = step_loadAndParseHtml(filename);
    const files = step_GetDocumentLinks($, filename, replacePairs);
    step_LoadLinksContentAndEmbed($, files, rootDir);
    step_EmbedIcon($, files, rootDir, addMissingFavicon);

    let cnt = $.html();

    if (!keepmaps) {
        cnt = cnt.replace(/\/\*#\s*sourceMappingURL=.+\.map\s*\*\//g, '');
    }

    return cnt;
}
