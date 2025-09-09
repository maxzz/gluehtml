import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { osStuff, runOptions } from "../utils";
import { createSolidHtmlContent } from "../3-content";

export function handleSingleHtml(fname: string): void {
    fname = path.resolve(fname);
    const rootDir = path.dirname(fname);

    const newCnt = createSolidHtmlContent({
        rootDir,
        filename: fname,
        addMissingFavicon: runOptions.favicon,
        replace: runOptions.replace,
        keepmaps: runOptions.keepmaps
    });

    let destName = '';
    const destDir = path.dirname(fname);

    if (runOptions.output) {
        const dir = path.resolve(destDir, runOptions.output);
        fs.mkdirSync(dir, { recursive: true });
        destName = path.join(dir, path.basename(fname));
    } else {
        const base = osStuff.fnameWoExt(path.basename(fname));
        const ext = path.extname(fname);
        destName = path.join(rootDir, `${base}${runOptions.suffix}${ext}`);
    }

    fs.writeFileSync(destName, newCnt);

    console.log(chalk.gray(`  new file saved to: ${destName}`));
}
