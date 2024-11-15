<template>
    <view class="index">
        <Counter />
        <view>1ss</view>
        <view>2ss</view>
        <view>3ss</view>
        <view>{{ name }}</view>
        <view>APP_ID</view>
        <view>NODE_ENV</view>
    </view>
</template>

<script setup>
    import './index.scss'
    import { ref } from 'vue'
    import Counter from '../../components/Counter.vue'

    const name = ref('hnatao')

    console.log('appId: APP_ID')
    console.log('nodeEnv: NODE_ENV')
</script>
