import fs from 'fs'
import path from 'path'
import glob from 'glob'
import globals from 'globals'
import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

let autoImportGlobals = {}
const autoImportsFile = path.resolve('./auto-imports.d.ts')
if (fs.existsSync(autoImportsFile)) {
    const content = fs.readFileSync(autoImportsFile, 'utf8')
    const globalMatch = content.match(/declare\s+global\s*{([^}]+)}/)?.[1] || ''
    const declarations = globalMatch.match(/\b\w+(?=[\s:,])/g) || []
    autoImportGlobals = declarations.reduce((acc, name) => {
        acc[name] = 'readonly'
        return acc
    }, {})
}

let storeGlobals = {}
const storeFiles = glob.sync('./src/stores/*.store.js')
storeFiles.forEach((file) => {
    const storeName = path.basename(file, '.store.js')
    const useStoreName = `use${storeName.charAt(0).toUpperCase() + storeName.slice(1)}Store`
    storeGlobals[useStoreName] = 'readonly'
})

export default [
    // 忽略文件和目录
    {
        ignores: ['node_modules', 'dist', 'public'],
        files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.vue']
    },
    // js推荐配置
    eslint.configs.recommended,
    // javascript 规则
    {
        files: ['**/*.{js,mjs,cjs,vue}'],
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
        }
    },
    // 全局变量
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
                project: ['./jsconfig.json'],
                tsconfigRootDir: process.cwd()
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                ...autoImportGlobals,
                ...storeGlobals,
                wx: true,
                ref: 'readonly',
                computed: 'readonly',
                reactive: 'readonly',
                onMounted: 'readonly',
                watch: 'readonly',
                defineProps: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                withDefaults: 'readonly'
            }
        }
    },
    // vue推荐配置
    ...pluginVue.configs['flat/recommended'],
    // vue 规则
    {
        files: ['**/*.vue'],
        rules: {
            // 不允许修改props的值
            'vue/no-mutating-props': ['error', { shallowOnly: true }],
            // 关闭属性顺序检查
            'vue/attributes-order': ['off'],
            // 关闭多词组件名称检查
            'vue/multi-word-component-names': ['off'],
            // 关闭属性连字符检查
            'vue/attribute-hyphenation': ['off'],
            // 关闭事件连字符检查
            'vue/v-on-event-hyphenation': ['off'],
            'vue/no-v-html': 'off',
            'vue/no-template-shadow': 'off',
            'vue/html-self-closing': 'off',
            'vue/max-attributes-per-line': 'off'
        }
    },
    // Prettier 插件
    pluginPrettierRecommended
]
