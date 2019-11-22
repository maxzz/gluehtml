import cheerio from 'cheerio';
import path from 'path';

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

console.log(parseHtmlContent('<a></a>'));


console.log('done5');
