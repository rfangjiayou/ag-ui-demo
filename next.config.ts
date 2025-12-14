/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

/** @type {import('next').NextConfig} */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nextConfig = {
  webpack(config: any, { isServer, dev }: any) {
    // 如果还没有 MiniCssExtractPlugin，添加它
    if (!isServer) {
      const hasPlugin = config.plugins.some(
        (plugin: any) => plugin instanceof MiniCssExtractPlugin
      );
      if (!hasPlugin) {
        config.plugins.push(
          new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css',
            chunkFilename: 'static/css/[name].[contenthash].css',
          })
        );
      }
    }

    const rules = config.module.rules;
    const oneOfRule = rules.find(
      (rule: any) => typeof rule === 'object' && rule.oneOf
    );

    if (oneOfRule) {
      // Less Module 规则
      const lessModuleRule = {
        test: /\.module\.less$/,
        use: isServer
          ? [
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: dev
                      ? '[local]_[hash:base64:5]'
                      : '[hash:base64:8]',
                    exportOnlyLocals: true,
                    namedExport: false,
                  },
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
            ]
          : [
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: dev
                      ? '[local]_[hash:base64:5]'
                      : '[hash:base64:8]',
                    namedExport: false,
                  },
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
            ],
      };

      // 全局 Less 规则 - 简化处理
      const lessGlobalRule = {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        sideEffects: true, // 标记为有副作用，确保被处理
        use: isServer
          ? [
              // 服务端：简单处理，返回空导出
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    exportOnlyLocals: true,
                  },
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
            ]
          : [
              // 客户端：正常提取CSS
              {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
            ],
      };

      oneOfRule.oneOf.unshift(lessModuleRule, lessGlobalRule);
    }

    return config;
  },
};

module.exports = nextConfig;
