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
		fallback: {
			stream: require.resolve('stream-browserify'),
			buffer: require.resolve('buffer/'),
			util: require.resolve('util/'),
			path: require.resolve('path-browserify'),
			fs: false,
			crypto: require.resolve('crypto-browserify'),
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
