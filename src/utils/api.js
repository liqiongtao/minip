import Taro from '@tarojs/taro'
import store from '@/store'
import { md5, sha1, encrypt, decrypt } from '@/utils/crypto'
import { debug } from '@/utils/log'

let logining = false

class API {
    constructor() {
        this.baseUrl = process.env.BASE_URL
        this.header = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }

    async post(uri, data) {
        if (logining) return

        const enterpriseCode = store.state.enterpriseCode || ''
        const ts = parseInt(new Date().getTime() / 1000)

        let header = Object.assign({}, this.header, {
            'X-Client-Id': enterpriseCode,
            'X-Request-Timestamp': ts,
            'X-User-Agent': navigator.userAgent || '',
            'X-Request-Sign': sha1(enterpriseCode + ts + md5(navigator.userAgent || '')),
            Authorization: store.state.token || ''
        })

        let res = await Taro.request({
            method: 'post',
            url: this.baseUrl + uri,
            data: encrypt(data || {}),
            header: header,
            timeout: 80000
        })

        if (res.statusCode == 401) {
            logining = true
            store.commit('clearLoginInfo')
            Taro.reLaunch({ url: '/pages/login/login' })
            logining = false
            return { code: res.statusCode, message: res.errMsg, data: {} }
        }

        if (res.statusCode != 200) {
            this.log(uri, data, res || {})
            return { code: res.statusCode, message: res.errMsg, data: {} }
        }

        var rst = res.data || {}
        if (rst.data) {
            rst.data = JSON.parse(decrypt(rst.data) || '{}') || {}
        }

        logining = false

        this.log(uri, data || {}, res.data || {})
        return res.data || {}
    }

    log(...v) {
        debug('[api.post]', ...v)
    }
}

export default new API()
