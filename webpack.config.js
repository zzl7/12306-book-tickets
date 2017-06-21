var webpack = require('webpack');
module.exports = {
    entry: __dirname + "/src/main.jsx",//唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    "resolve": {
        "extensions": [".js", ".jsx"]
    },
    module: {//在配置文件里添加JSON loader

        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    "css-loader",
                    'sass-loader?sourceMap=true',
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader",
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
        ]
    },
    devServer: {

        contentBase: "./public",//本地服务器所加载的页面所在的目录
        // historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 8888,
        // hot: true,
        stats: { colors: true },
        proxy: {
            "/v1/**": {
                target: 'http://localhost:3000',
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new webpack.BannerPlugin("Copyright Flying Unicorns inc.")//在这个数组中new一个就可以了
    ],
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
}