var webpack = require('webpack');
module.exports = {
    entry: ['react-hot-loader/patch', 'webpack-hot-middleware/client', __dirname + "/src/main.js"],//唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
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
                test: /\.json$/,
                loader: "json-loader",
            },
            {
                test: /\.js?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
        ]
    },
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 8888
    },
    plugins:[
        new webpack.BannerPlugin("Copyright Flying Unicorns inc."),//在这个数组中new一个就可以了
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
}