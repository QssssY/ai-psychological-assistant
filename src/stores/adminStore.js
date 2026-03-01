import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // 侧边栏是否折叠
  const isCollapsed = ref(false)
  // 切换侧边栏折叠状态
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    isCollapsed,
    toggleCollapse,
  }
})
