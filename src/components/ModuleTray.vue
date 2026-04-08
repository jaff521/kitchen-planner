<template>
  <view class="module-tray">
    <scroll-view class="tray-scroll" scroll-x="true">
      <view class="tray-item theme-border-sink" @click="add('sink')">
        <view class="tray-icon-box"><view class="tray-icon">🚰</view></view>
        <text>水槽</text>
      </view>
      <view class="tray-item theme-border-slop_bucket" @click="add('slop_bucket')">
        <view class="tray-icon-box"><view class="tray-icon">🗑️</view></view>
        <text>泔水桶</text>
      </view>
      <view class="tray-item theme-border-worktable" @click="add('worktable')">
        <view class="tray-icon-box"><view class="tray-icon">🗄️</view></view>
        <text>工作台</text>
      </view>
      <view class="tray-item theme-border-fridge" @click="add('fridge')">
        <view class="tray-icon-box"><view class="tray-icon">🥶</view></view>
        <text>冰箱</text>
      </view>
      <view class="tray-item theme-border-cooktop" @click="add('cooktop')">
        <view class="tray-icon-box"><view class="tray-icon">🍳</view></view>
        <text>灶台</text>
      </view>
      <view class="tray-item theme-border-cabinet" @click="add('cabinet')">
        <view class="tray-icon-box"><view class="tray-icon">🗄️</view></view>
        <text>储物柜</text>
      </view>
      <view class="tray-item theme-border-shelf" @click="add('shelf')">
        <view class="tray-icon-box"><view class="tray-icon">🪜</view></view>
        <text>货架</text>
      </view>
      <view class="tray-item theme-border-dishwasher" @click="add('dishwasher')">
        <view class="tray-icon-box"><view class="tray-icon">🧼</view></view>
        <text>洗碗机</text>
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
  box-sizing: border-box;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 90px;
  background-color: #fcfcfc;
  border-radius: 16px;
  margin-right: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
  color: #424242;
  font-weight: 500;
  font-size: 14px;
}
.tray-item.theme-border-sink { border: 2px solid #90caf9; }
.tray-item.theme-border-slop_bucket { border: 2px solid #ffcc80; }
.tray-item.theme-border-worktable { border: 2px solid #80cbc4; }
.tray-item.theme-border-fridge { border: 2px solid #a5d6a7; }
.tray-item.theme-border-cooktop { border: 2px solid #ffab91; }
.tray-item.theme-border-cabinet { border: 2px solid #ce93d8; }
.tray-item.theme-border-shelf { border: 2px solid #bcaaa4; }
.tray-item.theme-border-dishwasher { border: 2px solid #b0bec5; }

.tray-icon-box {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}
.tray-icon {
  font-size: 24px;
}

.tray-item:active {
  background-color: #e3f2fd;
  color: #1976d2;
  transform: scale(0.95);
}
</style>
