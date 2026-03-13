<template>
  <div class="home-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="floating-shape shape-1">💚</div>
      <div class="floating-shape shape-2">✨</div>
      <div class="floating-shape shape-3">🌟</div>
    </div>

    <div class="content">
      <div class="text animate-fade-in-left">
        <!-- 标签 -->
        <div class="tag-wrapper">
          <span class="tag">
            <el-icon><StarFilled /></el-icon>
            AI 智能心理陪伴
          </span>
        </div>

        <!-- 主标题 -->
        <h1 class="title">
          <span class="title-line">一次温暖的对话</span>
          <span class="title-line highlight">
            <span class="gradient-text">化孤独为慰藉</span>
            <span class="cursor">|</span>
          </span>
        </h1>

        <!-- 描述文字 -->
        <p class="description">
          <span class="quote-mark">"</span>
          不刻意找话，你说的我都认真听、慢慢懂，那些细碎情绪有人接住，不催不扰，平淡日子里，我陪你好好唠嗑
          <span class="quote-mark">"</span>
        </p>

        <!-- 特性标签 -->
        <div class="features">
          <div
            class="feature-item"
            v-for="(feature, index) in features"
            :key="index"
          >
            <div class="feature-icon" :style="{ background: feature.bgColor }">
              <el-icon :size="20" :color="feature.iconColor">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <span class="feature-text">{{ feature.text }}</span>
          </div>
        </div>

        <!-- CTA 按钮组 -->
        <div class="hero-actions">
          <button class="btn btn-primary" @click="toChat">
            <span class="btn-content">
              <el-icon><ChatDotRound /></el-icon>
              <span>开始倾诉</span>
            </span>
            <div class="btn-glow"></div>
          </button>
          <button class="btn btn-secondary" @click="toRecord">
            <span class="btn-content">
              <el-icon><EditPen /></el-icon>
              <span>记录心情</span>
            </span>
          </button>
        </div>

        <!-- 统计数据 -->
        <div class="stats">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 机器人形象区 -->
      <div class="robot-section animate-fade-in-right">
        <div class="robot-container">
          <div class="robot-glow"></div>
          <div class="robot-orbit">
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
            <div class="orbit-dot"></div>
          </div>
          <div class="robot-image-wrapper">
            <el-image
              :src="logoUrl"
              alt="塔塔AI助手"
              class="robot-image"
              :preview-src-list="[logoUrl]"
            />
          </div>
          <!-- 对话气泡 -->
          <div class="chat-bubble bubble-1">
            <span>你好呀~ 😊</span>
          </div>
          <div class="chat-bubble bubble-2">
            <span>我在这里陪你</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部波浪 -->
    <div class="wave-container">
      <svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
          fill="rgba(255,255,255,0.1)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import { getDataAnalyticsOverview } from "@/api/admin";

const logoUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;

// 特性列表
const features = ref([
  {
    icon: "Cpu",
    text: "AI 智能对话",
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    iconColor: "#fff",
  },
  {
    icon: "CircleCheck",
    text: "情绪追踪",
    bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    iconColor: "#fff",
  },
  {
    icon: "Lock",
    text: "隐私保护",
    bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    iconColor: "#fff",
  },
]);

// 统计数据
const stats = ref([
  { number: "-", label: "陪伴用户" },
  { number: "-", label: "温暖对话" },
  { number: "-", label: "平均心情" },
]);

// 获取统计数据
const fetchStats = async () => {
  try {
    const res = await getDataAnalyticsOverview();
    const { systemOverview } = res;
    stats.value = [
      { number: formatNumber(systemOverview.totalUsers), label: "陪伴用户" },
      {
        number: formatNumber(systemOverview.totalSessions),
        label: "温暖对话",
      },
      { number: systemOverview.avgMoodScore.toString(), label: "平均心情" },
    ];
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "W+";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K+";
  }
  return num.toString();
};

// 检查用户是否登录
const isLogin = () => {
  return !!localStorage.getItem("token");
};

// 跳转到聊天页面
const toChat = () => {
  if (!isLogin()) {
    ElMessage.warning("请先登录账号");
    router.push("auth/login");
    return;
  }
  router.push("/consultation");
};

// 跳转到记录页面
const toRecord = () => {
  if (!isLogin()) {
    ElMessage.warning("请先登录账号");
    router.push("auth/login");
    return;
  }
  router.push("/emotion-diary");
};

// 打字机效果
onMounted(() => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
    }, 530);
  }

  // 获取统计数据
  fetchStats();
});
</script>

<style scoped lang="scss">
// 设计系统变量
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --warm-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --calm-gradient: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

.home-container {
  position: relative;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    animation: float 20s infinite ease-in-out;

    &-1 {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      top: -200px;
      right: -100px;
      animation-delay: 0s;
    }

    &-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      bottom: -100px;
      left: -100px;
      animation-delay: -5s;
    }

    &-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      top: 50%;
      left: 30%;
      animation-delay: -10s;
    }
  }

  .floating-shape {
    position: absolute;
    font-size: 24px;
    opacity: 0.3;
    animation: float-shape 15s infinite ease-in-out;

    &.shape-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    &.shape-2 {
      top: 60%;
      right: 15%;
      animation-delay: -5s;
    }

    &.shape-3 {
      bottom: 20%;
      left: 20%;
      animation-delay: -10s;
    }
  }
}

// 内容区
.content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1400px;
  width: 100%;
  align-items: center;
}

// 文字内容区
.text {
  color: white;
}

// 标签
.tag-wrapper {
  margin-bottom: 24px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #a5b4fc;
  animation: fadeInUp 0.6s ease-out;

  .el-icon {
    color: #fbbf24;
  }
}

// 标题
.title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  .title-line {
    display: block;
    animation: fadeInUp 0.6s ease-out 0.1s both;

    &.highlight {
      margin-top: 8px;
      animation-delay: 0.2s;
    }
  }

  .gradient-text {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fa709a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cursor {
    color: #f5576c;
    animation: blink 1s infinite;
  }
}

// 描述
.description {
  font-size: 18px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  max-width: 500px;
  animation: fadeInUp 0.6s ease-out 0.3s both;

  .quote-mark {
    color: #f5576c;
    font-size: 24px;
    font-weight: bold;
  }
}

// 特性列表
.features {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out 0.4s both;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .feature-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .feature-text {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 按钮组
.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.btn {
  position: relative;
  padding: 16px 32px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(245, 87, 108, 0.4);
  }

  .btn-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 16px;
    opacity: 0;
    filter: blur(10px);
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover .btn-glow {
    opacity: 0.5;
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

// 统计数据
.stats {
  display: flex;
  gap: 48px;
  animation: fadeInUp 0.6s ease-out 0.6s both;

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 机器人区域
.robot-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.robot-container {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.robot-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(102, 126, 234, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: pulse 4s infinite ease-in-out;
}

.robot-orbit {
  position: absolute;
  width: 350px;
  height: 350px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rotate 20s linear infinite;

  .orbit-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #f5576c;
    border-radius: 50%;
    box-shadow: 0 0 10px #f5576c;

    &:nth-child(1) {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    &:nth-child(2) {
      bottom: 30%;
      right: 0;
    }

    &:nth-child(3) {
      bottom: 30%;
      left: 0;
    }
  }
}

.robot-image-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: float 6s infinite ease-in-out;

  .robot-image {
    width: 180px;
    height: 180px;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
  }
}

// 对话气泡
.chat-bubble {
  position: absolute;
  padding: 12px 20px;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: bubble-float 3s infinite ease-in-out;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }

  &.bubble-1 {
    top: 60px;
    right: 20px;
    animation-delay: 0s;

    &::after {
      right: 20px;
    }
  }

  &.bubble-2 {
    top: 120px;
    left: 20px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    animation-delay: -1.5s;

    &::after {
      left: 20px;
      border-top-color: #f5576c;
    }
  }
}

// 波浪
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  overflow: hidden;

  .wave {
    width: 100%;
    height: 100%;
    animation: wave 10s linear infinite;
  }
}

// 动画定义
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes float-shape {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bubble-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out;
}

// 响应式设计
@media (max-width: 1200px) {
  .content {
    gap: 40px;
  }

  .title {
    font-size: 48px;
  }
}

@media (max-width: 992px) {
  .content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .text {
    order: 2;
  }

  .robot-section {
    order: 1;
  }

  .features {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .stats {
    justify-content: center;
  }

  .description {
    margin-left: auto;
    margin-right: auto;
  }

  .robot-container {
    width: 300px;
    height: 300px;
  }

  .robot-image-wrapper {
    width: 200px;
    height: 200px;

    .robot-image {
      width: 130px;
      height: 130px;
    }
  }
}

@media (max-width: 576px) {
  .home-container {
    padding: 20px;
  }

  .title {
    font-size: 36px;
  }

  .description {
    font-size: 16px;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;

    .btn {
      width: 100%;
      justify-content: center;
    }
  }

  .stats {
    gap: 24px;
  }

  .chat-bubble {
    display: none;
  }
}
</style>
