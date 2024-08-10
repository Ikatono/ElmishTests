const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/Program.fs.js",
    devtool: "eval-source-map",

    devServer: {
        devMiddleware: {
            publicPath: "/"
        },
        port: 8080,
        proxy: undefined,
        hot: true,
        static: {
            directory: path.resolve(__dirname, "./dist"),
            staticOptions: {},
        },
    },
    module: {
        rules: [{
            test: /\.fs(x|proj)?$/,
            use: "fable-loader"
        }]
    }
}
