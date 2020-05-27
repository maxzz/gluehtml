#!/usr/bin/env node
const path = require('path');
const src = path.join(path.dirname(process.argv[1]), './main.js');

require(src).main();
