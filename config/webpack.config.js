const path = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry:{
		app:'./src/app.js',
		index:'./src/index.js'
	},
	output:{
		filename:'js/[name].js',
		path:path.resolve(__dirname,'dist'),
		publicPath:''
	},
	devtool: 'inline-source-map',
	devServer: {
     contentBase: './dist',
     hot: true,
   	},
	module:{
		rules:[{
			test:/\.css$/,
			use:['style-loader','css-loader']
		},{
			test:/\.(jpg|png|svg|gif)$/,
			use:['file-loader']
		},{
			test:/\.(woff|woff2|eot|ttf|otf)/,
			use:['file-loader']
		},{
			test:/\.xml$/,
			use:['xml-loader']
		}]
	},
	plugins:[
		new htmlwebpackplugin({
			title:'haha'
		}),
		new cleanWebpackPlugin(['dist']),
		new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin()
	]
}
