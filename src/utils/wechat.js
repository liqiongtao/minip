import Taro from '@tarojs/taro'
import api from '@/utils/api'
import { debug } from '@/utils/log'

let msgTemplates = []

// 微信 消息订阅
export async function subscribeMessage() {
    if (!msgTemplates.length) {
        const rst = await api.post('/wechat/msg/templates')
        msgTemplates = (rst.data || {}).list || []
    }
    if (!msgTemplates.length) {
        return
    }

    Taro.getSetting({
        withSubscriptions: true,
        success: async (res) => {
            const subscriptionsSetting = res.subscriptionsSetting || {}
            if (!subscriptionsSetting.mainSwitch) {
                return
            }

            let tmplIds = msgTemplates.map((i) => i.id)
            debug('[subscribe-message][tmpl-ids]', tmplIds)

            // 订阅消息
            Taro.requestSubscribeMessage({
                tmplIds,
                success: (res) => {
                    debug('[subscribe-message][success]', res)
                },
                fail: (res) => {
                    debug('[subscribe-message][error]', res)
                    api.post('/report/log', { type: 'error', content: res })
                }
            })
        }
    })
}

// 获取微信设置
export function wxGetSetting() {
    return new Promise((resolve) => {
        wx.getSetting({
            success: (res) => {
                debug('[wx-get-setting][success]', res)
                resolve(res)
            },
            fail: (e) => {
                debug('[wx-get-setting][error]', e)
                resolve(false)
            }
        })
    })
}

// 获取授权
export function wxAuthorize() {
    return new Promise((resolve) => {
        wx.authorize({
            scope: 'scope.record',
            success: () => {
                debug('[wx-authorize][success]')
                resolve(true)
                return
            },
            fail: () => {
                debug('[wx-authorize][fail]')
                resolve(false)
            }
        })
    })
}

// 提示并打开设置页面
export function showAndOpenSetting(content = '请授权录音服务，用于获取语音识别') {
    return new Promise((resolve) => {
        wx.showModal({
            title: '提示',
            content,
            confirmText: '去授权',
            cancelText: '不授权',
            success(res) {
                if (res.cancel) {
                    Taro.showToast({ title: '您拒绝了授权', icon: 'none' })
                    resolve(false)
                    return
                }
                wx.openSetting({})
                resolve(false)
            }
        })
    })
}
