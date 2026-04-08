<template>
  <view class="design-canvas">
    <view v-if="store.modules.length === 0" class="empty-state">
      Tap modules below to add to the kitchen layout.
    </view>
    
    <view class="canvas-row" v-else>
      <view
        v-for="module in store.modules"
        :key="module.id"
        class="canvas-module"
        :style="{ flexGrow: module.width_weight }"
        @longpress="remove(module.id)"
      >
        <view class="module-inner">
          <text>{{ formatType(module.type) }}</text>
          <text class="module-hint">Long press to delete</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useLayoutStore } from '@/store/layout';
const store = useLayoutStore();

function remove(id) {
  uni.showModal({
    title: 'Remove Module',
    content: 'Are you sure you want to remove this module?',
    success: function (res) {
      if (res.confirm) {
        store.removeModule(id);
      }
    }
  });
}

function formatType(t) {
  if(t === 'sink') return "Sink";
  if(t === 'slop_bucket') return "Slop Bucket";
  if(t === 'worktable') return "Worktable";
  return t;
}
</script>

<style scoped>
.design-canvas {
  height: 100%;
  width: 100%;
  background-color: #ededed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.empty-state {
  color: #999;
  font-size: 14px;
}

.canvas-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 120px;
  background-color: #fff;
  border: 2px dashed #007bff;
}

.canvas-module {
  /* Flex grow dynamically matches width_weight from pinia store */
  flex-basis: 0;
  border-right: 1px solid #ddd;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e3f2fd;
  transition: all 0.3s ease;
}
.canvas-module:last-child {
  border-right: none;
}

.module-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.module-hint {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
}
</style>
