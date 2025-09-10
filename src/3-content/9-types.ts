export type AlianItem = {   // External file to load which is alian to the current HTML file
    el: cheerio.TagElement; // DOM element
    tag: string;            // element tag
    url: string;            // element url
    rel?: string;           // skip 'rel=icon' but handle =stylesheet and ="stylesheet"
    cnt?: string;           // file content
    isLoadable?: boolean;   // is file local and can be embedded (i.e. not: image, svg (except favicon), font, js module)
};
