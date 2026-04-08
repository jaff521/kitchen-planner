<template>
  <view class="design-canvas">
    <view v-if="store.modules.length === 0" class="empty-state">
      轻触下方模块添加到厨房地平面。
    </view>
    
    <view class="canvas-area-rect" v-else>
      <view class="room-walls">
        <view class="compass-indicator">
          <text class="c-n">北</text>
          <view class="c-lines">
            <view class="c-v"></view>
            <view class="c-h"></view>
          </view>
          <text class="c-e">东</text>
        </view>
        <view class="wall top"></view>
        <view class="wall left"></view>
        <view class="wall right"></view>
        <view class="wall bottom-left"></view>
        <view class="wall bottom-right"></view>
      </view>
      
      <movable-area class="playable-area">
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
            <text class="module-title">{{ formatType(module.type) }}</text>
            <text class="module-dim">{{ Math.round((module.width / 320) * 400) }}x{{ Math.round((module.height / 400) * 500) }}cm</text>
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
    title: '移除模块',
    content: '您确定要移除该模块吗？',
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
  if(t === 'sink') return "水槽";
  if(t === 'slop_bucket') return "泔水桶";
  if(t === 'worktable') return "工作台";
  if(t === 'fridge') return "冰箱";
  if(t === 'cooktop') return "灶台";
  if(t === 'cabinet') return "储物柜";
  if(t === 'shelf') return "货架";
  if(t === 'dishwasher') return "洗碗机";
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.playable-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(90% - 32px); /* accounts for 16px wall on left and right */
  height: calc(90% - 32px); /* accounts for 16px wall on top and bottom */
  box-sizing: border-box;
}

.room-walls {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  pointer-events: none;
}
.wall {
  position: absolute;
  background-color: #bcbcbc;
}
.wall.top { top: 0; left: 0; right: 0; height: 16px; border-top-left-radius: 4px; border-top-right-radius: 4px; }
.wall.left { top: 0; left: 0; bottom: 0; width: 16px; }
.wall.right { top: 0; right: 0; bottom: 0; width: 16px; }
.wall.bottom-left { bottom: 0; left: 0; width: 30%; height: 16px; border-bottom-left-radius: 4px; }
.wall.bottom-right { bottom: 0; right: 0; width: 40%; height: 16px; border-bottom-right-radius: 4px; }


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
.theme-fridge { background-color: #c8e6c9; color: #1b5e20; }
.theme-cooktop { background-color: #ffccbc; color: #bf360c; }
.theme-cabinet { background-color: #e1bee7; color: #4a148c; }
.theme-shelf { background-color: #d7ccc8; color: #3e2723; }
.theme-dishwasher { background-color: #cfd8dc; color: #263238; }

.compass-indicator {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  opacity: 0.6;
  pointer-events: none;
  font-size: 10px;
  font-weight: bold;
  color: #c5c5c5;
}
.c-n { position: absolute; top: -14px; left: 16px; }
.c-e { position: absolute; right: -12px; top: 14px; }
.c-lines {
  width: 100%;
  height: 100%;
  position: relative;
}
.c-v { position: absolute; left: 19px; width: 2px; height: 100%; background: #c5c5c5; }
.c-h { position: absolute; top: 19px; height: 2px; width: 100%; background: #c5c5c5; }

.module-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: none;
}
.module-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}
.module-dim {
  font-size: 8px;
  opacity: 0.7;
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
