import path from "path";
import { type ReplacePair } from "../2-args";
import { type AlianItem } from "./9-types";
import { getDocumentAlienItems } from "./2-1-get-doc-alien-items";
import { printAllLinks, printFilteredFiles } from "./2-2-print-alien-items";

export function step_GetDocumentLinks(filename: string, rootDir: string, replacePairs: ReplacePair[], $: cheerio.Root): AlianItem[] {
    const alienFiles: AlianItem[] = getDocumentAlienItems($);

    alienFiles.forEach((file) => file.isLoadable = isLoadable(file));

    // 2. Skip items to remote files
    let localFiles = alienFiles.filter((file) => file.isLoadable);
    printAllLinks(filename, alienFiles, localFiles);

    // 3. Filter duplicates
    markDuplicates(localFiles, rootDir);
    printFilteredFiles(localFiles);

    // 4. Remap url name pairs defined by user through --replace option
    localFiles.forEach(
        (file: AlianItem) => {
            replacePairs.forEach(
                ({ key, to }: ReplacePair) => file.url = file.url.replace(key, to)
            );
        }
    );

    return localFiles;
}

function isLoadable(alianItem: AlianItem): boolean {
    let canbe = true;
    if (alianItem.tag === 'link') {                             // skip 'rel=icon', rel="modulepreload", but allow =stylesheet and ="stylesheet"
        canbe = !!alianItem.rel.match(/stylesheet/);            // !!rel.match(/(?:stylesheet|modulepreload)/): for now just keep stylesheet only
    }
    return canbe && !alianItem.url?.match(/^https?|^data:/);    // skip remote files and 'data:...' urls
}

function markDuplicates(localFiles: AlianItem[], rootDir: string) {
    const existing = new Set<string>();

    for (const item of localFiles) {
        const fname = path.join(rootDir, item.url);
        if (existing.has(fname)) {
            item.isDuplicate = true;
        } else {
            existing.add(fname);
        }
    }
}

