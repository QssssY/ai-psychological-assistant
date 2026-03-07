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
        <div
          v-for="item in articleList"
          :key="item.id"
          class="article-item"
          @click="handleClickGoDetail(item.id)"
        >
          <el-image
            :src="getImageUrl(item.coverImage)"
            alt="文章封面"
            style="width: 240px; height: 150px"
          />
          <div class="info">
            <h3 class="title">
              {{ item.title }}
              <el-tag type="primary" plain>{{ item.categoryName }}</el-tag>
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
                <span>{{ dayjs(item.publishedAt).format("YYYY-MM-DD") }}</span>
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

const iconUrl = new URL("@/assets/images/book.png", import.meta.url).href;
// 推荐文章列表
const recommendList = ref([]);
// 文章列表
const articleList = ref([]);
// 分页信息
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0,
});
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
  const params = {
    sortField: "publishedAt",
    sortDirection: "desc",
    ...pagination,
  };
  const res = await getKnowledgeArticlePage(params);
  if (res) {
    articleList.value = res.records;
    pagination.total = res.total;
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
  background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
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
    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 400px;
      .section-title {
        font-size: 12;
        font-weight: 600;
        color: #374151;
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
          border-left: 4px solid #f59e0b;
          padding-left: 10px;
          cursor: pointer;
          .read-count {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 10px;
          }
        }
      }
    }
    .article-list {
      flex: 1;
      .article-item {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        cursor: pointer;
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
