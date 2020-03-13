var path = require("path");
var webpack = require("webpack");

module.exports = {
    devtool: 'inline-source-map',
    target: "web",
    
    entry: {
        builddetailsconfigurationwidget: "./src/build-details-configuration.ts",
        builddetailswidget: "./src/build-details.ts",

        buildoverviewconfigurationwidget: "./src/build-overview-configuration.ts",
        buildoverviewwidget: "./src/build-overview.ts",

        releasedetailsconfigurationwidget: "./src/release-details-configuration.ts",
        releasedetailwidget: "./src/release-details.ts",

        releaseoverviewconfigurationwidget: "./src/release-overview-configuration.ts",
        releaseoverviewwidget: "./src/release-overview.ts",
    },
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        devtoolModuleFilenameTemplate:    "webpack:///[absolute-resource-path]",
       
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/,/^ReleaseManagement\/.*/,
    ],
    resolve: {
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [path.resolve("./src"), "node_modules"],
    },
    module: {
        rules: [
            {
                enforce: "pre",
                loader: "tslint-loader",
                options: {
                    emitErrors: true,
                    failOnHint: true,
                },
                test: /\.tsx?$/,
            },
            {
                loader: "ts-loader",
                test: /\.tsx?$/,
            },
        ],
    },
};
