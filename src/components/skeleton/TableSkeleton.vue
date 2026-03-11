<template>
  <div class="table-skeleton">
    <div class="skeleton-header">
      <div v-for="i in columns" :key="i" class="skeleton-header-cell"></div>
    </div>
    <div class="skeleton-body">
      <div v-for="row in rows" :key="row" class="skeleton-row">
        <div v-for="col in columns" :key="col" class="skeleton-cell"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Number,
    default: 8,
  },
  rows: {
    type: Number,
    default: 10,
  },
});
</script>

<style scoped>
.table-skeleton {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-header {
  display: flex;
  background: #f5f7fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.skeleton-header-cell {
  height: 20px;
  width: 100px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  margin-right: 16px;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 8px 0;
}

.skeleton-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  height: 60px;
}

.skeleton-cell {
  height: 16px;
  width: 100px;
  background: #f0f0f0;
  margin-right: 16px;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
