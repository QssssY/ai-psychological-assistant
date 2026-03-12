<template>
  <div class="dashboard-skeleton">
    <!-- 统计卡片骨架屏 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="i in 4" :key="`stat-${i}`">
        <div class="stat-card-skeleton">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-number"></div>
            <div class="skeleton-subtitle"></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域骨架屏 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <div class="chart-card-skeleton">
          <div class="skeleton-header"></div>
          <div class="skeleton-chart"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card-skeleton">
          <div class="skeleton-header"></div>
          <div class="skeleton-stats">
            <div v-for="i in 4" :key="`stat-item-${i}`" class="skeleton-stat-item">
              <div class="skeleton-stat-label"></div>
              <div class="skeleton-stat-value"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据表格骨架屏 -->
    <el-row class="table-row">
      <el-col :span="24">
        <div class="table-card-skeleton">
          <div class="skeleton-header"></div>
          <div class="skeleton-table">
            <div class="skeleton-table-header">
              <div v-for="i in 5" :key="`th-${i}`" class="skeleton-th"></div>
            </div>
            <div class="skeleton-table-body">
              <div v-for="row in 5" :key="`row-${row}`" class="skeleton-tr">
                <div v-for="col in 5" :key="`td-${row}-${col}`" class="skeleton-td"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 骨架屏组件，无需逻辑
</script>

<style scoped lang="scss">
// 骨架屏动画
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@mixin skeleton-base {
  background: linear-gradient(
    90deg,
    var(--skeleton-bg) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.dashboard-skeleton {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;

    .stat-card-skeleton {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);

      .skeleton-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        @include skeleton-base;
      }

      .skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .skeleton-title {
          width: 60%;
          height: 14px;
          @include skeleton-base;
        }

        .skeleton-number {
          width: 40%;
          height: 28px;
          @include skeleton-base;
        }

        .skeleton-subtitle {
          width: 80%;
          height: 12px;
          @include skeleton-base;
        }
      }
    }
  }

  .charts-row {
    margin-bottom: 20px;

    .chart-card-skeleton {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
      height: 360px;

      .skeleton-header {
        width: 40%;
        height: 20px;
        @include skeleton-base;
        margin-bottom: 20px;
      }

      .skeleton-chart {
        width: 100%;
        height: 280px;
        @include skeleton-base;
        border-radius: 8px;
      }

      .skeleton-stats {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px 0;

        .skeleton-stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-light);

          &:last-child {
            border-bottom: none;
          }

          .skeleton-stat-label {
            width: 30%;
            height: 16px;
            @include skeleton-base;
          }

          .skeleton-stat-value {
            width: 20%;
            height: 24px;
            @include skeleton-base;
          }
        }
      }
    }
  }

  .table-row {
    .table-card-skeleton {
      background: var(--bg-card);
      border-radius: 8px;
      padding: 20px;
      box-shadow: var(--shadow-sm);

      .skeleton-header {
        width: 30%;
        height: 20px;
        @include skeleton-base;
        margin-bottom: 20px;
      }

      .skeleton-table {
        .skeleton-table-header {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 12px;

          .skeleton-th {
            flex: 1;
            height: 16px;
            @include skeleton-base;
          }
        }

        .skeleton-table-body {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .skeleton-tr {
            display: flex;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-light);

            .skeleton-td {
              flex: 1;
              height: 14px;
              @include skeleton-base;
            }
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .dashboard-skeleton {
    .stats-row {
      .el-col {
        width: 50%;
        margin-bottom: 16px;
      }
    }

    .charts-row {
      .el-col {
        width: 100%;
        margin-bottom: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard-skeleton {
    .stats-row {
      .el-col {
        width: 100%;
      }
    }
  }
}
</style>
