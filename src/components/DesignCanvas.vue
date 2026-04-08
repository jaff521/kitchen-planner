<template>
  <view class="design-canvas">
    <view v-if="store.modules.length === 0" class="empty-state">
      Tap modules below to add to the kitchen layout floor.
    </view>
    
    <movable-area class="canvas-area-rect" v-else>
      <movable-view
        v-for="module in store.modules"
        :key="module.id"
        :class="['canvas-module', 'theme-' + module.type]"
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
  background-color: #f5f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  box-sizing: border-box;
}

.empty-state {
  color: #8e8e93;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.canvas-area-rect {
  width: 100%;
  height: 100%;
  background-color: #fcfcfc;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  background-image: linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
  overflow: hidden;
}

.canvas-module {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-radius: 12px;
  z-index: 10;
  transition: box-shadow 0.2s ease;
  border: 1px solid rgba(255,255,255,0.4);
}
.canvas-module:active {
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 100;
}

/* Material Color Themes */
.theme-sink { background-color: #c3e8ff; color: #004b75; }
.theme-worktable { background-color: #b2dfdb; color: #004d40; }
.theme-slop_bucket { background-color: #ffe0b2; color: #e65100; }

.module-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  background-color: transparent;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 6px;
}
.resize-handle::after {
  content: '';
  width: 8px;
  height: 8px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 50%;
}
</style>
