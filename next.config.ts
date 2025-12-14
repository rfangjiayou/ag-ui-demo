/* eslint-disable @typescript-eslint/no-explicit-any */
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config: any, { isServer }: any) {
    // 查找 Next.js 默认的 CSS 规则
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
              // 服务端配置 - 只导出类名映射
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: '[local]_[hash:base64:5]',
                    exportOnlyLocals: true, // 服务端只导出类名
                    namedExport: false, // 使用默认导出
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
              // 客户端配置
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: '[local]_[hash:base64:5]',
                    namedExport: false, // 使用默认导出
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

      // 全局 Less 规则
      const lessGlobalRule = {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: isServer
          ? [
              // 服务端忽略全局样式
              {
                loader: require.resolve('null-loader'),
              },
            ]
          : [
              // 客户端处理全局样式
              require.resolve('style-loader'),
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

      // 将 Less 规则插入到 oneOf 规则的最前面
      oneOfRule.oneOf.unshift(lessModuleRule, lessGlobalRule);
    }

    return config;
  },
};

module.exports = nextConfig;
