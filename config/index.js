import { defineConfig } from '@tarojs/cli'

import AutoImport from 'unplugin-auto-import/webpack'
import Components from 'unplugin-vue-components/webpack'

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
        compiler: 'vite',

        // 别名配置
        alias: {
            '@': 'src',
            '@api': 'src/api',
            '@assets': 'src/assets',
            '@components': 'src/components',
            '@models': 'src/models',
            '@pages': 'src/pages',
            '@stores': 'src/stores',
            '@utils': 'src/utils'
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
            options: {}
        },

        // 小程序配置
        mini: {
            parallel: true,
            // webpack 链式配置
            webpackChain(chain) {
                // 自动导入 Vue 和 Pinia 相关 API
                chain.plugin('unplugin-auto-import').use(
                    AutoImport({
                        // 需要自动导入的包
                        imports: ['vue', 'pinia'],
                        // 自动导入目录
                        dirs: ['src/api', 'src/models', 'src/stores', 'src/utils'],
                        // 生成 TypeScript 声明文件路径
                        dts: 'types/auto-imports.d.ts',
                        // 自定义解析器
                        resolvers: []
                    })
                )

                // 自动导入组件
                chain.plugin('unplugin-vue-components').use(
                    Components({
                        // 组件目录
                        dirs: ['src/components'],
                        // 组件的有效文件扩展名
                        extensions: ['vue'],
                        // 生成 TypeScript 声明文件路径
                        dts: 'types/components.d.ts',
                        // 自定义解析器
                        resolvers: []
                    })
                )
                // 添加小程序 XML 处理插件
                chain.plugin('miniXMLPlugin').use('mini-xml-webpack-plugin', [
                    {
                        // 折叠空白字符
                        collapseWhitespace: true,
                        // 移除注释
                        removeComments: true,
                        // 不移除属性引号
                        removeAttributeQuotes: false,
                        // 移除空属性
                        removeEmptyAttributes: true
                    }
                ])
            },
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
                exclude: ['node_modules', 'src/assets']
            },
            // 新增小程序编译优化配置
            optimizeMainPackage: {
                // 是否启用主包优化
                enable: true,
                // 指定哪些文件要从主包中排除
                excludeFiles: ['src/pages/*/components/**', 'src/components/**/*.{js,ts,jsx,tsx,vue}', 'src/utils/**/*.{js,ts}']
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
