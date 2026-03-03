<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div v-if="dashboardData.systemOverview" class="card-content">
            <div class="avatar users">
              <el-image :src="usersIcon" class="imageSize" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">
                {{ dashboardData?.systemOverview?.totalUsers }}
              </p>
              <p class="subtitle-title">
                活跃用户: {{ dashboardData?.systemOverview?.activeUsers }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div v-if="dashboardData.systemOverview" class="card-content">
            <div class="avatar like">
              <el-image :src="likeIcon" class="imageSize" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">
                {{ dashboardData?.systemOverview?.totalDiaries }}
              </p>
              <p class="subtitle-title">
                今日新增:
                {{ dashboardData?.systemOverview?.todayNewDiaries }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div v-if="dashboardData.systemOverview" class="card-content">
            <div class="avatar comments">
              <el-image :src="commentsIcon" class="imageSize" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">
                {{ dashboardData?.systemOverview?.totalSessions }}
              </p>
              <p class="subtitle-title">
                今日新增:
                {{ dashboardData?.systemOverview?.todayNewSessions }}
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div v-if="dashboardData.systemOverview" class="card-content">
            <div class="avatar smile">
              <el-image :src="smileIcon" class="imageSize" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">
                {{ dashboardData?.systemOverview?.avgMoodScore }}/10
              </p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div
              v-if="dashboardData.consultationStats"
              class="consultation-stats"
            >
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">
                  {{ dashboardData?.consultationStats?.totalSessions }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">
                  {{ dashboardData?.consultationStats?.avgDurationMinutes }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">
                  {{ dashboardData?.systemOverview?.activeUsers }}
                </div>
              </div>
            </div>
            <div
              ref="consultationChartRef"
              style="width: 100%; height: 260px"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-card style="width: 100%">
        <template #header>
          <div class="card-header">用户活跃度趋势</div>
        </template>
        <div class="chart-content">
          <div
            ref="userActivityChartRef"
            style="width: 100%; height: 300px"
          ></div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
import { getDataAnalyticsOverview } from "@/api/admin";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

//统计图片引入
const usersIcon = new URL("@/assets/images/users.png", import.meta.url).href;
const likeIcon = new URL("@/assets/images/like.png", import.meta.url).href;
const commentsIcon = new URL("@/assets/images/comments.png", import.meta.url)
  .href;
const smileIcon = new URL("@/assets/images/smile.png", import.meta.url).href;

// 存储数据分析概览数据
const dashboardData = ref({});
//获取数据分析概览数据
const getDashboardData = async () => {
  try {
    const res = await getDataAnalyticsOverview();
    dashboardData.value = res;
    initCharts();
  } catch (error) {
    console.log(error);
  }
};

// 初始化图表
const initCharts = () => {
  initEmotionChart();
  initConsultationChart();
  initUserActivityChart();
};

// 咨询会话统计图表实例
let consultationChart = null;
// 咨询会话统计图表引用
const consultationChartRef = ref(null);
// 初始化咨询会话统计图表
const initConsultationChart = () => {
  // 检查图表引用是否存在
  if (!consultationChartRef.value) {
    return;
  }
  // 检查是否已存在图表实例，若存在则先销毁
  if (consultationChart) {
    consultationChart.dispose();
  }
  // 初始化图表实例
  consultationChart = echarts.init(consultationChartRef.value);
  //获取咨询会话统计数据
  const dailyTrend = dashboardData.value.consultationStats.dailyTrend;
  const option = {
    title: {
      text: "咨询活动统计",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["会话数量", "参与用户数"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dailyTrend.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "会话数量",
        type: "bar",
        data: dailyTrend.map((item) => item.sessionCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#74b9ff" },
              { offset: 1, color: "#0984e3" },
            ],
          },
        },
        barWidth: "40%",
      },
      {
        name: "参与用户数",
        type: "bar",
        data: dailyTrend.map((item) => item.userCount),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#fdcb6e" },
              { offset: 1, color: "#f39c12" },
            ],
          },
        },
        barWidth: "40%",
      },
    ],
  };
  // 使用配置项显示图表
  consultationChart.setOption(option);
};

// 情绪趋势分析图表实例
let emotionChart = null;
// 情绪趋势分析图表引用
const emotionChartRef = ref(null);
// 初始化情绪趋势分析图表
const initEmotionChart = () => {
  // 检查图表引用是否存在
  if (!emotionChartRef.value) {
    return;
  }
  // 检查是否已存在图表实例，若存在则先销毁
  if (emotionChart) {
    emotionChart.dispose();
  }
  // 初始化图表实例
  emotionChart = echarts.init(emotionChartRef.value);
  //获取情绪趋势分析数据
  const TrendData = dashboardData.value.emotionTrend;
  // 配置图表选项 - 情绪趋势分析图表
  const option = {
    // 图表标题配置
    title: {
      text: "情绪趋势分析",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    // 网格配置 - 图表区域内的网格线
    grid: {
      left: "3%",
      right: "4%",
      top: 80,
      bottom: "3%",
      containLabel: true,
    },
    // 提示框配置 - 鼠标悬停时显示详细信息
    tooltip: {
      trigger: "axis", // 坐标轴触发，显示所有系列的数据
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    // 图例配置 - 显示两条线的标识
    legend: {
      data: ["平均情绪评分", "记录数量"],
      top: 40,
    },
    // X轴配置 - 显示日期
    xAxis: {
      type: "category", // 类目轴，适合显示离散数据（如日期）
      data: TrendData.map((item) => item.date), // 从数据中提取日期作为X轴标签
      axisLine: {
        lineStyle: {
          color: "#2d3436",
        },
      },
    },
    // Y轴配置 - 双Y轴：左侧显示情绪评分，右侧显示记录数量
    yAxis: [
      {
        type: "value",
        name: "情绪评分",
        position: "left", // 左侧Y轴
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
      {
        type: "value",
        name: "记录数量",
        position: "right", // 右侧Y轴
        axisLine: {
          lineStyle: {
            color: "#2d3436",
          },
        },
      },
    ],
    // 数据系列配置 - 两条折线图
    series: [
      {
        name: "平均情绪评分",
        data: TrendData.map((item) => item.avgMoodScore), // 平均情绪评分数据
        type: "line", // 折线图
        smooth: true, // 平滑曲线
        lineStyle: {
          width: 3,
          color: "#faebaf", // 橙色线条
        },
        itemStyle: {
          color: "#faebaf", // 数据点颜色
        },
      },
      {
        name: "记录数量",
        data: TrendData.map((item) => item.recordCount), // 记录数量数据
        type: "line",
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#eeb5a3", // 浅橙色线条
        },
        itemStyle: {
          color: "#eeb5a3",
        },
      },
    ],
  };
  // 设置图表选项
  emotionChart.setOption(option);
};

// 用户活跃度趋势图表实例
let userActivityChart = null;
// 用户活跃度趋势图表引用
const userActivityChartRef = ref(null);

const initUserActivityChart = () => {
  // 检查图表引用是否存在
  if (!userActivityChartRef.value) {
    return;
  }
  // 检查是否已存在图表实例，若存在则先销毁
  if (userActivityChart) {
    userActivityChart.dispose();
  }
  // 初始化图表实例
  userActivityChart = echarts.init(userActivityChartRef.value);

  const activityData = dashboardData.value.userActivity;
  const option = {
    title: {
      text: "用户活跃度趋势",
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: "#2d3436",
      },
      left: "center",
      top: 10,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#fab1a0",
      borderWidth: 1,
      textStyle: {
        color: "#2d3436",
      },
    },
    legend: {
      data: ["活跃用户", "新增用户", "日记用户", "咨询用户"],
      top: 40,
      textStyle: {
        color: "#636e72",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: activityData.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      axisLabel: {
        color: "#636e72",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#636e72",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.3)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(244, 162, 97, 0.1)",
        },
      },
    },
    series: [
      {
        name: "活跃用户",
        type: "line",
        data: activityData.map((item) => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#a29bfe",
        },
        itemStyle: {
          color: "#a29bfe",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(162, 155, 254, 0.4)" },
              { offset: 1, color: "rgba(162, 155, 254, 0.1)" },
            ],
          },
        },
      },
      {
        name: "新增用户",
        type: "line",
        data: activityData.map((item) => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fdcb6e",
        },
        itemStyle: {
          color: "#fdcb6e",
        },
      },
      {
        name: "日记用户",
        type: "line",
        data: activityData.map((item) => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#00b894",
        },
        itemStyle: {
          color: "#00b894",
        },
      },
      {
        name: "咨询用户",
        type: "line",
        data: activityData.map((item) => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: "#fab1a0",
        },
        itemStyle: {
          color: "#fab1a0",
        },
      },
    ],
  };
  // 设置图表选项
  userActivityChart.setOption(option);
};

onMounted(() => {
  getDashboardData();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
      .imageSize {
        width: 40px;
        height: 40px;
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>