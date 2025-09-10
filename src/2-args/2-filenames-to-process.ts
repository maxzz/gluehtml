import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { runOptions } from "../utils";

export function getHtmlFilenamesToProcess(target: string): string[] {
    let fileNames: string[] = [];

    let src = path.normalize(target);

    if (fs.statSync(src).isDirectory()) {
        fileNames =
            fs.readdirSync(src)
                .filter(fname => path.extname(fname) === '.html' && !~fname.indexOf(runOptions.suffix))
                .map(fname => path.join(src, fname));
    } else {
        fileNames = [src];
    }

    if (!fileNames.length) {
        console.log(chalk.yellow(`  No HTML files found in folder "${src}"`));
    }

    return fileNames;
}
