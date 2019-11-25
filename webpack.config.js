const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
    entry: {
        script: argv.target === 'electron-renderer' ? './src/index.electron.js' : './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/i,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
});
