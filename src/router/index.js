import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import Dashboard from '@/views/dashboard.vue'
import knowledge from '@/views/knowledge.vue'
import consultations from '@/views/consultations.vue'
import emotional from '@/views/emotional.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import login from '@/views/login.vue'
import register from '@/views/register.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'
import home from '@/views/home.vue'
import consultation from '@/views/consultation.vue'
import emotionDiary from '@/views/emotionDiary.vue'
import frontendKnowledge from '@/views/frontendKnowledge.vue'



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
