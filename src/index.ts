import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

function createSolidHtmlContent(rootDir: string, htmlString: string): string {
    // 1. Parse HTML
    let $ = cheerio.load(htmlString);

    const tagSTYLE = 'style';
    const tagSCRIPT = 'script';

    let files = [];
    $('link').each((idx, el) => el.attribs.href && files.push({ el: el, url: el.attribs.href, tag: tagSTYLE, rel: el.attribs.rel }));
    $('script').each((idx, el) => el.attribs.src && files.push({ el: el, url: el.attribs.src, tag: tagSCRIPT }));

    // 2. Load the content of externals relative to the HTML file location (server locations are ignored).
    files.forEach(_ => {
        try {
            if (!_.rel || ~_.rel.trim().toLowerCase().indexOf('stylesheet')) { // skip 'rel=icon'; handle =stylesheet and ="stylesheet"
                _.cnt = fs.readFileSync(path.join(rootDir, _.url)).toString();
            }
        } catch (err) {
            console.log(`Failed to read: '${_.url}'`, err);
        }
    });

    // 3. Update elements
    files.forEach(_ => _.cnt && $(_.el).replaceWith(`\n<${_.tag}>\n${_.cnt}\n</${_.tag}>\n`));

    // 4. Try to embed favicon
    let iconEl = files.find(_ => _.rel && ~_.rel.indexOf('icon'));
    try {
        let buf = fs.readFileSync(path.join(rootDir, iconEl.url));
        let b64 = `data:image/png;base64,${buf.toString('base64')}`;
        let el = `<link rel="shortcut icon" type="image/x-icon" href="${b64}"></link>`;
        $(iconEl.el).replaceWith(el);
    } catch(err) {
        console.log(`Cnnnot load favicon: '${iconEl.url}'`, err);
    }

    return $.html();
}

let SUFFIX = '--single';

function createSolidHtml(filename: string): void {
    filename = path.resolve(filename);
    let rootDir = path.dirname(filename);

    let htmlString = fs.readFileSync(filename).toString();
    let newCnt = createSolidHtmlContent(rootDir, htmlString);

    let dest = path.join(rootDir, `${path.basename(filename, '.html')}${SUFFIX}${path.extname(filename)}`);
    fs.writeFileSync(dest, newCnt);
}

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

