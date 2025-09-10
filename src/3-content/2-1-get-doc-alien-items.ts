import { type AlianItem } from "./9-types";

export function getDocumentAlienItems($: cheerio.Root): AlianItem[] {
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
                isDuplicate: false,
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
                isDuplicate: false,
            });
        }
    );

    return alienFiles;
}
