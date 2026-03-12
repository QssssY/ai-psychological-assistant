<template>
  <div class="theme-toggle-wrapper">
    <el-dropdown trigger="click" @command="handleCommand">
      <button class="theme-toggle-btn" :title="currentThemeLabel">
        <el-icon v-if="appliedTheme === 'light'" class="theme-icon">
          <Sunny />
        </el-icon>
        <el-icon v-else-if="appliedTheme === 'dark'" class="theme-icon">
          <Moon />
        </el-icon>
        <el-icon v-else class="theme-icon">
          <SemiSelect />
        </el-icon>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            command="light"
            :class="{ 'is-active': themeMode === 'light' }"
          >
            <el-icon><Sunny /></el-icon>
            <span>浅色模式</span>
          </el-dropdown-item>
          <el-dropdown-item
            command="dark"
            :class="{ 'is-active': themeMode === 'dark' }"
          >
            <el-icon><Moon /></el-icon>
            <span>深色模式</span>
          </el-dropdown-item>
          <el-dropdown-item
            command="auto"
            :class="{ 'is-active': themeMode === 'auto' }"
          >
            <el-icon><SemiSelect /></el-icon>
            <span>跟随系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Sunny, Moon, SemiSelect } from "@element-plus/icons-vue";
import { useTheme, ThemeType } from "@/composables/useTheme";

const { themeMode, appliedTheme, setTheme } = useTheme();

const currentThemeLabel = computed(() => {
  const labels = {
    [ThemeType.LIGHT]: "浅色模式",
    [ThemeType.DARK]: "深色模式",
    [ThemeType.AUTO]: "跟随系统",
  };
  return labels[themeMode.value] || "切换主题";
});

const handleCommand = (command) => {
  setTheme(command);
};
</script>

<style scoped lang="scss">
.theme-toggle-wrapper {
  display: inline-block;
}

.theme-toggle-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-hover);
    transform: scale(1.05);
  }

  .theme-icon {
    font-size: 18px;
    color: var(--text-primary);
    transition: transform 0.3s ease;
  }

  &:hover .theme-icon {
    transform: rotate(15deg);
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;

  &.is-active {
    color: var(--primary-color);
    background: var(--bg-secondary);
  }

  .el-icon {
    font-size: 16px;
  }
}
</style>
