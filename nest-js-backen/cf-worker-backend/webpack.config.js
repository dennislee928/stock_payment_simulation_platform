const path = require('path');

module.exports = {
	entry: './src/main.ts',
	output: {
		filename: 'index.js',
		path: path.join(__dirname, 'dist'),
		libraryTarget: 'commonjs',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	target: 'webworker',
	mode: 'production',
	optimization: {
		minimize: false,
	},
};
