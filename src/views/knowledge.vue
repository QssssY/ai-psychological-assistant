<template>
  <div>
    <PageHead title="情感知识">
      <template #btns>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 25px"
      v-loading="loading"
    >
      <el-table-column label="文章标题" fixed="left" width="400">
        <template #default="scope">
          <div class="el-table-column-style">
            <el-icon><timer /></el-icon>
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div class="el-table-column-style">
            <el-icon><timer /></el-icon>
            {{ categoryMap[scope.row.categoryId] || "未分类" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="authorName" width="150" />
      <el-table-column label="阅读量" prop="readCount" width="150" />
      <el-table-column label="发布时间" prop="updatedAt" width="150" />
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="scope">
          <div class="el-table-column-style">
            <el-button type="primary" text @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 2"
              type="success"
              @click="handlePublish(scope.row)"
              text
              >发布</el-button
            >
            <el-button
              v-if="scope.row.status === 1"
              type="warning"
              text
              @click="handleOffline(scope.row)"
              >下线</el-button
            >
            <el-button
              type="danger"
              text
              @click="handleDeleteArticle(scope.row)"
              >删除</el-button
            >
          </div>
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
    <ArticleDialog
      :article="currentArticle"
      v-model:modelValue="dialogVisible"
      :categories="categories"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import PageHead from "@/components/PageHead.vue";
import TableSearch from "@/components/TableSearch.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getCategoryTree,
  getKnowledgeList,
  getArticleDetail,
  changeArticleStatus,
  deleteArticle,
} from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";

//分类映射
const categoryMap = reactive({});
//分类列表
const categories = ref([]);
//情感知识列表
const tableData = ref([]);
//弹窗是否显示
const dialogVisible = ref(false);
//加载状态
const loading = ref(false);
//分页信息
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});

const formItem = reactive([
  {
    comp: "input",
    label: "文章标题",
    prop: "title",
    placeholder: "请输入文章标题",
  },
  {
    comp: "select",
    label: "文章类型",
    prop: "categoryId",
    placeholder: "请选择文章类型",
  },
  {
    comp: "select",
    label: "文章状态",
    prop: "status",
    placeholder: "请选择文章状态",
    options: [
      {
        label: "草稿",
        value: 0,
      },
      {
        label: "已发布",
        value: 1,
      },
      {
        label: "已下线",
        value: 2,
      },
    ],
  },
]);

// 分页改变处理函数
const handlePageChange = (page) => {
  pagination.currentPage = page;
  handleSearch({});
};

// 获取情感知识分类树
const getCategory = async () => {
  const res = await getCategoryTree();

  categories.value = res.map((item) => {
    //通过id映射分类名称
    categoryMap[item.id] = item.categoryName;
    //返回分类对象
    return {
      label: item.categoryName,
      value: item.id,
    };
  });
  //设置文章类型的选项
  formItem[1].options = categories.value;
};

//获取情感知识列表
const handleSearch = async (formData) => {
  loading.value = true;
  try {
    //请求参数
    const params = {
      ...formData,
      ...pagination,
    };
    const { records, total } = await getKnowledgeList(params);
    tableData.value = records || [];
    pagination.total = total || 0;
  } finally {
    loading.value = false;
  }
};

// 当前编辑的文章
const currentArticle = ref(null);
// 编辑情感文章
const handleEdit = async (row) => {
  if (!row.id) {
    // 打开弹窗
    dialogVisible.value = true;
    // 清空当前文章
    currentArticle.value = null;
  } else {
    const res = await getArticleDetail(row.id);
    currentArticle.value = res;
    dialogVisible.value = true;
  }
};

// 弹窗提交成功处理函数
const handleSuccess = () => {
  // 关闭弹窗
  dialogVisible.value = false;
  // 刷新情感知识列表
  handleSearch();
};

// 发布情感文章
const handlePublish = (row) => {
  // 确认发布
  ElMessageBox.confirm(`确定发布文章“${row.title}”吗？`, "确认发布", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 发布文章
    changeArticleStatus(row.id, { status: 1 }).then(() => {
      ElMessage.success("发布成功");
      // 刷新情感知识列表
      handleSearch();
    });
  });
};

// 下线情感文章
const handleOffline = (row) => {
  // 确认下线
  ElMessageBox.confirm(`确定下线文章“${row.title}”吗？`, "确认下线", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 下线文章
    changeArticleStatus(row.id, { status: 2 }).then(() => {
      ElMessage.success("下线成功");
      // 刷新情感知识列表
      handleSearch();
    });
  });
};

const handleDeleteArticle = (row) => {
  // 确认删除
  ElMessageBox.confirm(`确定删除文章“${row.title}”吗？`, "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(async () => {
    // 删除文章
    deleteArticle(row.id).then((res) => {
      ElMessage.success("删除成功");
      // 刷新情感知识列表
      handleSearch();
    });
  });
};

onMounted(() => {
  //获取分类树
  getCategory();
  //获取情感知识列表
  handleSearch({});
});
</script>

<style lang="scss" scoped>
.el-table-column-style {
  display: flex;
  align-items: center;
}
</style>