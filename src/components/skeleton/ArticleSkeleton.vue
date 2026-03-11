<template>
  <div class="article-skeleton">
    <div v-for="i in count" :key="i" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-desc"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 6
  }
})
</script>

<style scoped>
.article-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.skeleton-card {
  display: flex;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 182px;
}

.skeleton-image {
  width: 240px;
  height: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.skeleton-title {
  height: 22px;
  width: 80%;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-meta {
  height: 16px;
  width: 60%;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-desc {
  height: 16px;
  width: 40%;
  background: #f0f0f0;
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

@media (max-width: 768px) {
  .skeleton-card {
    flex-direction: column;
    height: auto;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    margin-bottom: 12px;
  }

  .skeleton-content {
    margin-left: 0;
  }
}
</style>
