import cryptoJs from 'crypto-js'
import { debug } from '@/utils/log'

export function md5(str) {
    return String(cryptoJs.MD5(str)).toUpperCase()
}

export function sha1(str) {
    return String(cryptoJs.SHA1(str)).toUpperCase()
}

export function encrypt(data) {
    const SECRET_KEY = cryptoJs.enc.Utf8.parse(process.env.APP_KEY)
    const SECRET_IV = cryptoJs.enc.Utf8.parse(process.env.APP_SECRET)
    if (typeof data === 'object') {
        try {
            data = JSON.stringify(data)
        } catch (error) {
            debug('encrypt error:', error)
            return
        }
    }
    const dataHex = cryptoJs.enc.Utf8.parse(data)
    const encrypted = cryptoJs.AES.encrypt(dataHex, SECRET_KEY, {
        iv: SECRET_IV,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
}

export function decrypt(data) {
    const SECRET_KEY = cryptoJs.enc.Utf8.parse(process.env.APP_KEY)
    const SECRET_IV = cryptoJs.enc.Utf8.parse(process.env.APP_SECRET)
    const encryptedHexStr = cryptoJs.enc.Hex.parse(data)
    const str = cryptoJs.enc.Base64.stringify(encryptedHexStr)
    const decrypt = cryptoJs.AES.decrypt(str, SECRET_KEY, {
        iv: SECRET_IV,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
    })
    const decryptedStr = decrypt.toString(cryptoJs.enc.Utf8)
    return decryptedStr.toString()
}

export function base64encode(raw) {
    try {
        return cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(raw))
    } catch {
        return ''
    }
}

export function base64decode(str) {
    try {
        return cryptoJs.enc.Base64.parse(str).toString(cryptoJs.enc.Utf8)
    } catch {
        return ''
    }
}
