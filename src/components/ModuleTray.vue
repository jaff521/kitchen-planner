<template>
  <view class="module-tray">
    <view class="tray-title">Available Modules (Tap to Add)</view>
    <scroll-view class="tray-scroll" scroll-x="true">
      <view class="tray-item" @click="add('sink')">
        <text>Sink</text>
      </view>
      <view class="tray-item" @click="add('slop_bucket')">
        <text>Slop Bucket</text>
      </view>
      <view class="tray-item" @click="add('worktable')">
        <text>Worktable</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { useLayoutStore } from '@/store/layout';
const store = useLayoutStore();

function add(type) {
  store.addModule(type);
}
</script>

<style scoped>
.module-tray {
  height: 100%;
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
}
.tray-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.tray-scroll {
  white-space: nowrap;
}
.tray-item {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-right: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
