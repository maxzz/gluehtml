const path = require('path');

module.exports = env => {

    console.log(env);

    return {
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'build.js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                }
            ]
        },
        devtool: 'source-map',
        mode: 'development',
        target: 'node',
    };
};
