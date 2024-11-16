import { defineConfig } from '@tarojs/cli'

// 自动导入插件
import AutoImport from 'unplugin-auto-import/webpack'
// 组件自动导入插件
import Components from 'unplugin-vue-components/webpack'
// NutUI自动导入解析器
import NutUIResolver from '@nutui/auto-import-resolver'

// 开发环境配置
import devConfig from './dev'
// 生产环境配置
import prodConfig from './prod'

const path = require('path')

export default defineConfig(async (merge, { command, mode }) => {
    const baseConfig = {
        projectName: 'my-minip-app',
        date: '2024-11-16',

        // 设置设计稿尺寸
        designWidth(input) {
            // 配置 NutUI 375 尺寸
            if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
                return 375
            }
            // 全局使用 Taro 默认的 750 尺寸
            return 750
        },
        // 设置设备比例
        deviceRatio: {
            640: 2.34 / 2,
            750: 1,
            375: 2,
            828: 1.81 / 2
        },

        // 源代码根目录
        sourceRoot: 'src',
        // 输出目录
        outputRoot: 'dist',

        // 设置别名
        alias: {
            '@': path.resolve(__dirname, '..', 'src'),
            '@/api': path.resolve(__dirname, '..', 'src/api'),
            '@/assets': path.resolve(__dirname, '..', 'src/assets'),
            '@/components': path.resolve(__dirname, '..', 'src/components'),
            '@/models': path.resolve(__dirname, '..', 'src/models'),
            '@/pages': path.resolve(__dirname, '..', 'src/pages'),
            '@/stores': path.resolve(__dirname, '..', 'src/stores'),
            '@/utils': path.resolve(__dirname, '..', 'src/utils')
        },

        // 插件配置
        plugins: [],

        // 全局变量设置
        defineConstants: {
            NODE_ENV: process.env.NODE_ENV
        },

        // 文件拷贝配置
        copy: {
            patterns: [], // 需要拷贝的文件/文件夹
            options: {} // 拷贝选项
        },

        // 框架配置
        framework: 'vue3',
        // 编译配置
        compiler: {
            type: 'webpack5', // 使用 webpack5 作为编译器
            prebundle: {
                enable: false // 禁用依赖预编译
            }
        },

        // 缓存配置
        cache: {
            enable: false // 禁用编译缓存
        },

        // Sass 配置
        sass: {
            resource: [path.resolve(__dirname, '..', 'src/assets/styles/variables.scss')],
            data: '@import "@nutui/nutui-taro/dist/styles/variables.scss";'
        },

        mini: {
            // Webpack 配置
            webpackChain(chain) {
                // 添加组件自动导入插件
                chain.plugin('unplugin-vue-components').use(
                    Components({
                        dirs: ['src/components'], // 指定组件所在的目录
                        dts: 'types/components.d.ts', // 生成类型文件
                        resolvers: [NutUIResolver({ taro: true })] // 使用 NutUI 组件解析器
                    })
                )
                // 添加自动导入插件
                chain.plugin('unplugin-auto-import').use(
                    AutoImport({
                        imports: ['vue', 'pinia'], // 自动导入 Vue 和 Pinia 相关 API
                        dirs: ['src/api', 'src/models', 'src/stores', 'src/utils'], // 指定需要自动导入的目录
                        vueTemplate: true, // 在 Vue 模板中启用自动导入
                        dts: 'types/auto-imports.d.ts', // 生成类型文件
                        resolvers: [NutUIResolver({ taro: true })] // 使用 NutUI 组件解析器
                    })
                )
                // 添加性能配置
                chain.performance
                    .hints(false) // 关闭性能提示
                    .maxEntrypointSize(1024 * 1024) // 入口文件最大为1MB
                    .maxAssetSize(1024 * 1024) // 资源文件最大为1MB
            },
            postcss: {
                pxtransform: {
                    enable: true, // 启用 px 转换
                    config: {} // pxtransform 的配置项
                },
                cssModules: {
                    enable: false, // 是否启用
                    config: {
                        namingPattern: 'module', // 命名模式
                        generateScopedName: '[name]__[local]___[hash:base64:5]' // 生成的作用域名称
                    }
                },
                url: {
                    enable: true, // 是否启用
                    config: {
                        limit: 10240 // 文件大小限制(单位:字节)
                    }
                }
            },
            // 新增小程序编译优化配置
            optimizeMainPackage: {
                // 是否启用主包优化
                enable: true,
                // 指定哪些文件要从主包中排除
                excludeFiles: ['src/pages/*/components/**', 'src/components/**/*.{js,ts,jsx,tsx,vue}', 'src/utils/**/*.{js,ts}']
            },
            // 避免 MiniCssExtractPlugin 插件的警告
            miniCssExtractPluginOption: {
                ignoreOrder: true
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
