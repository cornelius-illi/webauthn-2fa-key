const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  indentWidth: 4,
                  includePaths: ["./node_modules", "./scss"],
                },
              },
            },
          ],
        },
      ],
    },
  };