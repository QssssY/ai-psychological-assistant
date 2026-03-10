import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

// 登录/注册页保持同步加载（首屏必需）
import login from '@/views/login.vue'
import register from '@/views/register.vue'

// ============================================================
// 路由懒加载配置
// 使用动态 import() 实现代码分割，减少首屏加载体积
// 登录/注册页除外（首屏必需，快速展示）
// ============================================================

// 后台页面组件 - 懒加载
const Dashboard = () => import('@/views/dashboard.vue')
const knowledge = () => import('@/views/knowledge.vue')
const consultations = () => import('@/views/consultations.vue')
const emotional = () => import('@/views/emotional.vue')

// 前台页面组件 - 懒加载
const home = () => import('@/views/home.vue')
const consultation = () => import('@/views/consultation.vue')
const emotionDiary = () => import('@/views/emotionDiary.vue')
const frontendKnowledge = () => import('@/views/frontendKnowledge.vue')
const articleDetail = () => import('@/views/articleDetail.vue')

// 后台路由配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        }
      },
      {
        path: 'knowledge',
        component: knowledge,
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        }
      },
      {
        path: 'consultations',
        component: consultations,
        meta: {
          title: '咨询记录',
          icon: 'ChatDotRound',
        }
      },
      {
        path: 'emotional',
        component: emotional,
        meta: {
          title: '情绪日志',
          icon: 'User',
        }
      },
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: login,
        meta: {
          title: '登录',
          icon: 'Login',
        }
      },
      {
        path: 'register',
        component: register,
        meta: {
          title: '注册',
          icon: 'Register',
        }
      },
    ]
  }
]

// 前台路由配置
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: home,
      },
      {
        path: 'consultation',
        component: consultation,
      },
      {
        path: 'emotion-diary',
        component: emotionDiary,
      },
      {
        path: 'knowledge',
        component: frontendKnowledge,
      },
      {
        path: 'knowledge/article/:id',
        component: articleDetail,
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")
  //判断用户是否登录
  if (token) {
    //用户登录后根据用户类型判断是否跳转到对应页面
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    //用户类型为2（管理员）则跳转到后台路由
    if (userInfo.userType === 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/dashboard");
      }
    } else if (userInfo.userType === 1) {
      //用户端账号只能访问前台路由
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/");
      } else {
        next();
      }
    }
  } else {
    //用户未登录则判断是否访问后台路由
    if (to.path.startsWith("/back")) {
      //如果访问后台路由则跳转到登录页
      next("/auth/login");
    } else {
      next();
    }
  }
});

export default router