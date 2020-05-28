import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import chalk from 'chalk';

namespace Content {
    const DEF_FAVICON = 'data:image/png;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QQCDuEEAg7hBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBM4O4QTODuEEAg7hBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QQuDuEGxg7hBsYO4QQuDuEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBWoO4QfeDuEH3g7hBWoO4QQCDuEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg7hBAIO4QRqDuEHJg7hB/4O4Qf+DuEHJg7hBGoO4QQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIO4QQCDuEEAg7hBeoO4Qf6DuEH/g7hB/4O4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';

    function stripBOM(content: string): string {
        // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
        // because the buffer-to-string conversion in `fs.readFileSync()`
        // translates it to FEFF, the UTF-16 BOM.
        return content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
    }
    
    export function createSolidHtmlContent(rootDir: string, filename: string, addMissingFavicon: boolean, replace: ReplacePair[]): string {
        // 1. Parse HTML
        let htmlAsStr = stripBOM(fs.readFileSync(filename).toString());
        let $ = cheerio.load(htmlAsStr);
    
        const tagSTYLE = 'style';
        const tagSCRIPT = 'script';
    
        type Item = {
            el: CheerioElement;
            url: string;
            htmlTag: string;
            rel?: string;
            cnt?: string;
        }
        
        const allFiles: Item[] = [];
    
        $('link').each((idx: number, el: CheerioElement) => {
            el.attribs.href && allFiles.push({
                el: el,
                url: el.attribs.href,
                htmlTag: tagSTYLE,
                rel: el.attribs.rel
            });
        });
        
        $('script').each((idx: number, el: CheerioElement) => {
            el.attribs.src && allFiles.push({
                el: el,
                url: el.attribs.src,
                htmlTag: tagSCRIPT
            });
        });

        // 2. Skip remote files
        let files = allFiles.filter((_: Item) => {
            let isLocal: boolean | number = !_.rel || ~_.rel.trim().toLowerCase().indexOf('stylesheet'); // skip 'rel=icon' but handle =stylesheet and ="stylesheet"
            isLocal && (isLocal = !_.url.match(/^https?|^data:/));
            return isLocal;
        });

        console.log(chalk.green(`File ${filename}`));
        console.log(chalk.green(`  Local links ${files.length} of ${allFiles.length} total`));

        // 3. Remap files
        files.forEach((_: Item) => {
            //replace
        });
    
        // 4. Load the content of externals relative to the HTML file location (server locations are ignored).
        files.forEach((_: Item) => {
            try {
                const fname = path.join(rootDir, _.url);
                console.log(chalk.gray(`  Processing: ${fname}`));

                if (fs.existsSync(fname)) {
                    _.cnt = stripBOM(fs.readFileSync(fname).toString());
                } else {
                    console.log(chalk.yellow(`     Missing: ${fname}`));
                }
            } catch (error) {
                console.log(chalk.red(`  Failed to read: '${_.url}'\n   ${error}`));
            }
        });
    
        // 5. Replace links with content.
        files.forEach((_: Item) => {
            if (_.cnt) {
                $(_.el).replaceWith(`\n<${_.htmlTag}>\n${_.cnt}\n</${_.htmlTag}>\n`);
            }
        });
    
        // 6. Try to embed favicon
        let iconEl = files.find(_ => _.rel && ~_.rel.indexOf('icon') && _.url);
        if (iconEl) {
            try {
                const isLocal = iconEl.url && !iconEl.url.match(/^https?|^data:/);
                if (isLocal) {
                    const fname = path.join(rootDir, iconEl.url);
                    let buf = fs.readFileSync(fname);
                    let b64 = `data:image/png;base64,${buf.toString('base64')}`;
                    let el = `<link rel="shortcut icon" type="image/x-icon" href="${b64}"></link>\n`;
                    $(iconEl.el).replaceWith(el);
                } else {
                    console.log(chalk.gray(`  Skipped favicon with protocol <data:...>`));
                }
            } catch(err) {
                console.log(`Cnnnot load favicon: '${iconEl.url}'`, err);
            }
        } else if (addMissingFavicon) {
            let el = `<link rel="shortcut icon" type="image/x-icon" href="${DEF_FAVICON}"></link>\n`;
            $('head').append(el);
        }
    
        return $.html();
    }
    
} //namespace Content

type ReplacePair = {
    key: string;
    to: string;
}

type Options = {
    ADD_MISSING_FAVICON: boolean;
    SUFFIX: string;
    replace: ReplacePair[]
}

const options: Options = {
    ADD_MISSING_FAVICON: true,
    SUFFIX: '--single',
    replace: [],
};

function processSingleHtml(filename: string): void {
    filename = path.resolve(filename);
    const  rootDir = path.dirname(filename);
    const  newCnt = Content.createSolidHtmlContent(rootDir, filename, options.ADD_MISSING_FAVICON, options.replace);
    const  destName = path.join(rootDir, `${path.basename(filename, '.html')}${options.SUFFIX}${path.extname(filename)}`);
    fs.writeFileSync(destName, newCnt);
}

export function main() {
    const args = minimist(process.argv.slice(2), {
        boolean: ['nofav'],
        string: ['replace'],
        alias: {
            n: 'nofav',
            r: 'replace'
        },
        default: {
            nofav: false,
            replace: [],
        }
    });

    console.log(chalk.green(JSON.stringify(args)));

    let target = args.path || args['_'][0];

    if (!target || !fs.existsSync(target)) {
        console.log(chalk.yellow(`gluehtml is utility to glue .js and .css local files into HTML`));
        console.log(chalk.yellow(`Run: gluehtml htmlFile | folder`));
        console.log(chalk.yellow(`No files to glue.`));
        process.exit(1);
    }

    if (args.suffix && typeof args.suffix === 'string') {
        options.SUFFIX = `--${args.suffix}`;
    }

    if (args.nofav) {
        options.ADD_MISSING_FAVICON = false;
    }

    args.replace.forEach((_: string) => {
        const pair = _.split('=');
        if (pair.length === 2) {
            options.replace.push({key: pair[0], to: pair[1]});
        } else {
            console.log(chalk.yellow(`invalid pair" '${_}'`));
            process.exit(2);
        }
    });

    //return;

    try {
        let src = path.normalize(target);
        if (fs.statSync(src).isDirectory()) {
            const fileNames: string[] = fs.readdirSync(src)
                .filter(_ => path.extname(_) === '.html' && !~_.indexOf(options.SUFFIX))
                .map(_ => path.join(src, _));

            if (fileNames.length) {
                fileNames.forEach(processSingleHtml);
            } else {
                console.log(chalk.yellow(`  No HTML files found in folder "${src}"`));
            }
        } else {
            processSingleHtml(src);
        }
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('Done'));
} //main()
