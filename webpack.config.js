const TsconfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");

const path = require("path");
const res = (...segments) => path.resolve(__dirname, ...segments);
const src = (...segments) => res("src", ...segments);

module.exports = (_, argv) => ({
  mode: argv.mode,
  entry: src("index.ts"),
  output: {
    filename: "[name].js",
    path: res("out"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(c|m)js$/i,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.ts?$/i,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".cjs", ".mjs", ".ts", ".json"],
    plugins: [
      new TsconfigPathsWebpackPlugin({ configFile: res("tsconfig.json") }),
    ],
  },
  devtool: argv.mode === "development" ? "eval" : false,
  target: "async-node14",
  externalsPresets: { node: true },
});
