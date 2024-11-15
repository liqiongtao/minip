<template>
    <view class="index">
        <Counter />
        <view>1sd</view>
        <view>2s</view>
        <view>3ssaasdfsaa</view>
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
