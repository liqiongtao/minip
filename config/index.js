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

        // 框架
        framework: 'vue3',
        // 编译器
        compiler: 'webpack5',

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
            NODE_ENV: process.env.NODE_ENV,
            APP_ID: process.env.TARO_APP_ID
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

        // 小程序配置
        mini: {
            postcss: {
                // px 转换配置
                pxtransform: {
                    // 是否启用
                    enable: true,
                    config: {}
                },
                // CSS Modules 配置
                cssModules: {
                    // 是否启用
                    enable: false,
                    config: {
                        // 命名模式
                        namingPattern: 'module',
                        // 生成的作用域名称
                        generateScopedName: '[name]__[local]___[hash:base64:5]'
                    }
                },
                // 静态资源配置
                url: {
                    // 是否启用
                    enable: true,
                    config: {
                        // 文件大小限制(单位:字节)
                        limit: 10240
                    }
                }
            },
            // 编译配置
            compile: {
                // 排除目录
                exclude: [
                    'node_modules',
                    'src/assets'
                ]
            },
            // 压缩配置
            minifyXML: {
                // 删除注释
                deleteComments: true,
                // 压缩空白
                collapseWhitespace: true,
                // 保持闭合斜杠
                keepClosingSlash: true,
                // 删除空属性
                removeEmptyAttributes: true,
                // 删除脚本类型属性
                removeScriptTypeAttributes: true,
                // 删除样式链接类型属性
                removeStyleLinkTypeAttributes: true,
                // 使用短文档类型
                useShortDoctype: true
            },
            // 新增小程序编译优化配置
            optimizeMainPackage: {
                // 是否启用主包优化
                enable: true,
                // 指定哪些文件要从主包中排除
                excludeFiles: [
                    'src/pages/*/components/**',
                    'src/components/**/*.{js,ts,jsx,tsx,vue}',
                    'src/utils/**/*.{js,ts}'
                ]
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
