<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="iconUrl" />
          <p class="user-name">朱浩炼</p>
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
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { logout } from "@/api/admin";

const adminStore = useAdminStore();
const iconUrl = new URL("@/assets/images/cat.jpg", import.meta.url).href;
const router = useRouter();
const route = useRoute();

// 退出登录
const handleCommand = (command) => {
  console.log("logout");

  if (command === "logout") {
    // 处理注销逻辑
    ElMessageBox.confirm("确定退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      logout().then(() => {
        // 清除登录状态
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        // 跳转到登录页面
        router.push("auth/login");
        ElMessage.success("退出登录成功");
      });
    });
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