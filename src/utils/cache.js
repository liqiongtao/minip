import Taro from '@tarojs/taro'
import { md5 } from '@/utils/crypto'
import { debug } from '@/utils/log'

const sk = 'smart-card'

export function set(key, value) {
    try {
        key = md5(key + sk)
        Taro.setStorageSync(key, value)
    } catch (e) {
        debug('[cache.set]', e)
    }
}

export function get(key) {
    try {
        key = md5(key + sk)
        return Taro.getStorageSync(key) || ''
    } catch (e) {
        debug('[cache.get]', e)
        return ''
    }
}

export function remove(key) {
    try {
        key = md5(key + sk)
        return Taro.removeStorageSync(key)
    } catch (e) {
        debug('[cache.remove]', e)
        return ''
    }
}
