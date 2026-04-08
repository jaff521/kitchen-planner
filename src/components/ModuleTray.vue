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
  padding: 20px 15px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
  position: relative;
}
.module-tray::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
}
.tray-title {
  font-size: 14px;
  font-weight: 600;
  color: #757575;
  margin-bottom: 15px;
  text-align: center;
}
.tray-scroll {
  white-space: nowrap;
  padding-bottom: 5px;
}
.tray-item {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 90px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
  color: #424242;
  font-weight: 500;
  font-size: 14px;
}
.tray-item:active {
  background-color: #e3f2fd;
  border-color: #90caf9;
  color: #1976d2;
  transform: scale(0.95);
}
</style>
