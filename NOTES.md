## Links

* E:\Y\W\1-node\1-utils\test-gulp-plugins\single-html
* E:\Y\W\1-node\1-utils\web-scraping\coursehunters-course-list-browser\vue.config.js
* https://github.com/DustinJackson/html-webpack-inline-source-plugin/blob/master/index.js

  * https://www.npmjs.com/package/escape-string-regexp Escape RegExp special characters
  * https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
  * https://www.npmjs.com/package/slash

  * G: 'source-map-url'
    * https://www.npmjs.com/package/source-map-url
    * https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ 'Introduction to JavaScript Source Maps'

* https://github.com/vuejs/vue-next/blob/master/scripts/build.js
* https://npm.taobao.org/package/minimist
* https://www.npmjs.com/package/fs-extra

### G: 'vinyl source'
* https://www.npmjs.com/package/vinyl-source-stream
* https://www.npmjs.com/package/vinyl-fs

### Dev

* https://github.com/vuejs/vue-next/blob/master/scripts/build.js
* https://www.npmjs.com/package/fs-extra
* https://npm.taobao.org/package/minimist
* https://nodejs.org/api/path.html#path_path_basename_path_ext

### Dev (initial)

* https://www.npmjs.com/package/dotenv
* https://webpack.js.org/guides/environment-variables/
* [The Fine Art of the Webpack Config](https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172#d60a)
* https://webpack.js.org/loaders/
* G: '"embed" favicon into html'
    * !!! [Embed SVG icon into html](https://stackoverflow.com/questions/53962736/embed-svg-icon-into-html) <- ```<link rel="icon" href="data:image/png;base64,...">```
* G: 'npm data-url'
    * https://github.com/brianloveswords/dataurl/blob/master/index.js
* G: 'data-url favicon'
    * !!! [Isn't it silly that a tiny favicon requires yet another HTTP request? How can I put the favicon into a sprite?](https://stackoverflow.com/questions/5199902/isnt-it-silly-that-a-tiny-favicon-requires-yet-another-http-request-how-can-i) ```<link href="data:image/x-icon;base64,iVBORw...QmCC" rel="icon" type="image/x-icon" /> ```

        ```js
        var faviconBase64 = "iVBORw0KGgo ... TkSuQmCC";

        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.type = 'image/x-icon';
        link.href = 'data:image/png;base64,' + faviconBase64;
        head.appendChild(link);
        ```

G: 'node.js buffer base64 decode'

  * [Encoding and Decoding Base64 Strings in Node.js](https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/)

##  Using

Create sortcut and add 'node' before target and use drag-n-drop on shortcut. 

## Done
