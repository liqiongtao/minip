export default {
    env: {
        NODE_ENV: '"development"',
        APP_ID: `"${process.env.TARO_APP_ID}"`,
        API_BASE_URL: `"${process.env.TARO_APP_API_BASE_URL}"`,
        API_SECRET_KEY: `"${process.env.TARO_APP_API_SECRET_KEY}"`,
        API_SECRET_SECRET: `"${process.env.TARO_APP_API_SECRET_SECRET}"`
    }
}
