#!/usr/bin/env node
const path = require('path');
const main = path.join(path.dirname(process.argv[1]), './index.js');

require(main).main();
