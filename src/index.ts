import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

// let $ = cheerio.load('<a></a>');
// console.log($.html());

function parseHtmlContent(orgHtml: string) {
    let $ = cheerio.load(orgHtml);

    let rv = {
        links: [],
        scripts: []
    }

    $('link').each((index, el) => rv.links.push(path.normalize(el.attribs.href)));
    $('script').each((index, el) => rv.scripts.push(path.normalize(el.attribs.src)));

    return rv;
}

function main() {
    const args = minimist(process.argv.slice(2));

    let name = path.normalize(args.file);
    try {
        if (fs.statSync(name).isDirectory()) {
        }
        else {
        }
    }
    catch (err) {
        console.log(err);
    }
}

console.log(parseHtmlContent('<a></a>'));
main();
console.log('done5');

