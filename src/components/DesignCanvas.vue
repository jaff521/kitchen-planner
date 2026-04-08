<template>
  <view class="design-canvas">
    <view v-if="store.modules.length === 0" class="empty-state">
      Tap modules below to add to the kitchen layout floor.
    </view>
    
    <movable-area class="canvas-area-rect" v-else>
      <movable-view
        v-for="module in store.modules"
        :key="module.id"
        class="canvas-module"
        direction="all"
        :x="module.x"
        :y="module.y"
        :style="{ width: module.width + 'px', height: module.height + 'px' }"
        @change="onChange($event, module.id)"
        @longpress="remove(module.id)"
      >
        <view class="module-inner">
          <text>{{ formatType(module.type) }}</text>
        </view>
      </movable-view>
    </movable-area>
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

function onChange(e, id) {
  if (e.detail && e.detail.source === 'touch') {
    store.updatePosition(id, e.detail.x, e.detail.y);
  }
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

.canvas-area-rect {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 2px dashed #007bff;
  position: relative;
  overflow: hidden;
}

.canvas-module {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 10;
}
.canvas-module:active {
  opacity: 0.8;
  z-index: 100;
}

.module-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  text-align: center;
  pointer-events: none; /* Let drag pass through to movable-view */
}
</style>
