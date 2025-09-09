import chalk from "chalk";
import { programName, programVersion } from "../utils";
import { getArguments, getFilenamesToProcess } from "../2-args";
import { handleSingleHtml } from "./1-handle-single-html";

export function main() {
    console.log(`\n${chalk.cyan(programName)} utility for gluing js and css into html files. version ${programVersion}`);

    const target = getArguments();
    const fileNames = getFilenamesToProcess(target);

    try {
        fileNames.forEach(handleSingleHtml);
    } catch (error) {
        console.log(chalk.red(error));
        process.exit(2);
    }

    console.log(chalk.green('\nAll done'));
}

//TODO: dynamic react imports and fonts: if they are not referenced then should be copied separately (or ?)
//TODO: if file not specified, check for index.html in current folder
