<template>
  <div class="articleDetail-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="header-section">
      <div class="header-content">
        <el-image
          :src="iconUrl"
          alt="知识文章图标"
          style="width: 60px; height: 60px"
        />
        <h1>知识文章详情</h1>
        <!-- 主题切换按钮 -->
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
        >
          <el-icon v-if="isDarkMode" class="theme-icon"><Sunny /></el-icon>
          <el-icon v-else class="theme-icon"><Moon /></el-icon>
          <span class="theme-text">{{ isDarkMode ? "浅色" : "深色" }}</span>
        </button>
      </div>
    </div>
    <div class="content">
      <div class="diary-card">
        <div class="title">文章信息</div>
        <div class="sub-title">
          <el-tag type="primary" plain size="large" class="category-tag">{{
            articleDetail.categoryName
          }}</el-tag>
          <div class="flex-box">
            <el-icon><List /></el-icon>
            <span>{{ articleDetail.updatedAt }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ articleDetail.title }}</h1>
        <div class="summary-content" v-if="articleDetail.summary">
          <p>{{ articleDetail.summary }}</p>
        </div>
        <div class="flex-box" style="margin-top: 20px">
          <div class="flex-box item">
            <el-icon><User /></el-icon>
            <span>{{ articleDetail.authorName }}</span>
          </div>
          <div class="flex-box item">
            <el-icon><Platform /></el-icon>
            <span>{{ articleDetail.readCount }}次阅读</span>
          </div>
        </div>
      </div>
      <div class="diary-card">
        <div class="title">文章内容</div>
        <div
          class="content-wrapper"
          v-html="formatContent(articleDetail.content)"
        ></div>
        <div
          class="tags-content"
          v-if="articleDetail.tagArray && articleDetail.tagArray.length"
        >
          <div class="tags-title">相关标签：</div>
          <div class="tags-list">
            <el-tag
              v-for="tag in articleDetail.tagArray"
              :key="tag"
              type="info"
              effect="light"
              >{{ tag }}</el-tag
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getKnowledgeArticleDetail } from "@/api/frontend";
import { useRoute } from "vue-router";
import { Sunny, Moon, List, User, Platform } from "@element-plus/icons-vue";

const route = useRoute();
const iconUrl = new URL("@/assets/images/book.png", import.meta.url).href;

// ==================== 主题切换功能 ====================
const STORAGE_KEY = "article-theme-preference";
const isDarkMode = ref(false);

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    isDarkMode.value = savedTheme === "dark";
  } else {
    // 检测系统主题偏好
    isDarkMode.value = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  }
  applyTheme();
};

// 应用主题
const applyTheme = () => {
  const container = document.querySelector(".articleDetail-container");
  if (container) {
    if (isDarkMode.value) {
      container.classList.add("dark-mode");
    } else {
      container.classList.remove("dark-mode");
    }
  }
};

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem(STORAGE_KEY, isDarkMode.value ? "dark" : "light");
  applyTheme();
};

// ==================== 文章详情功能 ====================
// 文章详情
const articleDetail = ref({});
//文章id
const articleId = ref(route.params.id);

// 获取文章详情
const getArticleDetail = async () => {
  const res = await getKnowledgeArticleDetail(articleId.value);
  if (res) {
    articleDetail.value = res;
  }
};
const formatContent = (content) => {
  if (!content) return "";

  // 基本的HTML清理和格式化
  let formatted = content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");

  return formatted;
};

onMounted(() => {
  // 初始化主题
  initTheme();
  // 初始化时获取文章详情
  getArticleDetail();
});
</script>

<style scoped lang="scss">
// ==================== CSS 变量定义 ====================
.articleDetail-container {
  // 浅色主题变量（默认）
  --bg-primary: #ffffff;
  --bg-secondary: linear-gradient(
    135deg,
    #fafbfc 0%,
    #f7f9fc 50%,
    #f2f6fa 100%
  );
  --bg-card: #ffffff;
  --bg-summary: rgba(126, 211, 33, 0.1);
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  --border-color: #e5e7eb;
  --border-summary: #7ed321;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  --tag-bg: #f3f4f6;
  --tag-text: #374151;

  background: var(--bg-secondary);
  min-height: 100vh;
  transition: background-color 0.3s ease;

  .flex-box {
    display: flex;
    align-items: center;
    .item {
      margin-right: 20px;
      span {
        margin-left: 5px;
      }
    }
  }

  // ==================== 主题切换按钮样式 ====================
  .header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;
    position: relative;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;

      .theme-toggle-btn {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.05);
        }

        .theme-icon {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        &:hover .theme-icon {
          transform: rotate(15deg);
        }

        .theme-text {
          font-weight: 500;
        }
      }
    }
  }
  // ==================== 内容区域样式 ====================
  .content {
    margin: 0 auto;
    width: 980px;
    padding: 20px;
    transition: all 0.3s ease;

    .diary-card {
      margin-bottom: 20px;
      background: var(--bg-card);
      border-radius: 10px;
      padding: 20px;
      box-shadow: var(--shadow);
      transition: all 0.3s ease;

      .title {
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-secondary);
        transition: color 0.3s ease;
      }

      .sub-title {
        margin-top: 20px;
        display: flex;
        align-items: center;
        color: var(--text-tertiary);
        transition: color 0.3s ease;

        .category-tag {
          margin-right: 20px;
        }
      }

      .article-title {
        font-size: 28px;
        font-weight: bold;
        color: var(--text-primary);
        margin-top: 30px;
        margin-bottom: 10px;
        transition: color 0.3s ease;
      }

      .summary-content {
        background: var(--bg-summary);
        border-left: 4px solid var(--border-summary);
        padding: 10px 15px;
        border-radius: 0 8px 8px 0;
        position: relative;
        transition: all 0.3s ease;

        p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
      }

      .content-wrapper {
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.8;
        transition: color 0.3s ease;

        :deep(p) {
          margin-bottom: 10px;
          color: var(--text-secondary);
        }

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
          margin: 15px 0 10px;
          color: var(--text-primary);
          font-weight: 600;
          transition: color 0.3s ease;
        }

        :deep(h2) {
          font-size: 15px;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 5px;
          transition: border-color 0.3s ease;
        }

        :deep(h3) {
          font-size: 13px;
        }

        :deep(ul),
        :deep(ol) {
          padding-left: 15px;
          margin-bottom: 10px;
          color: var(--text-secondary);
        }

        :deep(li) {
          margin-bottom: 5px;
          color: var(--text-secondary);
        }

        :deep(a) {
          color: #fb923c;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            text-decoration: underline;
          }
        }

        :deep(code) {
          background: var(--tag-bg);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 14px;
          color: var(--text-secondary);
        }

        :deep(pre) {
          background: var(--tag-bg);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 15px 0;

          code {
            background: transparent;
            padding: 0;
          }
        }

        :deep(blockquote) {
          border-left: 4px solid var(--border-summary);
          padding-left: 16px;
          margin: 15px 0;
          color: var(--text-tertiary);
          font-style: italic;
        }
      }

      .tags-content {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid var(--border-color);
        transition: border-color 0.3s ease;

        .tags-title {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          :deep(.el-tag) {
            background: var(--tag-bg);
            border-color: var(--border-color);
            color: var(--tag-text);
            transition: all 0.3s ease;

            &:hover {
              background: var(--border-color);
            }
          }
        }
      }
    }
  }

  // ==================== 黑夜模式样式 ====================
  &.dark-mode {
    // 黑夜主题变量
    --bg-primary: #111827;
    --bg-secondary: #0f172a;
    --bg-card: #1f2937;
    --bg-summary: rgba(126, 211, 33, 0.15);
    --text-primary: #f9fafb;
    --text-secondary: #e5e7eb;
    --text-tertiary: #9ca3af;
    --border-color: #374151;
    --border-summary: #65a30d;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    --tag-bg: #374151;
    --tag-text: #e5e7eb;

    // 主题切换按钮在黑夜模式下的样式
    .header-section {
      .theme-toggle-btn {
        background: rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(0, 0, 0, 0.4);
        }
      }
    }

    // 内容区域在黑夜模式下的额外样式
    .content {
      .diary-card {
        .content-wrapper {
          :deep(a) {
            color: #fbbf24;

            &:hover {
              color: #f59e0b;
            }
          }

          :deep(code) {
            background: #374151;
            color: #e5e7eb;
          }

          :deep(pre) {
            background: #111827;
            border: 1px solid #374151;

            code {
              color: #e5e7eb;
            }
          }
        }
      }
    }
  }
}

// ==================== 响应式设计 ====================
@media (max-width: 1024px) {
  .articleDetail-container {
    .content {
      width: 90%;
      padding: 16px;

      .diary-card {
        padding: 16px;

        .article-title {
          font-size: 24px;
        }
      }
    }

    .header-section {
      padding: 32px;

      .header-content {
        .theme-toggle-btn {
          padding: 8px 12px;

          .theme-text {
            display: none;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .articleDetail-container {
    .content {
      width: 100%;
      padding: 12px;

      .diary-card {
        padding: 12px;
        border-radius: 8px;

        .article-title {
          font-size: 20px;
        }

        .title {
          font-size: 18px;
        }

        .content-wrapper {
          font-size: 14px;
        }
      }
    }

    .header-section {
      padding: 24px 16px;

      .header-content {
        h1 {
          font-size: 20px;
        }

        .theme-toggle-btn {
          right: -8px;
        }
      }
    }
  }
}

// ==================== 可访问性增强 ====================
@media (prefers-reduced-motion: reduce) {
  .articleDetail-container,
  .articleDetail-container *,
  .articleDetail-container *::before,
  .articleDetail-container *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 焦点样式（键盘导航）
.theme-toggle-btn:focus-visible {
  outline: 2px solid #fb923c;
  outline-offset: 2px;
}
</style>