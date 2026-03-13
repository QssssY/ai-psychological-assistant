<template>
  <el-aside :width="isCollapsed ? '64px' : '264px'">
    <el-menu
      default-active="2"
      class="menu"
      :collapse="isCollapsed"
      :collapse-transition="false"
    >
      <div class="brand">
        <el-image :src="iconUrl" alt="logo" class="logo" />
        <div class="info-card" v-show="!isCollapsed">
          <div class="brand-title">塔塔AI心理助手</div>
          <div class="brand-subtitle">管理后台</div>
        </div>
      </div>
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
        @click="selectMenu"
      >
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAdminStore } from "@/stores/adminStore";

const router = useRouter();
const adminStore = useAdminStore();
// 监听侧边栏是否折叠
const isCollapsed = computed(() => adminStore.isCollapsed);

const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href;

const menuItems = router.options.routes[0].children;

const selectMenu = (key) => {
  const currentRouter = router.options.routes[0];
  const selectPath = `${currentRouter.path}/${key.index}`;
  // 点击菜单后，切换路由
  router.push(selectPath);
};
</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
}
.brand {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7eb;
  .logo {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .info-card {
    .brand-title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
    }
    .brand-title {
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #e4e7eb;
      color: #1f2937;
    }
    .brand-subtitle {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>