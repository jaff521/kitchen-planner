<template>
  <view class="container">
    <view class="canvas-area">
      <DesignCanvas />
    </view>
    <view class="tray-area">
      <ModuleTray />
    </view>
    <view class="submit-area">
      <button class="submit-btn" type="primary" @click="submitForReview" :disabled="!canSubmit">
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
  height: 100vh;
}
.canvas-area {
  flex: 6; /* 60% approx taking account button */
}
.tray-area {
  flex: 3; /* 30% approx */
}
.submit-area {
  flex: 1; /* 10% approx */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
}
.submit-btn {
  width: 90%;
}
</style>
