<template>
  <div>
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="session-preview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100" />
      <el-table-column prop="lastMessageTime" label="时间" width="100" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" text @click="viewSessionDetail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px"
      layout="prev,pager,next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      @change="handlePageChange"
    />
    <el-dialog
      title="咨询会话详情"
      v-model="showDetailDialog"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <!-- 会话基本信息 -->
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户:</div>
            <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间:</div>
            <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数:</div>
            <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          </div>
        </div>
        <!-- 消息列表 -->
        <div class="messages-container">
          <div class="messages-header">
            <h4>会话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessages">
            <div
              v-for="message in sessionMessages"
              :key="message.id"
              class="message-item"
              :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{ message.senderTypeDesc }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getConsultationList, getSessionDetail } from "@/api/admin";
import { onMounted, ref, reactive } from "vue";
import PageHead from "@/components/PageHead.vue";
import { ElMessage } from "element-plus";

// 加载状态
const loadingMessages = ref(false);
// 咨询列表加载状态
const tableLoading = ref(false);
// 会话详情弹窗显示状态
const showDetailDialog = ref(false);
// 咨询记录列表
const tableData = ref([]);
// 会话消息列表
const sessionMessages = ref([]);
// 分页信息
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

// 获取咨询记录列表
const handleSearch = async () => {
  tableLoading.value = true;
  try {
    const res = await getConsultationList(pagination);
    const { records, total } = res;
    tableData.value = records;
    pagination.total = total;
  } finally {
    tableLoading.value = false;
  }
};

// 分页改变处理函数
const handlePageChange = (page) => {
  pagination.currentPage = page;
  // 重新获取咨询记录列表
  handleSearch();
};

const sessionDetail = ref({});
// 查看会话详情处理函数
const viewSessionDetail = async (row) => {
  loadingMessages.value = true;
  showDetailDialog.value = true;
  try {
    const res = await getSessionDetail(row.id);
    // 响应拦截器已经处理了成功的情况，直接使用返回的数据
    loadingMessages.value = false;
    sessionMessages.value = res;
    sessionDetail.value = row;
  } catch (error) {
    loadingMessages.value = false;
    ElMessage.error("获取会话详情失败");
  }
};

onMounted(() => {
  handleSearch();
});
</script>

<style lang="scss" scoped>
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.session-detail {
  max-height: 70vh;
  overflow-y: auto;
  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    :last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}
.messages-container {
  margin-top: 20px;
  .messages-header {
    margin-bottom: 16px;
    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      :last-child {
        margin-bottom: 0;
      }
      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }

      .message-content {
        color: #333;
        line-height: 1.6;
        white-space: pre-wrap;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>