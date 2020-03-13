const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
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
    devtool: 'inline-source-map',
    devServer: {
        https: true,
        port: 3000
    },
    // output: {
    //     filename: "[name].js",
    //     libraryTarget: "amd",
    //     devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]",

    // },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve(
                "node_modules/azure-devops-extension-sdk"
            )
        }
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve(
                "node_modules/azure-devops-extension-sdk"
            )
        }
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "azure-devops-ui/buildScripts/css-variables-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.woff$/,
                use: [
                    {
                        loader: "base64-inline-loader"
                    }
                ]
            },
            {
                test: /\.html$/,
                use: "file-loader"
            }
        ],
    },
    plugins: [new CopyWebpackPlugin([{ from: "**/*.html", context: "src" }])]
};
