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
        :disabled="resizingId === module.id"
        :style="{ width: module.width + 'px', height: module.height + 'px' }"
        @change="onChange($event, module.id)"
        @longpress="remove(module.id)"
      >
        <view class="module-inner">
          <text>{{ formatType(module.type) }}</text>
        </view>
        <view 
          class="resize-handle" 
          @touchstart.stop.prevent="startResize($event, module)" 
          @touchmove.stop.prevent="doResize($event, module)"
          @touchend.stop.prevent="endResize"
          @touchcancel.stop.prevent="endResize"
        >
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useLayoutStore } from '@/store/layout';
const store = useLayoutStore();

const resizingId = ref(null);
const initialTouch = ref({ x: 0, y: 0 });
const initialSize = ref({ width: 0, height: 0 });

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
  if (e.detail && e.detail.source === 'touch' && resizingId.value !== id) {
    store.updatePosition(id, e.detail.x, e.detail.y);
  }
}

function startResize(e, module) {
  resizingId.value = module.id;
  initialTouch.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  initialSize.value = { width: module.width, height: module.height };
}

function doResize(e, module) {
  if (resizingId.value !== module.id) return;
  const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  const deltaX = currentTouch.x - initialTouch.value.x;
  const deltaY = currentTouch.y - initialTouch.value.y;
  
  store.updateSize(module.id, initialSize.value.width + deltaX, initialSize.value.height + deltaY);
}

function endResize() {
  resizingId.value = null;
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
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  background-color: transparent;
}
.resize-handle::after {
  content: '';
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 10px;
  height: 10px;
  border-right: 2px solid #007bff;
  border-bottom: 2px solid #007bff;
}
</style>
