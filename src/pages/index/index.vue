<template>
  <view class="container">
    <view class="canvas-area">
      <DesignCanvas />
    </view>
    <view class="tray-area">
      <ModuleTray />
    </view>
    <view class="submit-area">
      <button class="submit-btn" :class="{ disabled: !canSubmit }" @click="submitForReview">
        Submit for Review
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLayoutStore } from '@/store/layout';
import DesignCanvas from '@/components/DesignCanvas.vue';
import ModuleTray from '@/components/ModuleTray.vue';
import { mockCallFunction } from '@/utils/mockCloud';

const store = useLayoutStore();

const canSubmit = computed(() => store.modules.length > 0);

function submitForReview() {
  if (!canSubmit.value) return;
  uni.showLoading({ title: 'Submitting...' });
  mockCallFunction({
    name: 'submitLayout',
    data: {
      layout_data: store.modules
    }
  }).then(res => {
    uni.hideLoading();
    if (res.result.code === 200) {
      uni.showToast({ title: 'Layout Submitted!', icon: 'success' });
      store.clearLayout();
    } else {
      uni.showToast({ title: res.result.message || 'Submission failed', icon: 'error' });
    }
  }).catch(err => {
    uni.hideLoading();
    uni.showToast({ title: 'Network Error', icon: 'error' });
  });
}
</script>

<style>
page {
  height: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.canvas-area {
  flex: 1;
}
.tray-area {
  height: 160px;
  flex-shrink: 0;
  z-index: 100;
}
.submit-area {
  height: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-color: #ffffff;
  padding-bottom: 20px;
}
.submit-btn {
  width: 100%;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #283593, #3f51b5);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
  border: none;
  transition: all 0.2s ease;
}
.submit-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 6px rgba(63, 81, 181, 0.3);
}
.submit-btn.disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  box-shadow: none;
}
</style>
