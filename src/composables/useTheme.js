import { ref, watchEffect } from 'vue'

// 主题类型
export const ThemeType = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// 存储键名
const STORAGE_KEY = 'knowledge-theme-preference'

/**
 * 主题管理 Composable
 * 支持浅色/深色/跟随系统三种模式
 */
export function useTheme() {
  // 当前主题模式
  const themeMode = ref(ThemeType.LIGHT)
  // 实际应用的主题（计算后的）
  const appliedTheme = ref(ThemeType.LIGHT)

  /**
   * 获取系统主题偏好
   */
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return ThemeType.LIGHT
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? ThemeType.DARK 
      : ThemeType.LIGHT
  }

  /**
   * 应用主题到 DOM
   */
  const applyTheme = (theme) => {
    const root = document.documentElement
    const actualTheme = theme === ThemeType.AUTO ? getSystemTheme() : theme
    
    appliedTheme.value = actualTheme
    root.setAttribute('data-theme', actualTheme)
    
    // 添加过渡类，实现平滑切换
    root.classList.add('theme-transition')
    setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 300)
  }

  /**
   * 设置主题模式
   */
  const setTheme = (mode) => {
    themeMode.value = mode
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)
  }

  /**
   * 切换主题（浅色 <-> 深色）
   */
  const toggleTheme = () => {
    const newMode = appliedTheme.value === ThemeType.DARK 
      ? ThemeType.LIGHT 
      : ThemeType.DARK
    setTheme(newMode)
  }

  /**
   * 初始化主题
   */
  const initTheme = () => {
    // 读取本地存储的偏好
    const savedMode = localStorage.getItem(STORAGE_KEY) || ThemeType.LIGHT
    themeMode.value = savedMode
    applyTheme(savedMode)

    // 监听系统主题变化（仅在自动模式下）
    if (savedMode === ThemeType.AUTO) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        applyTheme(ThemeType.AUTO)
      })
    }
  }

  // 自动初始化
  watchEffect(() => {
    if (typeof window !== 'undefined') {
      initTheme()
    }
  })

  return {
    themeMode,
    appliedTheme,
    ThemeType,
    setTheme,
    toggleTheme,
    initTheme
  }
}
