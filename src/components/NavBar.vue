<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">后台管理系统导航栏</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="iconUrl" />
          <p class="user-name">管理员</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from "@/stores/adminStore";

const adminStore = useAdminStore();
const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;

// 退出登录
const handleCommand = (command) => {
  console.log("logout");

  if (command === "logout") {
    // 处理注销逻辑
  }
};

// 切换侧边栏折叠状态
const handleCollapse = () => {
  adminStore.toggleCollapse();
};
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e4e7eb;

  .user-name {
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
  }

  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>