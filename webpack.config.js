const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: '/\.ts$/',
                use: ['ts-loader']
            }
        ]
    },
    devtool: 'source-map',
    mode: 'development',
};
