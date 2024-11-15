import { defineConfig } from '@tarojs/cli'

import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
    const baseConfig = {
        projectName: 'my-minip',
        date: '2024-11-16',

        // 设计稿宽度
        designWidth: 750,
        // 设备比例
        deviceRatio: {
            640: 2.34 / 2,
            750: 1,
            375: 2,
            828: 1.81 / 2
        },

        // 源码目录
        sourceRoot: 'src',
        // 输出目录
        outputRoot: 'dist',

        // 别名配置
        alias: {
            '@': 'src',
            '@components': 'src/components',
            '@utils': 'src/utils',
            '@api': 'src/api',
            '@assets': 'src/assets',
            '@styles': 'src/styles'
        },

        // 插件
        plugins: [],
        // 常量
        defineConstants: {
        },

        // 复制文件
        copy: {
            patterns: [
                {
                    from: 'src/assets/',
                    to: 'dist/assets/',
                    ignore: ['*.js', '*.css']
                }
            ],
            options: {
            }
        },

        // 框架
        framework: 'vue3',
        // 编译器
        compiler: 'vite',

        // 小程序配置
        mini: {
            postcss: {
                pxtransform: {
                    enable: true,
                    config: {

                    }
                },
                cssModules: {
                    enable: false,
                    config: {
                        namingPattern: 'module',
                        generateScopedName: '[name]__[local]___[hash:base64:5]'
                    }
                }
            }
        }
    }

    if (process.env.NODE_ENV === 'development') {
        // 本地开发构建配置（不混淆压缩）
        return merge({}, baseConfig, devConfig)
    }

    // 生产构建配置（默认开启压缩混淆等）
    return merge({}, baseConfig, prodConfig)
})
