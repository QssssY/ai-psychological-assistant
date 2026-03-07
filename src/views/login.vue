<template>
  <div class="container">
    <div class="title">
      <div class="back-home" @click="toHome">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn"
            type="primary"
            size="large"
            @click="submitLogin(ruleFormRef)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="footer">
        <p>
          还没有账户？
          <router-link to="/auth/register">去注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { login } from "@/api/admin.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const ruleFormRef = ref();
// 登录表单数据
const formData = reactive({
  username: "",
  password: "",
});
const rules = reactive({
  username: [
    { required: true, message: "请输入用户名或邮箱", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
// 跳转到首页
const toHome = () => {
  router.push("/");
};
// 登录处理函数
const submitLogin = async (formRef) => {
  if (!formRef) {
    return;
  }
  // 校验表单
  await formRef.validate((valid, fields) => {
    if (valid) {
      login(formData).then((data) => {
        //判断token是否存在
        if (!data.token) {
          ElMessage.error(data.data.msg || "用户名或密码错误");
          return;
        }
        // 登录成功，将token存储到localStorage
        localStorage.setItem("token", data.token);
        // 登录成功，将用户信息存储到localStorage
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
        ElMessage.success("登录成功");
        //根据不同的用户角色类型，跳转到不同的页面
        if (data.userInfo.userType === 2) {
          // 管理员用户，跳转到后台管理系统
          router.push("/back/dashboard");
        } else {
          // 普通用户，跳转到用户中心
          router.push("/");
        }
      });
    } else {
      ElMessage.error("请填写用户名和密码");
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
      cursor: pointer;
    }
    .title-text {
      text-align: center;
      margin-bottom: 20px;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>