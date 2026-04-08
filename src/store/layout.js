import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    modules: [],
    // Base widths instead of weights now since we are 2D
    moduleWidths: {
      sink: 80,
      slop_bucket: 64,
      worktable: 120,
      fridge: 70,
      cooktop: 60,
      cabinet: 100,
      shelf: 90,
      dishwasher: 60
    }
  }),
  actions: {
    addModule(type) {
      this.modules.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type,
        width: this.moduleWidths[type] || 80,
        height: 80, // fixed height for modules
        x: 100, // spawn at center-ish
        y: 100
      });
    },
    updatePosition(id, x, y) {
      const module = this.modules.find(m => m.id === id);
      if (module) {
        module.x = x;
        module.y = y;
      }
    },
    updateSize(id, width, height) {
      const module = this.modules.find(m => m.id === id);
      if (module) {
        // Enforce minimum sizes so it doesn't disappear
        module.width = Math.max(width, 40);
        module.height = Math.max(height, 40);
      }
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
