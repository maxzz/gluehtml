import { type ReplacePair } from "../2-args";
import { step_loadAndParseHtml } from "./1-step-load-and-parse-html";
import { step_GetDocumentLinks } from "./2-0-step-get-links";
import { step_LoadLinksContentAndEmbed } from "./3-step-load-links";
import { step_EmbedIcon } from "./4-step-embed-icon";

export function createSolidHtmlContent(options: createSolidHtmlContentParams): string {
    const { rootDir, filename, addMissingFavicon, replace: replacePairs, keepmaps } = options;

    let $ = step_loadAndParseHtml(filename);
    const files = step_GetDocumentLinks(filename, rootDir, replacePairs, $);

    // Update cheerio root element with new content.
    step_LoadLinksContentAndEmbed(files, rootDir, $);
    step_EmbedIcon($, files, rootDir, addMissingFavicon);

    // Create new HTML content and beautify it.
    let newCnt = $
        .html()
        .replace(/<(html|head|\/html)/g, '\n<$1') // add new lines before html, head and /html
        .replace(/<(body)/g, '\n<$1');            // add new lines before body

    // Remove source maps if not needed
    if (!keepmaps) {
        newCnt = newCnt.replace(/\/\*#\s*sourceMappingURL=.+\.map\s*\*\//g, '');
    }

    return newCnt;
}

type createSolidHtmlContentParams = {
    rootDir: string;
    filename: string;
    addMissingFavicon: boolean;
    replace: ReplacePair[];
    keepmaps: boolean;
};
