<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component
              v-model="formData[item.prop]"
              :is="isComp(item.comp)"
              :placeholder="item.placeholder"
            >
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value="" />
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["search"]);

// 表单数据
const formData = reactive({});
const ruleFormRef = ref();

const formItemAttrs = computed(() => {
  return props.formItem.map((item) => ({
    ...item,
    col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 },
  }));
});

//传递查询参数
const handleSearch = () => {
  emit("search", formData);
};

const handleReset = (formRef) => {
  if (!formRef) {
    return;
  }
  // 重置表单
  formRef.resetFields();

  // 立即查询（显示所有数据）
  emit("search", formData);
};

const isComp = (comp) => {
  return {
    input: "el-input",
    select: "el-select",
  }[comp];
};
</script>
