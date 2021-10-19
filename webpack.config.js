const path = require("path");
const htmlwebpackplugin = require("html-webpack-plugin");
const htmlplugin = new htmlwebpackplugin(
    {
        template: path.join(__dirname,'/src/main/resources/templates/index.html'),
        filename: 'index.html'
    }
)

module.exports = [{
    entry: './react/index.js',
    devtool : 'source-map',
    mode : 'production',
    cache: true,
    output: {
        path: path.join(__dirname,'/src/main/resources/static/'),
        filename: "js/bundle.js",
        publicPath: '/',
        assetModuleFilename:'images/[name][ext]',
        clean:true
    },
    devServer : {
        port : 3000,
        watchContentBase : true,
        historyApiFallback: true,
        hot:true,
    },
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:'babel-loader'
            },
            {
                test: /\.scss$/,
                    use: 'sass-loader'
            },
            {
                test: /\.css$/,
                use:[
                    {loader : 'style-loader'},
                    {loader : 'css-loader'}
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif)$/i,
                type : 'asset/resource'
            },
            {
                test: /\.(mp4)$/i,
                type : 'asset/resource',
                generator: {
                    filename:'videos/[name][ext]'
                }
            }
        ]
    },plugins:[htmlplugin]
},
]
