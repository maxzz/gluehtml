import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { osStuff } from "../utils";
import { runOptions } from "../2-args";
import { createSolidHtmlContent } from "../3-content";

export function handleFiles(filenames: string[]): void {
    filenames.forEach(handleSingleHtml);
}

function handleSingleHtml(fname: string): void {
    fname = path.resolve(fname);
    const rootDir = path.dirname(fname);

    // Create new HTML content
    const newCnt = createSolidHtmlContent({
        rootDir,
        filename: fname,
        addMissingFavicon: runOptions.favicon,
        replace: runOptions.replace,
        keepmaps: runOptions.keepmaps
    });

    // Get output filename
    let destName = '';
    if (runOptions.output) {
        const destDir = path.dirname(fname);
        const dir = path.resolve(destDir, runOptions.output);
        fs.mkdirSync(dir, { recursive: true });
        destName = path.join(dir, path.basename(fname));
    } else {
        const base = osStuff.fnameWoExt(path.basename(fname)); // fname as: 'c:\\users\\maxzz\\desktop\\03.20.23\\1\\index.html'
        const ext = path.extname(fname);
        destName = path.join(rootDir, `${base}${runOptions.suffix}${ext}`); // destName as 'c:\\users\\maxzz\\desktop\\03.20.23\\1\\index--single.html'
    }

    // Write new HTML content to file
    fs.writeFileSync(destName, newCnt);

    console.log(chalk.gray(`  3. New file saved to: \n    "${destName}"`));
}
