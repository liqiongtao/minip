import { defineConfig } from '@tarojs/cli'

import AutoImport from 'unplugin-auto-import/webpack'
import Components from 'unplugin-vue-components/webpack'
import NutUIResolver from '@nutui/nutui-taro/dist/resolver'
import path from 'path'

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
            '@api': 'src/api',
            '@assets': 'src/assets',
            '@components': 'src/components',
            '@models': 'src/models',
            '@pages': 'src/pages',
            '@stores': 'src/stores',
            '@utils': 'src/utils'
        },

        // 全局引入 NutUI 的样式变量
        sass: {
            data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
            resource: [path.resolve(__dirname, '..', 'src/styles/theme.scss')]
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
            patterns: [],
            options: {}
        },

        // 小程序配置
        mini: {
            parallel: true,
            // webpack 链式配置
            webpackChain(chain) {
                // 自动导入 Vue 和 Pinia 相关 API
                chain.plugin('autoImport').use(
                    AutoImport({
                        // 需要自动导入的包
                        imports: ['vue', 'pinia'],
                        // 自动导入目录
                        dirs: ['src/api', 'src/models', 'src/stores', 'src/utils'],
                        // 生成 TypeScript 声明文件路径
                        dts: 'types/auto-imports.d.ts',
                        // 使用 Vue 模板
                        vueTemplate: true,
                        // 自定义解析器
                        resolvers: [NutUIResolver()]
                    })
                )

                // 自动导入组件
                chain.plugin('components').use(
                    Components({
                        // 组件目录
                        dirs: ['src/components'],
                        // 生成 TypeScript 声明文件路径
                        dts: 'types/components.d.ts',
                        // 自定义解析器
                        resolvers: [NutUIResolver({ taro: true })]
                    })
                )
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
