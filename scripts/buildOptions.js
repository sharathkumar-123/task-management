const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const getClientEnvironment = require("./env");

const appPath = fs.realpathSync(process.cwd());
const srcPath = path.resolve(appPath, "src");
const distPath = path.resolve(appPath, "dist");
const entryPath = path.resolve(__dirname, "..", "./src/index.tsx");

const getDevOptions = (argv) =>
  argv.mode !== "production"
    ? {
        devtool: "eval-source-map",
        devServer: {
          historyApiFallback: true,
          port: 3000,
        },
      }
    : {};

const getBaseOptions = () => ({
  mode: "development",
  entry: entryPath,
  output: {
    filename: "bundle.[contenthash].js",
    path: distPath,
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "eslint-loader",
            options: {
              eslintPath: require.resolve("eslint"),
            },
          },
        ],
      },
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              esModule: true,
            },
          },
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[name]__[local]___[hash:base64:5]" },
            },
          }
        ],
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.scss$/i,
        use: ["style-loader", "css-loader", 'sass-loader'],
      },
      {
        test: /\.module\.scss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[name]__[local]___[hash:base64:5]" },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.ttf$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|mp4|mkv|mov|otf|woff|svg|jpeg|xlsx|mp3|gif)$/,
       
        use: [
          {
            loader: require.resolve("file-loader"),
            options: {
              name: "media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "..", "./src/index.html"),
    }),
    new webpack.DefinePlugin(getClientEnvironment()),
  ],
});

module.exports = {
  getBaseOptions,
  getDevOptions,
};
