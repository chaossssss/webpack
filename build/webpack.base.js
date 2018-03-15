const path = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config/config.js')
const webpack = require('webpack');

const entrys = config.pages.reduce((sum,page)=>{
	sum[page] = './src/page/'+page+'/index.js';
	return sum;
},{})

const htmlPlugins = config.pages.map(page=>{
	return new htmlwebpackplugin({
			title:config.env.mode === '"production"' ? '@Html.Action("SeoModel","PartialView",new { name = "seoIndex", id = 0})' : ('<title>'+page+'</title>'),
			template:'src/page/'+page+'/index.ejs',
			filename:page+'.html',
			inject:'body',
			chunks:[page,'common']
		})
})

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	context:path.resolve(__dirname,'../'),
	entry:entrys,
	output:{
		filename:'js/[name]-[hash].js',
		path:path.resolve(__dirname,'../dist'),
		publicPath:''
	},
  resolve: {
    extensions: ['.js', '.ejs'],
    alias: {
      '@':resolve('src/components'),
      'C':resolve('src/common')
    }
  },
	module:{
		rules:[{
			test:/\.(jpg|png|svg|gif)$/,
			use:[{
					loader:'url-loader',
					options:{
						limit: 10000,
						name:'img/[name].[ext]'
					}
				}],
				include: [resolve('src')]
		},{
			test:/\.(woff|woff2|eot|ttf|otf)/,
			use:[{
				loader:'file-loader',
				options:{
						name:'font/[name].[ext]'
					}
				}],
			
		},{
			test:/\.xml$/,
			use:['xml-loader']
		},{
			test:/\.ejs$/,
			use:['jcy-loader'],
			include: [resolve('src')]
		},{
		  test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
		  loader: 'expose-loader?$!expose-loader?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`,导出window.$，不然在页面上找不到$
		}]
	},
	plugins:[
	  new webpack.ProvidePlugin({
	    $: 'jquery',
	    jQuery: 'jquery',
	    'window.jQuery': 'jquery',
	    'window.$': 'jquery',
	  }),
		...htmlPlugins,
		new cleanWebpackPlugin(['dist'],{
			root: path.resolve(__dirname,'../')
		})
	]
}
