const merge = require('webpack-merge')
const base = require('./webpack.base.js');
const webpack = require('webpack');
const config = require('../config/config.js')

module.exports = merge(base,{
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
			test:/\.less$/,
			use:['style-loader','css-loader','less-loader']
		}]
   	},
	plugins:[
		new webpack.DefinePlugin({
	      'process.env': config.env
	    }),
		new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
	]
})
