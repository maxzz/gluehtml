import fs from "fs-extra";
import chalk from "chalk";
import cheerio from "cheerio";
import { osStuff, ReplacePair } from "../utils";
import { step_GetDocumentLinks } from "./2-step-get-links";
import { step_LoadLinksContentAndEmbed } from "./3-step-load-links";
import { step_EmbedIcon } from "./4-step-embed-icon";

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

    let cnt = $.html().replace(/<(html|head|\/html)/g, '\n<$1').replace(/<(body)/g, '\n<$1');

    if (!keepmaps) {
        cnt = cnt.replace(/\/\*#\s*sourceMappingURL=.+\.map\s*\*\//g, '');
    }

    return cnt;
}
