const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

let conf = {
	entry: [
		'webpack-hot-middleware/client',
		'./src/index.js'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.min.js'
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		inline: true,
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
		          fallback: "style-loader",
		          use: ["css-loader", "sass-loader"]
		        })
			},
			{
				test: /\.(jpg|png|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
							publicPath: './'
						}
					}
				] 
				
			}
		]
	},
	plugins: [
    	new HtmlWebpackPlugin({
    		template: path.resolve(__dirname, './src/index.html'),
    		filename: path.resolve(__dirname, './dist/index.html')
    	}),
    	new ExtractTextPlugin("style.css"),
    	new webpack.HotModuleReplacementPlugin(),
    	new webpack.ProvidePlugin({
		  $: 'jquery',
		  jQuery: 'jquery'
		})
  	]
};

module.exports = (env, options) => {
	let production = options.mode === 'production';
	conf.devtool = production ? false : 'eval-sourcemap';
	return conf;
}