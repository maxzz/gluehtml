import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

function createSolidHtmlContent(rootDir: string, htmlString: string): string {
    // 1. Parse HTML
    let $ = cheerio.load(htmlString);

    let externals = {
        links: [],
        scripts: []
    }
    $('link').each((index, el) => el.attribs.href && externals.links.push({ url: el.attribs.href, el: el, rel: el.attribs.rel }));
    $('script').each((index, el) => el.attribs.src && externals.scripts.push({ url: el.attribs.src, el: el }));

    // 2. Load the content of externals
    [...externals.links, ...externals.scripts].forEach(item => {
        try {
            if (!item.rel || ~item.rel.trim().toLowerCase().indexOf('stylesheet')) { // skip 'rel=icon'; handle =stylesheet and ="stylesheet"
                item.cnt = fs.readFileSync(path.join(rootDir, item.url)).toString();
            }
        } catch (err) {
            console.log(`Failed to read: '${item.url}'`, err);
        }
    });

    // 3. Update elements
    externals.links.forEach(item => {
        item.cnt && $(item.el).replaceWith(`\n<style>\n${item.cnt}\n</style>\n`);
    });

    externals.scripts.forEach(item => {
        item.cnt && $(item.el).replaceWith(`\n<script>\n${item.cnt}\n</script>\n`);
    });

    return $.html();
}

function createSolidHtml(filename: string): void {
    filename = path.resolve(filename);
    let rootDir = path.dirname(filename);

    let htmlString = fs.readFileSync(filename).toString();
    let newCnt = createSolidHtmlContent(rootDir, htmlString);

    let dest = path.join(rootDir, `${path.basename(filename, '.html')}${SUFFIX}${path.extname(filename)}`);
    fs.writeFileSync(dest, newCnt);
}

var SUFFIX = '--single';

function main() {
    const args = minimist(process.argv.slice(2));

    let name = args.path || args['_'][0];
    if (!name || !fs.existsSync(name)) {
        console.log(`Provide HTML filename or folder name with HTML files.`);
        process.exit(1);
    }

    args.suffix && typeof args.suffix === 'string' && (SUFFIX = args.suffix);

    try {
        name = path.normalize(name);
        if (fs.statSync(name).isDirectory()) {
            let dir = fs.readdirSync(name);
            let names = dir
                .filter(_ => path.extname(_) === '.html' && !~_.indexOf(SUFFIX))
                .map(_ => path.join(name, _));
            names.forEach(createSolidHtml);
            names || console.log(`No HTML files found in "${name}"`);
        }
        else {
            createSolidHtml(name);
        }
    }
    catch (err) {
        console.log(err);
        process.exit(2);
    }
}

main();
console.log('Done');

