
module.exports = {
    entry: './src/index.js',
    output: {
        library: 'EasyBase',
        libraryTarget: 'umd',
        filename: 'bundle.js',
    },
    optimization: {
        minimize: false // I import minified libraries by default
    }
}