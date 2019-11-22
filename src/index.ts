import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

// let $ = cheerio.load('<a></a>');
// console.log($.html());

function parseHtmlContent(htmlString: string) {
    let $ = cheerio.load(htmlString);

    let rv = {
        links: [],
        scripts: []
    }

    $('link').each((index, el) => rv.links.push({ url: el.attribs.href }));
    $('script').each((index, el) => rv.scripts.push({ url: el.attribs.src }));

    return rv;
}

function createSolidHtmlContent(filename: string): string {

    let parent = path.dirname(path.resolve(filename));

    let htmlString = fs.readFileSync(filename).toString();
    let externals = parseHtmlContent(htmlString);
    
    [...externals.links, ...externals.scripts].forEach(item => {
        try {
            let fname = path.join(parent, item.url);

            item.cnt = fs.readFileSync(fname).toString();
        } catch (err) {
            console.log(`Failed to read: '${item.url}'`, err);
        }
    });

    console.log(externals);

    return '';
}

function main() {
    const args = minimist(process.argv.slice(2));

    let name = path.normalize(args.file);
    try {
        if (fs.statSync(name).isDirectory()) {
        }
        else {
            let newCnt = createSolidHtmlContent(name);
            console.log(newCnt);
        }
    }
    catch (err) {
        console.log(err);
    }
}

main();
console.log('done5');

