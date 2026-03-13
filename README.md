# 🤖 塔塔AI心理助手

<p align="center">
  <img src="public/logo.png" alt="塔塔AI心理助手" width="120">
</p>

<p align="center">
  <strong>基于AI技术的心理健康服务平台</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#贡献指南">贡献指南</a>
</p>

---

## 📖 项目概述

**塔塔AI心理助手**是一款专注于心理健康服务的智能化平台，通过AI技术为用户提供温暖、专业的心理支持。平台采用前后端分离架构，提供实时AI对话、情绪追踪、心理知识库等功能，帮助用户缓解压力、管理情绪、获得心理支持。

### 核心功能

- 🤖 **AI智能对话** - 与AI助手"塔塔"进行温暖对话，获得心理支持和陪伴
- 📊 **情绪追踪** - 记录情绪变化，可视化展示情绪趋势
- 📚 **心理知识库** - 提供专业心理健康知识和文章
- 🎨 **情绪花园** - 直观展示当前情绪状态和风险等级
- 🔊 **语音播报** - AI回复支持语音播报功能（TTS）
- 🌙 **深色模式** - 支持深色主题，保护视力
- 📱 **响应式设计** - 适配桌面端和移动端

---

## 🛠 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue 3** | ^3.5.25 | 渐进式JavaScript框架 |
| **Vue Router 4** | ^4.6.4 | 官方路由管理器 |
| **Pinia** | ^3.0.4 | 状态管理库 |
| **Element Plus** | ^2.13.2 | UI组件库 |
| **Vite** | ^7.3.1 | 构建工具 |
| **Axios** | ^1.13.6 | HTTP客户端 |
| **ECharts** | ^6.0.0 | 数据可视化图表库 |
| **Sass** | ^1.97.2 | CSS预处理器 |
| **WangEditor** | ^5.1.23 | 富文本编辑器 |

### 核心特性

- ⚡ **Vite构建** - 快速的开发服务器和构建速度
- 🎯 **Vue 3组合式API** - 更灵活的代码组织方式
- 📦 **路由懒加载** - 优化首屏加载性能
- 🎨 **主题定制** - 支持自定义主题和深色模式
- 🔍 **智能搜索** - 支持拼音和近义词搜索
- ♿ **无障碍支持** - 符合WCAG可访问性标准

---

## 📋 环境要求

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **现代浏览器**（Chrome、Firefox、Safari、Edge最新版本）

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/ai-psychological-assistant.git
cd ai-psychological-assistant
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置环境

编辑 `src/config/index.js` 配置文件：

```javascript
export const fileBaseURL = "http://your-backend-server:port"
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:5173 查看应用

### 5. 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件位于 `dist/` 目录

---

## 📁 项目结构

```
ai-psychological-assistant/
├── public/                     # 静态资源
│   ├── logo.png               # 项目Logo
│   └── vite.svg               # Vite图标
├── src/
│   ├── api/                   # API接口
│   │   ├── admin.js          # 管理端接口
│   │   └── frontend.js       # 用户端接口
│   ├── assets/               # 资源文件
│   │   ├── images/          # 图片资源
│   │   └── vue.svg
│   ├── components/           # 公共组件
│   │   ├── skeleton/        # 骨架屏组件
│   │   ├── ArticleDialog.vue
│   │   ├── AuthLayout.vue   # 认证布局
│   │   ├── BackendLayout.vue # 后台布局
│   │   ├── FrontendLayout.vue # 前台布局
│   │   ├── MarkdownRenderer.vue
│   │   ├── NavBar.vue
│   │   ├── PageHead.vue
│   │   ├── RichTextEditor.vue
│   │   ├── SideBar.vue
│   │   ├── TableSearch.vue
│   │   └── ThemeToggle.vue  # 主题切换
│   ├── composables/          # 组合式函数
│   │   ├── useSmartSearch.js # 智能搜索
│   │   ├── useTTS.js        # 语音播报
│   │   └── useTheme.js      # 主题管理
│   ├── config/              # 配置文件
│   │   └── index.js         # 基础配置
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── stores/              # Pinia状态管理
│   │   └── adminStore.js
│   ├── styles/              # 样式文件
│   │   └── themes/         # 主题样式
│   ├── utils/               # 工具函数
│   │   └── request.js      # HTTP请求封装
│   ├── views/               # 页面视图
│   │   ├── articleDetail.vue    # 文章详情
│   │   ├── consultation.vue     # AI咨询对话
│   │   ├── consultations.vue    # 咨询记录管理
│   │   ├── dashboard.vue        # 数据分析
│   │   ├── emotionDiary.vue     # 情绪日记
│   │   ├── emotional.vue        # 情绪日志管理
│   │   ├── frontendKnowledge.vue # 知识库
│   │   ├── home.vue            # 首页
│   │   ├── knowledge.vue       # 知识文章管理
│   │   ├── login.vue           # 登录
│   │   └── register.vue        # 注册
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   └── style.css            # 全局样式
├── .gitignore
├── index.html
├── jsconfig.json
├── package.json
├── README.md
└── vite.config.js           # Vite配置
```

---

## 💡 使用说明

### 用户端功能

1. **AI咨询对话**
   - 点击"开始倾诉，获得陪伴"进入对话界面
   - 与AI助手"塔塔"进行文字交流
   - 支持语音播报AI回复内容
   - 查看历史会话记录

2. **情绪日记**
   - 记录每日情绪状态和分数
   - 查看情绪趋势图表
   - 获得个性化建议

3. **心理知识库**
   - 浏览心理健康相关文章
   - 支持智能搜索（拼音、近义词）
   - 切换深色/浅色主题

### 管理端功能

1. **数据分析** - 查看平台数据统计和趋势
2. **知识文章** - 管理心理知识库内容
3. **咨询记录** - 查看用户咨询历史
4. **情绪日志** - 管理用户情绪记录

---

## 🔧 核心功能实现

### 1. 虚拟滚动优化

使用 `vue-virtual-scroller` 实现长列表虚拟滚动，提升性能：

```javascript
import { RecycleScroller } from 'vue-virtual-scroller'

<RecycleScroller
  class="scroller"
  :items="sessionList"
  :item-size="88"
  key-field="id"
>
  <template #default="{ item }">
    <SessionItem :item="item" />
  </template>
</RecycleScroller>
```

### 2. 骨架屏加载

自定义骨架屏组件，提升用户体验：

```vue
<SessionSkeleton v-if="loading" />
<div v-else>
  <!-- 实际内容 -->
</div>
```

### 3. 智能搜索

支持拼音和近义词搜索：

```javascript
import { useSmartSearch } from '@/composables/useSmartSearch'

const { search } = useSmartSearch(articles)
const results = search(keyword)
```

### 4. 语音播报（TTS）

使用 Web Speech API 实现：

```javascript
import { useTTS } from '@/composables/useTTS'

const tts = useTTS()
tts.speak(text, messageId)
```

### 5. 主题切换

支持深色/浅色主题：

```javascript
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
```

---

## 📝 API 文档

### 基础配置

```javascript
// src/config/index.js
export const fileBaseURL = "http://your-backend-server:port"
```

### 请求封装

```javascript
// src/utils/request.js
import request from '@/utils/request'

// GET请求
request.get('/api/articles')

// POST请求
request.post('/api/login', { username, password })
```

---

## 🎨 主题定制

### 修改主题色

编辑 `src/style.css`：

```css
:root {
  --primary-color: #fb923c;
  --primary-light: #f59e0b;
  --primary-dark: #ea580c;
}
```

### 添加新主题

在 `src/styles/themes/` 目录下创建主题文件：

```scss
// custom-theme.scss
[data-theme="custom"] {
  --bg-color: #ffffff;
  --text-color: #333333;
  // ...
}
```

---

## 🔒 注意事项

1. **浏览器兼容性**
   - TTS功能需要浏览器支持 Web Speech API
   - 推荐使用 Chrome、Edge、Safari 最新版本

2. **后端服务**
   - 需要配置正确的后端API地址
   - 确保后端服务正常运行

3. **安全性**
   - 生产环境需要配置HTTPS
   - 注意保护用户隐私数据

4. **性能优化**
   - 长列表使用虚拟滚动
   - 图片懒加载
   - 路由懒加载

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 提交规范

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建/工具相关

### 开发流程

1. Fork 项目
2. 创建分支 (`git checkout -b feat/xxx`)
3. 提交更改 (`git commit -m 'feat: add xxx'`)
4. 推送分支 (`git push origin feat/xxx`)
5. 创建 Pull Request

---

## 📄 许可证

[MIT](LICENSE) © 2024 塔塔AI心理助手

---

## 📞 联系我们

- **项目主页**: [https://github.com/yourusername/ai-psychological-assistant](https://github.com/yourusername/ai-psychological-assistant)
- **问题反馈**: [Issues](https://github.com/yourusername/ai-psychological-assistant/issues)
- **邮箱**: contact@example.com

---

<p align="center">
  用 ❤️ 和 🤖 构建
</p>
