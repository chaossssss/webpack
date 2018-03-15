const merge = require('webpack-merge')
const base = require('./webpack.base.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config/config.js')

module.exports = merge(base,{

	output:{
		filename:'js/[name].js',
		publicPath:config.env.mode === 'production' ? '/dist/' : ''
	},
	module:{
		rules:[{
			test:/\.css$/,
			use: ExtractTextPlugin.extract({
	          fallback: 'style-loader',
	          use: ['css-loader','postcss-loader'],
	          publicPath:'../'
	       })
		},{
			test:/\.less$/,
			use: ExtractTextPlugin.extract({
	          fallback: 'style-loader',
	          use: [{ loader: 'css-loader', options: { importLoaders: 1 } },'postcss-loader','less-loader'],
	          publicPath:'../'
	       })
		}]
	},
	plugins:[
//      new UglifyJSPlugin(),
		new webpack.DefinePlugin({
	      'process.env': config.env
	    }),
		new ExtractTextPlugin({
	      filename:'css/[name].css'
	    }),
		new webpack.HashedModuleIdsPlugin(),
		//commonchunk 后一个实例在前一个的基础上提取公共代码，目前只需要第一个，全部打一个包
		new webpack.optimize.CommonsChunkPlugin({
	      name: 'common',
	      chunks:config.pages,
	      minChunks:2
	    }),
//		new webpack.optimize.CommonsChunkPlugin({
//	       name: 'vendor',
//	       minChunks (module) {
//	        return (
//	          module.resource &&
//	          /\.js$/.test(module.resource) &&
//	          module.resource.indexOf(
//	            path.join(__dirname, '../node_modules')
//	          ) === 0
//	        )
//	      }
//	    }),
//		new webpack.optimize.CommonsChunkPlugin({
//	       name: 'manifest',
//	       minChunks: Infinity
//	    })
	]
	
})
