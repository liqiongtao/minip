export function formatDuration(second) {
    const secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        const hours = Math.floor(second / 3600)
        second = second - hours * 3600
        const mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return ('0' + hours).slice(-2) + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    }
    return '00:00'
}

export function debounce(fn, delay) {
    let ts = delay || 200
    let timer = null
    return function () {
        const arg = arguments
        const that = this
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(that, ...arg)
        }, ts)
    }
}

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}
