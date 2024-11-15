<template>
    <view class="index">
        <Counter />
        <view>1sd</view>
        <view>2s</view>
        <view>3ssaasdfsaa</view>
        <view>{{ name }}</view>
        <view>{{ appid }}</view>
    </view>
</template>

<script setup>
    import './index.scss'
    import { ref } from 'vue'
    import Counter from '../../components/Counter.vue'

    const name = ref('hnatao')
    const appid = process.env.TARO_APP_ID
</script>
