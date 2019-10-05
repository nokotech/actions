module.exports = {
    mode: process.env.NODE_ENV || 'development',
    target: 'node',
    entry: {
        release: './src/release.ts',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/lib',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
                exclude: /node_modules/,
            },
        ],
    },
};
