## Links

E:\Y\W\1-node\1-utils\test-gulp-plugins\single-html
E:\Y\W\1-node\1-utils\web-scraping\coursehunters-course-list-browser\vue.config.js
https://github.com/DustinJackson/html-webpack-inline-source-plugin/blob/master/index.js
    https://www.npmjs.com/package/escape-string-regexp Escape RegExp special characters
    https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
    https://www.npmjs.com/package/slash
    //
    G: 'source-map-url'
    https://www.npmjs.com/package/source-map-url
    https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ ''Introduction to JavaScript Source Maps

https://github.com/vuejs/vue-next/blob/master/scripts/build.js
https://npm.taobao.org/package/minimist
https://www.npmjs.com/package/fs-extra

### G: 'vinyl source'
https://www.npmjs.com/package/vinyl-source-stream
https://www.npmjs.com/package/vinyl-fs

### Dev

https://github.com/vuejs/vue-next/blob/master/scripts/build.js
https://www.npmjs.com/package/fs-extra
https://npm.taobao.org/package/minimist
https://nodejs.org/api/path.html#path_path_basename_path_ext

### Dev (initial)

https://www.npmjs.com/package/dotenv
https://webpack.js.org/guides/environment-variables/
https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172#d60a 'The Fine Art of the Webpack Config'
https://webpack.js.org/loaders/
G: '"embed" favicon into html'
    https://stackoverflow.com/questions/53962736/embed-svg-icon-into-html 'Embed SVG icon into html' !!! <- ```<link rel="icon" href="data:image/png;base64,...">```
G: 'npm data-url'
    https://github.com/brianloveswords/dataurl/blob/master/index.js
G: 'data-url favicon'
    //https://stackoverflow.com/questions/5199902/isnt-it-silly-that-a-tiny-favicon-requires-yet-another-http-request-how-can-i !!! 'Isn't it silly that a tiny favicon requires yet another HTTP request? How can I put the favicon into a sprite?' ```<link href="data:image/x-icon;base64,iVBORw...QmCC" rel="icon" type="image/x-icon" /> ```

    ```js
    var favIcon = "\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrUlEQVR42mNkwAOepOgxMTD9mwhk\
5gDxQSB2l5l15SeyGkYGAuBJMtAQ5n+rgcwgIF4ENCCeJAOghvADXbIHqNoEyK0BGtKK14DXU9lA\
ThZiYPw/XTTr92uId3SVgKoPA8WkgNxIoCErsBrwdhoL57//TGeATC0gfgVUMRlo+2zRjD8vn6Rr\
mzH8ZT4E5IOU+gAN2YNhwMOJ/Ey8bJ+VgGYnAQ3K/f+fkQco/AYYDjP+feHs/fNQyub/N44NQJe0\
ysy5VI83DF5M5pRkY/mVyfCfIRtomNB/pv9v//9infbnucgZ5l/MW8T7HvxDMWB9hT3nXwbmrH//\
mO4Bubc4Wb/f9W09+uNmjwQPP/vHNHaWXwX/Gf7LsjD9k+FLZ3iKEQYbKmy1/jKwXIXx//1nfPvv\
P/MVJsZ/RzlYfpwX4nj/T5zrNbtK8evlWGNhcYU3Px/DR+f/DExGQK4pEKsCseJ/oDKgF0AGMvxj\
ZLIP79xzCMWA3Jyc/yB68pQpGGEyuyJEhJXhtwYLELMx/NL9wcDRcfqLwjOYegwDYGxcAFkNbQxg\
IALgNIBUQBUDAFi2whGNUZ3eAAAAAElFTkSuQmCC";
    ```
```js
var docHead = document.getElementsByTagName('head')[0];
var newLink = document.createElement('link');
newLink.rel = 'shortcut icon';
newLink.type = 'image/x-icon';
newLink.href = 'data:image/png;base64,'+favIcon;
docHead.appendChild(newLink);
/* Other JS would also be in here */
```

##  Using

Create sortcut and add 'node' before target and use drag-n-drop on shortcut. 

## Done
