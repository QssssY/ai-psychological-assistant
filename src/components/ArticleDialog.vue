<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '新增文章'"
    v-model="visible"
    width="50%"
    @close="closeDialog"
  >
    <el-form :model="formData" ref="formRef" label-width="120px" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入文章标题"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select
          v-model="formData.categoryId"
          placeholder="请选择文章分类"
          clearable
        >
          <el-option
            v-for="item in props.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          type="textarea"
          placeholder="请输入文章摘要(可选)"
          show-word-limit
          maxlength="1000"
          :rows="5"
          clearable
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请选择文章标签(逗号分隔)"
          multiple
          allow-create
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            :show-file-list="false"
          >
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>上传封面</p>
            </div>
            <img v-else :src="imgUrl" alt="封面图片" class="cover-image" />
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" size="small" @click="handleRemove"
              >移除封面</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、下划线等格式来格式化文本"
          :maxCharCount="5000"
          min-height="400px"
          @change="handleContentChange"
          @created="handleContentCreated"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <p>内容预览：</p>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{
        btnPreview ? "隐藏预览" : "预览效果"
      }}</el-button>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{
        isEdit ? "更新文章" : "新增文章"
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { computed, reactive, ref, nextTick, watch } from "vue";
import { uploadFile, createArticle } from "@/api/admin";
import { fileBaseURL } from "@/config/index.js";
import RichTextEditor from "@/components/RichTextEditor.vue";

// 封面图片URL
const imgUrl = ref("");
// 预览按钮是否显示
const btnPreview = ref(false);
// 提交按钮是否加载中
const loading = ref(false);
// 是否为编辑模式
const isEdit = computed(() => !!props.article?.id);
// 定义表单数据
const formData = reactive({
  title: "",
  content: "",
  coverImage: "",
  categoryId: 1,
  summary: "",
  tags: "",
  id: "",
});

// 定义常用标签
const commonTags = [
  "情绪管理",
  "焦虑",
  "抑郁",
  "压力",
  "睡眠",

  "冥想",
  "正念",
  "放松",
  "心理健康",
  "自我成长",

  "人际关系",
  "工作压力",
  "学习方法",
  "生活技巧",
];

// 定义表单校验规则
const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    { max: 200, message: "标题长度不能超过200个字符", trigger: "blur" },
  ],
  categoryId: [
    { required: true, message: "请选择文章分类", trigger: "change" },
  ],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { max: 5000, message: "内容长度不能超过5000个字符", trigger: "blur" },
  ],
});
// 定义props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  article: {
    type: Object,
    default: null,
  },
});
// 定义事件，用于关闭弹窗
const emit = defineEmits(["update:modelValue", "success"]);
// 定义计算属性，用于监听弹窗是否显示
const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// 取消和关闭
const closeDialog = () => {
  // 重置表单数据
  formRef.value.resetFields();
  //重置id
  businessId.value = null;
  //重置标签
  formData.tagArray = [];
  // 重置封面图片URL和数据
  handleRemove();
  emit("update:modelValue", false);
};

// 对上传封面图片的文件进行校验
const beforeUpload = (file) => {
  //检验文件类型是否为图片
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("上传封面图片必须为图片文件");
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error("上传封面图片大小不能超过5MB");
    return false;
  }
  return true;
};

// 移除封面图片
const handleRemove = () => {
  imgUrl.value = "";
  formData.coverImage = "";
};

// 监听文章数据变化，更新表单数据,数据回显
watch(
  () => props.article,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        Object.assign(formData, newVal);
        // 使用现有业务ID
        businessId.value = newVal.id;
        // 回显封面图片URL
        imgUrl.value = fileBaseURL + newVal.coverImage;
      });
    }
  }
);

// 业务ID
const businessId = ref(null);
// 上传封面图片的请求处理函数
const handleUploadRequest = async ({ file }) => {
  // 处理上传请求，将文件上传到服务器
  // 生成随机的业务ID
  businessId.value = crypto.randomUUID();

  const res = await uploadFile(file, {
    businessId: businessId.value,
  });
  // 上传成功后，将文件路径赋值给formData.coverImage
  imgUrl.value = fileBaseURL + res.filePath;
  formData.coverImage = res.filePath;
};

// 处理富文章内容变化
const handleContentChange = (content) => {
  formData.content = content.html;
};

const editorInstance = ref(null);
// 处理富文章内容创建
const handleContentCreated = (editor) => {
  editorInstance.value = editor;
  // 编辑功能：如果存在已有内容，则回显到编辑器中
  if (formData.content && editor) {
    nextTick(() => {
      // 将已有内容设置到编辑器中
      editor.setHtml(formData.content);
    });
  }
};

const formRef = ref();
// 提交表单
const handleSubmit = () => {
  // 校验表单数据
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const submitData = {
        ...formData,
        tags: formData.tagArray.join(","),
      };
      delete submitData.tagArray;
      //提交表单数据
      createArticle(submitData).then((res) => {
        loading.value = false;
        ElMessage.success("文章发布成功");
        // 触发成功事件
        emit("success");
      });
    } else {
      ElMessage.error("请填写完整的文章信息");
    }
  });
};
</script>

<style scoped lang="scss">
.cover-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 120px;
  color: #8b949e;
  background-color: #f6f8fa;
  cursor: pointer;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>