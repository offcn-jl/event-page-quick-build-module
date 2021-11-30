const path = require("path");
// const base = path.join(__dirname, "..");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");

const config = {
    mode: "development",
    // entry: path.resolve(base, "src", "index.ts"),
    entry: {
        main: path.resolve("src", "main.ts"),
        sso: path.resolve("src", "sso.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    devtool: 'source-map',// 打包出的js文件是否生成map文件（方便浏览器调试）
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre', // 增加这个参数可以避免 tslint 报错 ( Forbidden 'var' keyword, use 'let' or 'const' instead ), 猜测可能是 tslint 检查了编译后的代码导致的
                use: [
                    {
                        loader: 'tslint-loader',
                        // options: {
                        //   configFile: path.resolve(base, 'tslint.json'),
                        // },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        // options: {
                        //   // 指定特定的ts编译配置，为了区分脚本的ts配置
                        //   configFile: path.resolve(base, 'tsconfig.json'),
                        // },
                    },
                ],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [],
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        // 开发环境
        config.devtool = 'source-map'; // 打包出的js文件是否生成map文件（方便浏览器调试）
        config.devServer = {
            // https: true, // 开启 TLS
            static: {
                // directory: path.resolve(base, 'public'),
                directory: 'public',
            },
            proxy: {
                '/ssogateway/v1/': {
                    target: 'http://39.105.37.226:80', // sso 网关
                    changeOrigin: true,
                    pathRewrite: {'^': ''},
                    // 需要设置 Host header 才能正确的返相应内容
                    headers: {
                        Host: 'localhost',
                    },
                },
            },
        }
    }

    if (argv.mode !== 'production' && argv.mode !== 'development') {
        // 测试环境
        config.plugins = [
            // 使用这个插件在每次构建前清理制品目录
            new CleanWebpackPlugin({
                verbose: true,
            }),
            // 使用这个插件复制无需编译的静态资源到制品目录
            new CopyPlugin({
                patterns: [
                    {from: "./public", to: "./"}
                ]
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"test"'
                }
            })
        ]
    }

    if (argv.mode === 'production') {
        // 生产环境
        config.mode = "production";
        config.plugins = [
            // 使用这个插件在每次构建前清理制品目录
            new CleanWebpackPlugin({
                verbose: true,
            }),
            // 使用这个插件复制无需编译的静态资源到制品目录
            new CopyPlugin({
                patterns: [
                    {from: "./public", to: "./"}
                ]
            })
        ]
    }

    return config;
};

