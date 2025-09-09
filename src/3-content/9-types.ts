export type Item = {
    el: cheerio.TagElement; // DOM element
    url: string;            // element url
    rel?: string;           // skip 'rel=icon' but handle =stylesheet and ="stylesheet"
    cnt?: string;           // file content
    isLoadable?: boolean;   // is file local and can be embedded (i.e. not: image, svg (except favicon), font, js module)
};
