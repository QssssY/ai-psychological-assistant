import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import Dashboard from '@/views/dashboard.vue'
import knowledge from '@/views/knowledge.vue'
import consultations from '@/views/consultations.vue'
import emotional from '@/views/emotional.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import login from '@/views/login.vue'
import register from '@/views/register.vue'



// 后台路由配置
const backendRoutes = [
  {
    path: '/back',
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

export default createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})
