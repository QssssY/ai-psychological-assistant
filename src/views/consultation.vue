<template>
  <div class="consultation-container" :class="{ 'sad-theme': isSadTheme }">
    <div class="sidebar">
      <!-- AI助手信息 -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image
            :src="iconUrl"
            alt="AI助手"
            class="assistant-icon"
            style="width: 25px; height: 25px"
          />
        </div>
        <h3 class="assistant-name">塔塔AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>
      <!-- 情绪花园 -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
          <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{
              currentEmotion.isNegative ? "需要关注" : "很不错"
            }}</span>
          </div>
          <div class="emotion-intensity">
            <div class="intensity-dots">
              <span
                v-for="dot in 3"
                :key="dot"
                class="dot"
                :class="{
                  active: dot <= getIntensityClass(currentEmotion.emotionScore),
                }"
              ></span>
            </div>
            <span class="intensity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <!-- 温暖建议卡片 -->
          <div class="warm-suggestion" v-if="currentEmotion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">
                {{ currentEmotion.suggestion || "保持良好状态，天天开心" }}
              </div>
            </div>
          </div>
          <!-- 治愈行动清单 -->
          <div
            class="healing-actions"
            v-if="currentEmotion.improvementSuggestions?.length > 0"
          >
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div
                v-for="action in currentEmotion.improvementSuggestions"
                :key="action"
                class="action-item"
              >
                <div class="action-icon">✨</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <!-- 风险提示 -->
          <div
            class="risk-notice"
            v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1"
          >
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">风险提示</div>
              <div class="notice-text">
                {{ currentEmotion.riskDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 历史会话列表 -->
      <div class="session-history">
        <h4 class="section-title">会话历史</h4>
        <!-- 骨架屏加载状态 -->
        <SessionSkeleton v-if="sessionLoading" :count="6" />
        <!-- 虚拟滚动列表 -->
        <!-- 调试信息 -->
        <div
          v-if="sessionList.length === 0 && !sessionLoading"
          style="padding: 20px; text-align: center; color: #999"
        >
          暂无会话记录
        </div>
        <!-- 虚拟滚动列表 -->
        <RecycleScroller
          v-else-if="sessionList.length > 0"
          class="session-scroller"
          :items="sessionList"
          :item-size="120"
          key-field="id"
          :buffer="5"
          v-slot="{ item }"
        >
          <div
            class="session-item"
            :class="{
              active: currentSession?.sessionId === `session_${item.id}`,
            }"
            @click="handleSessionClick(item)"
          >
            <div class="session-info">
              <div class="session-title">
                <span class="title-text">{{
                  item.sessionTitle || "无标题"
                }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ item.startedAt || "-" }}</span>
                </div>
                <div class="session-preview">
                  {{ item.lastMessageContent || "无消息内容" }}
                </div>
                <div class="session-stats">
                  <span class="stat-item">
                    <el-icon><ChatRound /></el-icon>
                    {{ item.messageCount || 0 }}
                  </span>
                  <span class="stat-item">
                    <el-icon><Clock /></el-icon>
                    {{ formatDuration(item.durationMinutes || 0) }}
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button
                  type="danger"
                  text
                  size="small"
                  @click.stop="handleDeleteSession(item.id)"
                >
                  <el-icon><DeleteFilled /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </RecycleScroller>
      </div>
    </div>
    <!-- 聊天消息区域 -->
    <div class="chat-main">
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image
              :src="likeIconUrl"
              alt="AI助手"
              style="width: 30px; height: 30px"
            />
          </div>
          <div class="chat-info">
            <h2>塔塔AI助手</h2>
            <p>您的贴心AI心理健康助手</p>
          </div>
        </div>
        <el-button circle @click="createNewFrontendSession" title="新建会话">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      <div class="chat-messages">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="message-item ai-message">
          <div class="message-avatar">
            <el-image
              :src="iconUrl"
              alt="AI助手"
              style="width: 18px; height: 18px"
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>
                你好，我是塔塔，您的AI心理健康助手。很高心陪伴您，为你提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？
              </p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <!-- 消息列表 -->
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            <el-image
              v-if="msg.senderType === 1"
              :src="userIconUrl"
              alt="用户"
              style="width: 18px; height: 18px"
            />
            <el-image
              v-else
              :src="iconUrl"
              alt="AI助手"
              style="width: 18px; height: 18px"
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- AI正在思考中 -->
              <div
                v-if="msg.senderType === 2 && isAiTyping && !msg.content"
                class="typing-indicator"
              >
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI错误提示 -->
              <div v-else-if="msg.isError" class="error-message">
                <p>
                  {{ msg.content }}
                </p>
              </div>
              <!-- AI正常返回消息 -->
              <MarkdownRenderer
                v-else-if="msg.senderType === 2 && !msg.isError"
                :content="msg.content"
                :is-ai-message="true"
              />
              <!-- 用户消息 -->
              <p
                v-else-if="msg.content"
                v-html="formatMessageContent(msg.content)"
              ></p>
            </div>
            <div class="message-time">
              {{
                msg.senderType === 2 && isAiTyping
                  ? "正在输入中..."
                  : msg.createdAt
              }}
              <!-- AI消息播报按钮 -->
              <el-button
                v-if="
                  msg.senderType === 2 &&
                  !msg.isError &&
                  msg.content &&
                  tts.isSupported
                "
                @click.stop="playAIMessage(msg)"
                :icon="tts.isPlayingMessage(msg.id) ? VideoPause : VideoPlay"
                :type="tts.isPlayingMessage(msg.id) ? 'primary' : 'default'"
                size="small"
                text
                class="tts-play-btn"
                :title="tts.isPlayingMessage(msg.id) ? '停止播报' : '语音播报'"
              >
                {{ tts.isPlayingMessage(msg.id) ? "停止" : "播报" }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 消息输入区域 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input
            v-model="inputMessage"
            placeholder="请输入您想要分享的内容..."
            type="textarea"
            :rows="3"
            :disabled="isAiTyping"
            @keydown="handleKeyDown"
            class="message-input"
            clearable
          />
          <div class="input-footer">
            <span>按Enter发送，Shift+Enter换行</span>
            <span>{{ inputMessage.length }}/ 500</span>
          </div>
        </div>
        <el-button
          :disabled="!inputMessage || inputMessage.length > 500"
          type="primary"
          class="send-btn"
          @click="sendMessage"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  startSession,
  getSessionList,
  deleteSession,
  getSessionDetail,
  getSessionEmotionAnalysis,
} from "@/api/frontend";
import { ElMessage, ElMessageBox } from "element-plus";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import SessionSkeleton from "@/components/skeleton/SessionSkeleton.vue";
import { useTTS } from "@/composables/useTTS";
import { VideoPlay, VideoPause } from "@element-plus/icons-vue";

// TTS功能
const tts = useTTS();

// 播放AI消息
const playAIMessage = (msg) => {
  if (tts.isPlayingMessage(msg.id)) {
    tts.stop();
  } else {
    tts.speak(msg.content, msg.id);
  }
};

// 引入图标
const iconUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;
const likeIconUrl = new URL("@/assets/images/like.png", import.meta.url).href;
const userIconUrl = new URL("@/assets/images/users.png", import.meta.url).href;

// 定义AI助手是否正在输入中
const isAiTyping = ref(false);
//定义对话消息数据
const messages = ref([]);
// 用户输入消息
const inputMessage = ref("");
// 历史会话列表
const sessionList = ref([]);
// 会话列表加载状态
const sessionLoading = ref(true);
//情绪花园
const currentEmotion = ref({
  primaryEmotion: "中性",
  emotionScore: 55,
  isNegative: false,
  riskLevel: 0,
  suggestion: "保持良好状态",
  improvementSuggestions: ["动起来，鲜花会为你开"],
  riskDescription: "正常",
});
//根据情绪分数获取情绪强度等级
const getIntensityClass = (score) => {
  if (score >= 61) return 3;
  if (score >= 31) return 2;
  return 1;
};
//根据风险等级获取风险描述
const getRiskText = (riskLevel) => {
  if (riskLevel === 0) return "正常";
  if (riskLevel === 1) return "关注";
  if (riskLevel === 2) return "预警";
  if (riskLevel === 3) return "危机 ";
  return "正常";
};

// 是否启用“伤心主题”（当情绪为负面时）
const isSadTheme = ref(false);
// 监听 currentEmotion.isNegative 的变化
watch(
  () => currentEmotion.value.isNegative,
  (newVal) => {
    isSadTheme.value = newVal;
  },
  { immediate: true } // 立即执行一次，确保初始状态正确
);
// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// 将分钟数转换为年月日时分格式
const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "0分钟";

  // 定义时间单位的分钟数
  const minutesInYear = 365 * 24 * 60; // 一年的分钟数
  const minutesInMonth = 30 * 24 * 60; // 一个月的分钟数
  const minutesInDay = 24 * 60; // 一天的分钟数
  const minutesInHour = 60; // 一小时的分钟数

  // 计算各时间单位
  const years = Math.floor(minutes / minutesInYear);
  minutes %= minutesInYear;

  const months = Math.floor(minutes / minutesInMonth);
  minutes %= minutesInMonth;

  const days = Math.floor(minutes / minutesInDay);
  minutes %= minutesInDay;

  const hours = Math.floor(minutes / minutesInHour);
  const mins = minutes % minutesInHour;

  // 构建结果字符串
  let result = "";
  if (years > 0) result += `${years}年`;
  if (months > 0) result += `${months}月`;
  if (days > 0) result += `${days}天`;
  if (hours > 0) result += `${hours}小时`;
  if (mins > 0) result += `${mins}分钟`;

  return result + "前";
};

// 获取当前会话的情绪分析
const getCurrentSessionEmotion = async (sessionId) => {
  //确保sessionId格式正确
  const id = sessionId.toString().startsWith("session_")
    ? sessionId
    : `session_${sessionId}`;
  const res = await getSessionEmotionAnalysis(id);
  if (res) {
    currentEmotion.value = res;
  }
};

// 格式化用户消息内容，简单的换行逻辑
const formatMessageContent = (content) => {
  // 替换Markdown格式为HTML
  return content.replace(/\n/g, "<br>");
};

// 删除会话记录
const handleDeleteSession = async (sessionId) => {
  // 确认删除
  ElMessageBox.confirm("确认删除该会话吗？删除后将无法恢复", "删除会话", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteSession(sessionId);
      ElMessage.success("会话删除成功");
      // 刷新会话列表
      loadSessionList();
    } catch (error) {
      ElMessage.error("删除会话失败");
    }
  });
};

// 处理会话点击事件
const handleSessionClick = async (session) => {
  // 点击会话时，获取会话详情
  const res = await getSessionDetail(session.id);

  messages.value = res || [];
  //将当前会话设置为点击的会话
  const sessionData = {
    sessionId: `session_${session.id}`,
    status: "ACTIVE",
    sessionTitle: session.sessionTitle,
  };
  //将当前会话设置为点击的会话
  currentSession.value = sessionData;
  //获取当前会话的情绪分析
  getCurrentSessionEmotion(sessionData.sessionId);
};

// 获取历史会话列表
const loadSessionList = async () => {
  sessionLoading.value = true;
  try {
    const res = await getSessionList({
      pageNum: 1,
      pageSize: 100,
    });
    //将后端数据转换为前端数据格式
    sessionList.value = res.records || [];
  } finally {
    // 延迟关闭骨架屏，避免闪烁
    setTimeout(() => {
      sessionLoading.value = false;
    }, 300);
  }
};

// 用户发送消息
const sendMessage = () => {
  //判断用户是否输入了内容
  if (!inputMessage.value.trim()) return;
  //判断AI助手是否正在输入中
  if (isAiTyping.value) {
    ElMessage.warning("AI助手正在输入中，请稍后再试");
    return;
  }
  const userMessage = inputMessage.value.trim();
  //清空输入框
  inputMessage.value = "";

  //如果没有会话或者是临时会话，创建一个新会话
  if (currentSession.value && currentSession.value.status === "TEMP") {
    startNewSession(userMessage);
  } else {
    //继续现有会话
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: userMessage,
      createAt: new Date().toISOString(),
    });
    startAIStreamingResponse(currentSession.value.sessionId, userMessage);
  }
};

// 当前会话对象
const currentSession = ref(null);

// 新建临时会话
const createNewFrontendSession = () => {
  // 新建会话逻辑
  //创建一个新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: "TEMP",
    sessionTitle: "新会话",
  };
  //将新会话设置为当前会话
  currentSession.value = newSession;
  //清空消息列表
  messages.value = [];

  //重置情绪花园
  currentEmotion.value = {
    primaryEmotion: "中性",
    emotionScore: 55,
    isNegative: false,
    riskLevel: 0,
    suggestion: "保持良好状态",
    improvementSuggestions: [],
    riskDescription: "正常",
  };
};

// 启动新会话
const startNewSession = async (userMessage) => {
  //构建会话参数
  const sessionParams = {
    initialMessage: userMessage,
  };
  //如果是临时会话，设置会话标题为 塔塔AI助手 -当前时间
  if (currentSession.value.sessionTitle === "新会话") {
    sessionParams.sessionTitle = `塔塔AI助手 - ${new Date().toLocaleString()}`;
  } else {
    //如果不是新会话，保持会话标题不变
    sessionParams.sessionTitle = currentSession.value.sessionTitle;
  }

  //调用后端接口创建新会话
  const res = await startSession(sessionParams);
  //将后端数据转换为前端数据格式
  const sessionData = {
    sessionId: res.sessionId,
    status: res.status,
    sessionTitle: sessionParams.sessionTitle,
  };

  //如果当前会话是临时会话，将其替换为新会话
  if (currentSession.value && currentSession.value.status === "TEMP") {
    //更新为正式会话
    currentSession.value = sessionData;
  } else {
    //否则创建一个新会话
    currentSession.value = sessionData;
  }
  //更新历史会话列表
  loadSessionList();
  //创建一个新的用户消息对象
  const userMessageObj = {
    id: Date.now(),
    senderType: 1,
    content: userMessage,
    createAt: new Date().toISOString(),
  };
  //将用户消息添加到消息列表中
  messages.value.push(userMessageObj);
  //开始流式传输
  startAIStreamingResponse(currentSession.value.sessionId, userMessage);
};

// 开始流式传输AI响应
const startAIStreamingResponse = (sessionId, userMessage) => {
  //防止重复发送
  if (isAiTyping.value) {
    ElMessage.warning("AI助手正在输入中，请稍后再试");
    return;
  }
  //设置AI助手正在输入中
  isAiTyping.value = true;

  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    content: "",
    createAt: new Date().toISOString(),
  };
  //将AI助手的消息添加到消息列表中
  messages.value.push(aiMessage);
  //开启流式传输
  const ctrl = new AbortController(); //用来中止fetch请求
  fetchEventSource("/api/psychological-chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: localStorage.getItem("token"),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    signal: ctrl.signal,
    onopen: (response) => {
      if (response.headers.get("Content-Type") !== "text/event-stream") {
        ElMessage.error("服务器返回非流式传输，请稍后再试");
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim();
      if (!raw) return;
      //事件名称
      const eventName = event.event;
      //当前会话的AI消息
      const currentAiMessage = messages.value[messages.value.length - 1];
      //如果是done事件，说明流式传输结束
      if (eventName === "done") {
        //设置AI助手不在输入中，流式传输结束
        isAiTyping.value = false;
        //关闭流式传输
        ctrl.abort();
        //开始情绪分析
        getCurrentSessionEmotion(currentSession.value.sessionId);
        return;
      }
      //message事件，说明是AI助手的回复
      const payload = JSON.parse(raw);
      const ok = String(payload.code) === "200";
      if (ok && payload.data && payload.data.content) {
        //更新AI助手的回复内容
        currentAiMessage.content += payload.data.content;
      } else if (!ok) {
        //如果不是200状态码，说明AI回复失败
        handleError(payload.message || "AI回复失败");
      }
    },
    onerror: (err) => {
      //如果发生错误，说明AI回复失败
      handleError(err || "AI回复失败");
      throw err;
    },
    onclose: () => {
      //开始情绪分析
      getCurrentSessionEmotion(currentSession.value.sessionId);
    },
  });
};

// 处理错误
const handleError = (err) => {
  //当前会话的AI消息
  const currentAiMessage = messages.value[messages.value.length - 1];
  if (currentAiMessage) {
    currentAiMessage.content = "AI回复失败，请重试";
  }
  isAiTyping.value = false;
  ElMessage.error("AI回复失败，请重试");
};

onMounted(() => {
  //加载历史会话列表
  loadSessionList();
  //初始化时创建一个新会话
  createNewFrontendSession();
});
</script>

<style scoped lang="scss">
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  overflow: hidden;
  .sidebar {
    width: 320px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 252, 248, 0.95) 100%
      );
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }
      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }
      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }
    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .session-list {
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
      }

      .session-scroller {
        height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

        :deep(.vue-recycle-scroller__item-wrapper) {
          transform: translateZ(0);
          will-change: transform;
        }

        :deep(.vue-recycle-scroller__item-view) {
          height: 120px !important;
          overflow: hidden;
        }

        .session-item {
          height: 120px;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: white;

          &:hover {
            background: #f8f9ff;
          }

          &.active {
            background: #e6f0ff;
            border-left: 3px solid #4096ff;
          }

          .session-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 100%;

            .session-title {
              flex: 1;
              min-width: 0;
              overflow: hidden;

              .title-text {
                display: block;
                font-weight: 500;
                font-size: 14px;
                color: #333;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.4;
              }

              .session-meta {
                margin-bottom: 4px;

                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }

              .session-preview {
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                max-height: 2.8em;
              }

              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;
                white-space: nowrap;

                .stat-item {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  white-space: nowrap;
                  flex-shrink: 0;
                }
              }
            }

            .session-actions {
              flex-shrink: 0;
              margin-left: 8px;
              padding-top: 4px;
            }
          }
        }
      }
    }
    .emotion-garden {
      background: linear-gradient(
        135deg,
        #fef9e7 0%,
        #fcf4e6 50%,
        #f6f0e8 100%
      );
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }
      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(
          135deg,
          #ff9a9e 0%,
          #fecfef 50%,
          #fecfef 100%
        );
        color: #fff;
        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }
        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }
      .warm-tips {
        text-align: center;
        margin-bottom: 16px;
        .emotion-status-text {
          margin-bottom: 12px;
          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }
          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }
        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          .intensity-dots {
            display: flex;
            gap: 4px;
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;
              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }
          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }
        .warm-suggestion {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.8)
          );
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .suggestion-content {
            text-align: left;
            flex: 1;
            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }
            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }
        .healing-actions {
          margin-bottom: 16px;
          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }
          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(255, 255, 255, 0.7)
              );
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;
              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }
              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .notice-content {
            flex: 1;
            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }
            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 252, 250, 0.98) 100%
    );
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    height: 100%;
    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;
      .header-left {
        display: flex;
        align-items: center;
        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }
        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          p {
            font-size: 14px;
          }
        }
      }
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.02) 0%,
        rgba(255, 252, 248, 0.05) 100%
      );
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }
        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }
        .message-content {
          max-width: 70%;
          .message-bubble {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 252, 248, 0.95) 100%
            );
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
              border: 1px solid #f87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991b1b;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 8px;

            .tts-play-btn {
              padding: 2px 6px;
              font-size: 11px;
              height: 22px;

              &:hover {
                color: #fb923c;
              }

              &.el-button--primary {
                color: #fb923c;
              }
            }
          }
        }
      }
    }

    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 16px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.5) 0%,
        rgba(255, 252, 248, 0.7) 100%
      );
      backdrop-filter: blur(10px);
      flex-shrink: 0;
      .input-container {
        flex: 1;
        min-width: 0;
      }
      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }
      .send-btn {
        height: 60px;
        width: 60px;
        min-height: 60px;
        min-width: 60px;
        border-radius: 16px;
        background: linear-gradient(
          135deg,
          #fb923c 0%,
          #f59e0b 100%
        ) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
        flex-shrink: 0;
      }
    }
  }
}
/* ========================================
   伤心主题样式（当 isNegative = true 时应用）
   色系：浅蓝灰 #E0E8F0、淡紫 #E6E6FA、浅藕荷 #F5F0F7
   强调色：淡蓝 #99B3DD
   背景色：极浅灰 #F8FAFC
======================================== */
.consultation-container.sad-theme {
  /* 页面整体背景 */
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);

  /* 侧边栏 - AI助手信息 */
  .sidebar {
    .ai-assistant-info {
      background: linear-gradient(
        135deg,
        rgba(224, 232, 240, 0.9) 0%,
        rgba(230, 230, 250, 0.95) 100%
      );
      border: 1px solid rgba(153, 179, 221, 0.15);
      box-shadow: 0 8px 32px rgba(153, 179, 221, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(10px);

      .breathing-circle {
        background: linear-gradient(135deg, #99b3dd 0%, #8ba3d0 100%);
        box-shadow: 0 6px 24px rgba(153, 179, 221, 0.3);
      }

      .assistant-name {
        background: linear-gradient(135deg, #99b3dd, #8ba3d0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .online-status {
        color: #667eea;
        .status-dot {
          background: #667eea;
          box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
        }
      }
    }

    /* 情绪花园 - 伤心主题配色 */
    .emotion-garden {
      background: linear-gradient(
        135deg,
        #e6e6fa 0%,
        #f5f0f7 50%,
        #e8e8f5 100%
      );
      box-shadow: 0 8px 32px rgba(153, 179, 221, 0.15);
      border: 1px solid rgba(153, 179, 221, 0.2);

      .garden-header {
        .garden-title {
          color: #667eea;
        }
      }

      .emotion-info {
        background: linear-gradient(
          135deg,
          #99b3dd 0%,
          #a8b8e0 50%,
          #b8c8e8 100%
        );
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 4px 16px rgba(153, 179, 221, 0.25);
      }

      .warm-tips {
        .emotion-status-text {
          .status-label {
            color: #667eea;
          }
          .status-emotion {
            color: #667eea;
          }
        }
        .emotion-intensity {
          .intensity-dots {
            .dot {
              background: #e0e8f0;
              &.active {
                background: linear-gradient(135deg, #99b3dd, #a8b8e0);
                box-shadow: 0 2px 8px rgba(153, 179, 221, 0.4);
              }
            }
          }
          .intensity-text {
            color: #667eea;
          }
        }
        .warm-suggestion {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(245, 240, 247, 0.9)
          );
          border: 1px solid rgba(153, 179, 221, 0.3);
          box-shadow: 0 6px 20px rgba(153, 179, 221, 0.12);

          .suggestion-content {
            .suggestion-title {
              color: #667eea;
            }
            .suggestion-text {
              color: #5a6a8a;
            }
          }
        }
        .healing-actions {
          .actions-title {
            color: #667eea;
          }
          .actions-list {
            .action-item {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.9),
                rgba(245, 240, 247, 0.85)
              );
              border: 1px solid rgba(153, 179, 221, 0.2);
              box-shadow: 0 4px 12px rgba(153, 179, 221, 0.08);

              .action-text {
                color: #5a6a8a;
              }
            }
          }
        }
        .risk-notice {
          background: linear-gradient(135deg, #e6e6fa, #d8d8f0);
          border: 1px solid rgba(153, 179, 221, 0.4);
          box-shadow: 0 6px 20px rgba(153, 179, 221, 0.2);

          .notice-content {
            .notice-title {
              color: #667eea;
            }
            .notice-text {
              color: #5a6a8a;
            }
          }
        }
      }
    }

    /* 历史会话列表 */
    .session-history {
      background: white;
      border: 1px solid rgba(153, 179, 221, 0.15);

      .section-title {
        color: #667eea;
      }

      .session-list {
        .session-item {
          &:hover {
            background: #f0f4fa;
            border-color: #d0e0f5;
          }
          &.active {
            background: #e0e8f5;
            border-color: #99b3dd;
          }
        }
      }
    }
  }

  /* 聊天主区域 */
  .chat-main {
    background: linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.95) 0%,
      rgba(240, 244, 250, 0.98) 100%
    );
    border: 1px solid rgba(153, 179, 221, 0.15);
    box-shadow: 0 12px 40px rgba(153, 179, 221, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.04);

    /* 聊天头部 - 蓝色系 */
    .chat-header {
      background: linear-gradient(135deg, #99b3dd 0%, #a8b8e0 100%);
      color: white;

      .chat-avatar {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    /* 消息列表区域 */
    .chat-messages {
      background: linear-gradient(
        135deg,
        rgba(248, 250, 252, 0.02) 0%,
        rgba(240, 244, 250, 0.05) 100%
      );
      scrollbar-color: rgba(153, 179, 221, 0.3) transparent;

      .message-item {
        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #99b3dd, #8ba3d0);
            box-shadow: 0 4px 12px rgba(153, 179, 221, 0.3);
          }
        }
        &.user-message {
          .message-avatar {
            background: linear-gradient(135deg, #7c8db0, #6b7a99);
            box-shadow: 0 4px 12px rgba(107, 122, 153, 0.3);
          }
        }
        .message-content {
          .message-bubble {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.95) 0%,
              rgba(245, 240, 247, 0.98) 100%
            );
            border: 1px solid rgba(153, 179, 221, 0.15);
            box-shadow: 0 4px 16px rgba(153, 179, 221, 0.08);
          }
        }
      }
    }

    /* 消息输入区域 */
    .chat-input {
      border-top: 1px solid rgba(153, 179, 221, 0.15);
      background: linear-gradient(
        135deg,
        rgba(248, 250, 252, 0.6) 0%,
        rgba(240, 244, 250, 0.8) 100%
      );
      backdrop-filter: blur(10px);

      .input-footer {
        color: #7c8db0;
      }

      /* 发送按钮 - 蓝色系 */
      .send-btn {
        background: linear-gradient(
          135deg,
          #99b3dd 0%,
          #8ba3d0 100%
        ) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(153, 179, 221, 0.3) !important;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(
            135deg,
            #8ba3d0 0%,
            #7c93c0 100%
          ) !important;
          box-shadow: 0 8px 24px rgba(153, 179, 221, 0.4) !important;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

.chat-input {
  .el-textarea {
    width: 100%;
    .el-textarea__inner {
      resize: none;
      min-height: 80px !important;
    }
  }
}

/* Element Plus 按钮主题色覆盖 - 伤心主题 */
.consultation-container.sad-theme {
  /* 侧边栏滚动条 - 蓝色系 */
  .sidebar {
    scrollbar-color: rgba(153, 179, 221, 0.5) transparent;

    &::-webkit-scrollbar-thumb {
      background: rgba(153, 179, 221, 0.5);
    }
  }

  .el-textarea {
    --el-input-focus-border-color: #99b3dd;
  }

  .el-input {
    --el-input-focus-border-color: #99b3dd;
  }

  .el-button--primary {
    --el-button-bg-color: #99b3dd;
    --el-button-border-color: #99b3dd;
    --el-button-hover-bg-color: #8ba3d0;
    --el-button-hover-border-color: #8ba3d0;
    --el-button-active-bg-color: #7c93c0;
    --el-button-active-border-color: #7c93c0;
  }
}
</style>
