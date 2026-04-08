<template>
  <view class="admin-container">
    <view class="header">
      <text class="title">Supervisor Dashboard Data Management</text>
    </view>

    <view v-if="!selectedLayout" class="list-area">
      <view class="tabs">
        <view class="tab" :class="{active: currentFilter === 'all'}" @click="setFilter('all')">All</view>
        <view class="tab" :class="{active: currentFilter === 'pending'}" @click="setFilter('pending')">Pending</view>
        <view class="tab" :class="{active: currentFilter === 'approved'}" @click="setFilter('approved')">Approved</view>
        <view class="tab" :class="{active: currentFilter === 'rejected'}" @click="setFilter('rejected')">Rejected</view>
      </view>

      <view v-if="loading" class="loading">Loading layouts...</view>
      <view v-else-if="layouts.length === 0" class="empty">No submissions found.</view>
      
      <view class="layout-card" v-for="item in layouts" :key="item._id" @click="selectLayout(item)">
        <view class="card-top">
          <text class="card-id">ID: {{ item._id.substr(0, 8) }}...</text>
          <text class="status-badge" :class="item.status">{{ item.status }}</text>
        </view>
        <view class="card-bottom">
          <text class="card-date">{{ new Date(item.created_at).toLocaleString() }}</text>
          <text class="card-count">{{ item.layout_data.length }} modules</text>
        </view>
        <view v-if="item.status === 'rejected'" class="reject-reason">
          Reason: {{ item.reject_reason }}
        </view>
      </view>
    </view>

    <view v-else class="review-area">
      <view class="review-header">
        <button class="btn back-btn" size="mini" @click="selectedLayout = null">Back</button>
        <text>Reviewing: {{ selectedLayout._id.substr(0,8) }}</text>
        <text class="status-badge" :class="selectedLayout.status" style="margin-left:auto">{{ selectedLayout.status }}</text>
      </view>

      <view v-if="selectedLayout.status === 'rejected'" class="reject-reason full-width">
        Rejected Reason: {{ selectedLayout.reject_reason }}
      </view>

      <view class="review-canvas canvas-area-rect">
        <view class="room-walls">
          <view class="compass-indicator">
            <text class="c-n">N</text>
            <view class="c-lines">
              <view class="c-v"></view>
              <view class="c-h"></view>
            </view>
            <text class="c-e">E</text>
          </view>
          <view class="wall top"></view>
          <view class="wall left"></view>
          <view class="wall right"></view>
          <view class="wall bottom-left"></view>
          <view class="wall bottom-right"></view>
        </view>
        
        <view class="playable-area">
          <view
            v-for="module in selectedLayout.layout_data"
            :key="module.id"
            :class="['review-module', 'canvas-module', 'theme-' + module.type]"
            :style="{
              left: module.x + 'px',
              top: module.y + 'px',
              width: module.width + 'px',
              height: module.height + 'px'
            }"
          >
            <view class="module-inner">
              <text class="module-title">{{ formatType(module.type) }}</text>
              <text class="module-dim">{{ Math.round((module.width / 320) * 400) }}x{{ Math.round((module.height / 400) * 500) }}cm</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="selectedLayout.status === 'pending'" class="actions">
        <button type="primary" class="btn approve-btn" @click="handleAction('approved')">Approve</button>
        <button type="warn" class="btn reject-btn" @click="promptReject">Reject</button>
      </view>
      <view v-else class="actions read-only">
        <text>This layout has already been processed.</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mockCallFunction } from '@/utils/mockCloud';

const layouts = ref([]);
const loading = ref(true);
const selectedLayout = ref(null);
const currentFilter = ref('pending');

onMounted(() => {
  fetchLayouts();
});

function setFilter(status) {
  currentFilter.value = status;
  fetchLayouts();
}

function fetchLayouts() {
  loading.value = true;
  mockCallFunction({ name: 'reviewLayout', data: { action: 'list', statusFilter: currentFilter.value } }).then(res => {
    if (res.result.code === 200) {
      layouts.value = res.result.data;
    }
  }).finally(() => {
    loading.value = false;
  });
}

function selectLayout(item) {
  selectedLayout.value = item;
}

function promptReject() {
  uni.showModal({
    title: 'Reject Layout',
    content: 'Please enter rejection reason:',
    editable: true,
    success: (res) => {
      if(res.confirm && res.content) {
        handleAction('rejected', res.content);
      } else if (res.confirm && !res.content) {
        uni.showToast({ title: 'Reason is required', icon: 'none' });
      }
    }
  });
}

function handleAction(status, reject_reason = '') {
  uni.showLoading({ title: 'Processing' });
  mockCallFunction({
    name: 'reviewLayout',
    data: {
      action: 'update',
      id: selectedLayout.value._id,
      status,
      reject_reason
    }
  }).then(res => {
    uni.hideLoading();
    if(res.result.code === 200) {
      uni.showToast({ title: 'Success', icon: 'success' });
      selectedLayout.value = null;
      fetchLayouts();
    }
  });
}

function formatType(t) {
  if(t === 'sink') return "Sink";
  if(t === 'slop_bucket') return "Bucket";
  if(t === 'worktable') return "Worktable";
  if(t === 'fridge') return "Fridge";
  if(t === 'cooktop') return "Cooktop";
  if(t === 'cabinet') return "Cabinet";
  if(t === 'shelf') return "Shelf";
  if(t === 'dishwasher') return "Dishwasher";
  return t;
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}
.header {
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.tabs {
  display: flex;
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  border-bottom: 2px solid transparent;
}
.tab.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
  background-color: #f8fbff;
}
.list-area {
  padding: 10px;
}
.loading, .empty {
  text-align: center;
  color: #999;
  margin-top: 20px;
}
.layout-card {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.card-top, .card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-id { font-weight: bold; }
.card-date { color: #666; font-size: 12px; }
.card-count { color: #007bff; font-weight: bold; }

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.status-badge.pending { background-color: #fff3cd; color: #856404; }
.status-badge.approved { background-color: #d4edda; color: #155724; }
.status-badge.rejected { background-color: #f8d7da; color: #721c24; }

.reject-reason {
  margin-top: 8px;
  padding: 8px;
  background-color: #fff5f5;
  color: #c53030;
  font-size: 12px;
  border-radius: 4px;
  border-left: 3px solid #e53e3e;
}
.reject-reason.full-width {
  margin: 10px;
  margin-bottom: 0;
}

.review-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.review-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
}
.back-btn { margin-right: 15px; }

.review-canvas {
  flex: 1;
  margin: 10px;
}

/* Mirroring Canvas Geometry */
.canvas-area-rect {
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

.playable-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(90% - 32px);
  height: calc(90% - 32px);
  box-sizing: border-box;
}
.canvas-module {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-radius: 12px;
  z-index: 10;
  border: 1px solid rgba(255,255,255,0.4);
}
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

.review-module {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.actions {
  padding: 15px;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
}
.actions.read-only {
  justify-content: center;
  color: #666;
  font-style: italic;
  font-size: 14px;
}
.btn { width: 40%; }
</style>
