import fs from "fs-extra";
import chalk from "chalk";
import cheerio from "cheerio";
import { osStuff } from "../utils";

export function step_loadAndParseHtml(filename: string): cheerio.Root {
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
