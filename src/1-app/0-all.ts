import chalk from "chalk";
import { programName, programVersion } from "../2-args";
import { getArguments, getHtmlFilenamesToProcess } from "../2-args";
import { handleFiles } from "./1-handle-single-html";

export function main() {
    console.log(`\n${chalk.cyan(programName)} utility for gluing js and css into html files. version ${programVersion}`);

    const target = getArguments();
    const htmlFilenames = getHtmlFilenamesToProcess(target);

    try {
        handleFiles(htmlFilenames);
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('\nAll done'));
}

//TODO: dynamic react imports and fonts: if they are not referenced then should be copied separately (or ?)
//TODO: if file not specified, check for index.html in current folder
