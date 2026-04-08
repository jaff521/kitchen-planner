import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    modules: [],
    // Map of weights for auto-scaling
    moduleWeights: {
      sink: 1,
      slop_bucket: 0.8,
      worktable: 2
    }
  }),
  actions: {
    addModule(type) {
      this.modules.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type,
        width_weight: this.moduleWeights[type] || 1
      });
    },
    removeModule(id) {
      const index = this.modules.findIndex(m => m.id === id);
      if (index !== -1) {
        this.modules.splice(index, 1);
      }
    },
    clearLayout() {
      this.modules = [];
    }
  }
});
