var path = require("path");
var webpack = require("webpack");

module.exports = {
	target: "web",
	entry: {
		builddetailswidget: "./src/build-details.ts",
        buildoverviewswidget: "./src/build-overview.ts",
        builddetailsconfigurationwidget: "./src/build-details-configuration.ts",
        buildoverviewconfigurationwidget: "./src/build-overview-configuraiton.ts",

        releasedetailswidget: "./src/release-details.ts",
        releaseoverviewwidget: "./src/release-overview.ts",
        releasedetailsconfigurationwidget: "./src/release-details-configuration.ts",
        releaseoverviewconfigurationwidget: "./src/release-overview-configuration.ts"
    },
	output: {
		filename: "[name].js",
		libraryTarget: "amd"
	},
	externals: [
		/^VSS\/.*/, /^TFS\/.*/, /^q$/
	],
	resolve: {
		extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		modules: [path.resolve("./src"), "node_modules"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				enforce: "pre",
				loader: "tslint-loader",
				options: {
					emitErrors: true,
					failOnHint: true
				}
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};