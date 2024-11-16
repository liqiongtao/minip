<template>
    <view class="index">
        <nut-button type="primary" @click="onClick">按钮</nut-button>
        <nut-toast v-model:visible="show" msg="你成功了" />
    </view>
</template>

<script setup>
    const show = ref(false)
    const onClick = () => {
        show.value = true
    }
</script>
