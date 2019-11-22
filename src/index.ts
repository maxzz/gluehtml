import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';

function createSolidHtmlContent(filename: string): string {

    let htmlString = fs.readFileSync(filename).toString();

    // 1. Parse HTML
    let $ = cheerio.load(htmlString);

    let externals = {
        links: [],
        scripts: []
    }
    $('link').each((index, el) => externals.links.push({ url: el.attribs.href, el: el, rel: el.attribs.rel }));
    $('script').each((index, el) => externals.scripts.push({ url: el.attribs.src, el: el }));

    // 2. Load the content of externals
    let parent = path.dirname(filename);
    
    [...externals.links, ...externals.scripts].forEach(item => {
        try {
            if (!item.rel || item.rel.trim().indexOf('stylesheet') !== -1) { // skip 'rel=icon'; handle =stylesheet and ="stylesheet"
                item.cnt = fs.readFileSync(path.join(parent, item.url)).toString();
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

function main() {
    const args = minimist(process.argv.slice(2));

    let name = path.normalize(args.file);
    try {
        if (fs.statSync(name).isDirectory()) {
        }
        else {
            name = path.resolve(name);
            let newCnt = createSolidHtmlContent(name);
            
            let dest = path.join(path.dirname(name), path.basename(name) + '-single' + path.extname(name));
            fs.writeFileSync(dest, newCnt);
        }
    }
    catch (err) {
        console.log(err);
    }
}

main();
console.log('done5');

