<template>
  <div class="home-container">
    <div class="content">
      <div class="text">
        <h2 class="title">
          一次温暖的对话
          <br />
          <span class="highlight-text"> 化孤独为慰藉 </span>
        </h2>
        <p class="description">
          不刻意找话，你说的我都认真听、慢慢懂，那些细碎情绪有人接住，不催不扰，平淡日子里，我陪你好好唠嗑
        </p>
        <div class="hero-actions">
          <el-button size="large"> 开始倾述，获得陪伴 </el-button>
          <el-button size="large" class="record-btn">
            记录心情，释放情感
          </el-button>
        </div>
      </div>
      <div class="robot">
        <el-image :src="logoUrl" alt="我是机器人" />
      </div>
    </div>
  </div>
</template>

<script setup>
const logoUrl = new URL("@/assets/images/robot-fill.png", import.meta.url).href;
</script>

<style scoped lang="scss">
.home-container {
  background: linear-gradient(
      90deg,
      rgb(74, 156, 140) 0%,
      rgb(61, 138, 122) 100%
    )
    rgba(74, 156, 140, 0.95);
  color: white;
  padding: 5rem 0;
  height: calc(100vh - 285px);
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    .text {
      width: 500px;
      .title {
        font-size: 45px;
        font-weight: bold;
        // line-height: 1.2;
        margin-bottom: 15px;
        .highlight-text {
          color: #ffd700;
        }
      }
      .hero-actions {
        margin-top: 30px;
        .record-btn {
          border-color: #fff;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
          &:hover {
            background-color: rgba(255, 255, 255, 0.3);
            border-color: #fff;
            color: #fff;
          }
        }
      }
    }
    .robot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
