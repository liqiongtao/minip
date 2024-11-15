<template>
    <view class="index">
        <Counter />
        <view>1s</view>
        <view>2s</view>
        <view>3s</view>
        <view>{{ name }}</view>
        <view>APP_ID</view>
        <view>NODE_ENV</view>
        <t-button type="primary">Primary Button</t-button>
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
