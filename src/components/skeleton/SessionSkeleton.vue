<template>
  <div class="session-skeleton">
    <div v-for="i in count" :key="i" class="skeleton-item">
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta">
          <div class="skeleton-time"></div>
        </div>
        <div class="skeleton-preview"></div>
        <div class="skeleton-stats">
          <div class="skeleton-stat-item"></div>
          <div class="skeleton-stat-item"></div>
        </div>
      </div>
      <div class="skeleton-action"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 6,
  },
});
</script>

<style scoped>
.session-skeleton {
  padding: 0;
}

.skeleton-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 120px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  background: white;
}

.skeleton-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-meta {
  margin-bottom: 4px;
}

.skeleton-time {
  height: 12px;
  width: 120px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-preview {
  height: 12px;
  width: 90%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-stat-item {
  height: 12px;
  width: 80px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-action {
  width: 28px;
  height: 28px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-left: 8px;
  margin-top: 4px;
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
