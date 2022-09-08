[![npm version](https://badge.fury.io/js/gluehtml.svg)](https://badge.fury.io/js/gluehtml)

# Overview

gluehtml packs HTML file includes into a single self-contained HTML file with no references to the local .js or .css files. The output can be used in some restricted systems or quickly copied to a different locations.

![](assets/preview.png)

# Install

```bash
yarn global add gluehtml
```

<!-- 
    "scripts": {
        "dev": "parcel build src/index.ts --target node --no-optimize",
        "build-ts": "parcel build src/cli.ts --no-source-maps --no-optimize",
        "build": "rm -rf dist && yarn build-ts && cp src/cli.js dist",
        "prepublish": "yarn build"
    },
 -->
 
 <!-- 
    "main": "dist/cli.js",
  -->

  <!-- 
    "targets": {
        "main": {
            "includeNodeModules": true,
            "source": "src/main.ts",
            "distDir": "./dist"
        }
    },

    "outputFormat": "commonjs"

const main = require(src);
console.log('\ntm', main);

   -->