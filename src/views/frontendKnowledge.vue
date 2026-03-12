<template>
  <div class="knowledge-container">
    <div class="header-section">
      <div class="header-content">
        <el-image
          :src="iconUrl"
          alt="知识库图标"
          style="width: 60px; height: 60px"
        />
        <h1>心理健康知识库</h1>
        <!-- 主题切换按钮 -->
        <ThemeToggle class="theme-toggle" />
      </div>
    </div>
    <div class="content">
      <!-- 左侧菜单 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
        <div class="recommend-list">
          <div
            v-for="item in recommendList"
            :key="item.id"
            class="recommend-item"
            @click="handleClickGoDetail(item.id)"
          >
            <h4>{{ item.title }}</h4>
            <p class="read-count">
              <el-icon>
                <Histogram />
              </el-icon>
              阅读量 {{ item.readCount }}
            </p>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="article-list">
        <!-- 智能搜索框 -->
        <div class="smart-search-wrapper">
          <el-input
            :model-value="searchInput"
            @update:model-value="handleSearchInput"
            placeholder="搜索文章标题或内容，支持拼音（如：jiaolv）..."
            clearable
            @focus="showSuggestions = true"
            @blur="handleBlur"
            class="smart-search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <!-- 搜索建议下拉框 -->
          <div
            v-show="showSuggestions && filteredArticles.length > 0"
            class="search-suggestions"
          >
            <div
              v-for="item in filteredArticles.slice(0, 6)"
              :key="item.id"
              class="suggestion-item"
              @mousedown="handleSuggestionClick(item)"
            >
              <div class="suggestion-title">
                {{ highlightText(item.title) }}
              </div>
              <div class="suggestion-meta">
                <span>{{ item.categoryName }}</span>
                <span>阅读量 {{ item.readCount }}</span>
              </div>
            </div>
          </div>
          <!-- 搜索统计 -->
          <div v-if="searchInput && !showSuggestions" class="search-stats">
            找到 {{ filteredArticles.length }} 篇相关文章
          </div>
        </div>
        <!-- 骨架屏加载状态 -->
        <ArticleSkeleton v-if="loading" :count="6" />
        <!-- 虚拟滚动列表 -->
        <DynamicScroller
          v-else
          :items="articleList"
          :min-item-size="200"
          key-field="id"
          class="article-scroller"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
            >
              <div class="article-item" @click="handleClickGoDetail(item.id)">
                <div class="image-wrapper">
                  <img
                    v-lazy="getImageUrl(item.coverImage)"
                    :src="getImageUrl(item.coverImage)"
                    alt="文章封面"
                    class="article-cover"
                    :data-id="item.id"
                  />
                  <div class="image-placeholder" v-if="!imageLoaded[item.id]">
                    <el-icon><Picture /></el-icon>
                  </div>
                </div>
                <div class="info">
                  <h3 class="title">
                    {{ item.title }}
                    <el-tag type="primary" plain>{{
                      item.categoryName
                    }}</el-tag>
                  </h3>
                  <div style="margin-top: 10px">
                    <div class="flex-box">
                      <el-icon>
                        <Avatar />
                      </el-icon>
                      <span>{{ item.authorName }}</span>
                    </div>
                    <div class="flex-box">
                      <el-icon>
                        <Clock />
                      </el-icon>
                      <span>{{
                        dayjs(item.publishedAt).format("YYYY-MM-DD")
                      }}</span>
                    </div>
                  </div>
                  <div style="margin-top: 25px">
                    <div class="flex-box">
                      <el-icon>
                        <Platform />
                      </el-icon>
                      <span>阅读量：{{ item.readCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-wrapper">
      <el-pagination
        style="margin-top: 20px"
        layout="total,prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="pagination.size"
        :current-page="pagination.currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { getKnowledgeArticlePage } from "@/api/frontend";
import { fileBaseURL } from "@/config";
import { dayjs } from "element-plus";
import router from "@/router";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import ArticleSkeleton from "@/components/skeleton/ArticleSkeleton.vue";
import { useSmartSearch } from "@/composables/useSmartSearch";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { useTheme } from "@/composables/useTheme";
import {
  Picture,
  Avatar,
  Clock,
  Platform,
  Search,
  Histogram,
} from "@element-plus/icons-vue";

// 初始化主题
const { appliedTheme } = useTheme();

const iconUrl = new URL("@/assets/images/book.png", import.meta.url).href;
// 推荐文章列表
const recommendList = ref([]);
// 文章列表
const articleList = ref([]);
// 加载状态
const loading = ref(true);
// 图片加载状态
const imageLoaded = reactive({});
// 分页信息
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});

// ========== 使用智能搜索组合式函数 ==========
const {
  searchQuery: searchInput,
  suggestions: filteredArticles,
  isSearching: showSuggestions,
  debouncedSearch: handleSearchInput,
  highlightText,
} = useSmartSearch(articleList, {
  searchKeys: ["title", "content", "categoryName"],
  debounceMs: 200,
  maxSuggestions: 8,
});

// 处理失去焦点
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

// 处理建议点击
const handleSuggestionClick = (item) => {
  handleClickGoDetail(item.id);
  showSuggestions.value = false;
};

// 高亮搜索文本
// 图片懒加载指令
const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.src = binding.value;
            el.onload = () => {
              const id = el.dataset.id;
              if (id) imageLoaded[id] = true;
            };
            observer.unobserve(el);
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );
    observer.observe(el);
  },
};
// 分页改变处理函数
const handlePageChange = (page) => {
  pagination.currentPage = page;
  // 调用获取文章列表函数
  getArticleList();
};
// 每页条数改变处理函数
const handleSizeChange = (size) => {
  pagination.size = size;
  // 调用获取文章列表函数
  getArticleList();
};

// 处理图片路径
const getImageUrl = (imagePath) => {
  // 如果图片路径为空，返回默认图片
  if (!imagePath) {
    //默认知识库封面图
    return "https://file.itndedu.com/psychology_ai.png";
  }
  return `${fileBaseURL}${imagePath}`;
};

// 点击文章跳转详情页
const handleClickGoDetail = (id) => {
  // 跳转到文章详情页
  router.push({
    path: `/knowledge/article/${id}`,
  });
};

// 获取文章列表
const getArticleList = async () => {
  loading.value = true;
  try {
    const params = {
      sortField: "publishedAt",
      sortDirection: "desc",
      ...pagination,
    };
    const res = await getKnowledgeArticlePage(params);
    if (res) {
      articleList.value = res.records;
      pagination.total = res.total;
      // 初始化图片加载状态
      articleList.value.forEach((item) => {
        imageLoaded[item.id] = false;
      });
    }
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
};

// 获取推荐文章列表
const getRecommendList = async () => {
  const params = {
    sortField: "readCount",
    sortDirection: "desc",
    currentPage: 1,
    size: 5,
  };
  const res = await getKnowledgeArticlePage(params);
  if (res) {
    recommendList.value = res.records;
  }
};

onMounted(() => {
  // 初始化时获取推荐文章列表
  getRecommendList();
  // 初始化时获取文章列表
  getArticleList();
});
</script>

<style scoped lang="scss">
.knowledge-container {
  background: var(--bg-secondary);
  min-height: 100vh;
  transition: background-color 0.3s ease;

  .flex-box {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }

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

      .theme-toggle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .content {
    display: flex;
    gap: 20px;
    margin: 0 auto;
    width: 1200px;
    padding: 20px;
    .recommend-section {
      width: 280px;
      background: var(--bg-card);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      padding: 15px;
      height: 400px;
      transition: all 0.3s ease;

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .recommend-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .recommend-item {
          border-left: 4px solid var(--primary-color);
          padding-left: 10px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: var(--bg-hover);
            border-radius: 0 8px 8px 0;
          }

          h4 {
            color: var(--text-primary);
            font-size: 14px;
            line-height: 1.4;
          }

          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
    .article-list {
      flex: 1;

      // 智能搜索样式
      .smart-search-wrapper {
        position: relative;
        margin-bottom: 20px;

        .smart-search-input {
          :deep(.el-input__wrapper) {
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            padding: 8px 16px;
          }
          :deep(.el-input__inner) {
            font-size: 14px;
            height: 44px;
          }
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          margin-top: 8px;
          z-index: 100;
          max-height: 400px;
          overflow-y: auto;

          .suggestion-item {
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: all 0.2s;

            &:hover {
              background: #f9fafb;
            }

            &:last-child {
              border-bottom: none;
            }

            .suggestion-title {
              font-size: 14px;
              font-weight: 500;
              color: #1f2937;
              margin-bottom: 4px;

              :deep(mark) {
                background: #fef3c7;
                color: #92400e;
                padding: 0 2px;
                border-radius: 2px;
              }
            }

            .suggestion-meta {
              font-size: 12px;
              color: #6b7280;
              display: flex;
              gap: 12px;
            }
          }
        }

        .search-stats {
          margin-top: 8px;
          font-size: 13px;
          color: #6b7280;
          padding-left: 8px;
        }
      }

      .article-scroller {
        height: calc(100vh - 380px);
      }

      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        cursor: pointer;

        .image-wrapper {
          position: relative;
          width: 240px;
          height: 150px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .article-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .article-cover[src] {
          opacity: 1;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          color: #999;
          font-size: 32px;
        }

        .info {
          margin-left: 20px;
          .title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
  }
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>
