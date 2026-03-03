import { service } from "@/utils/request";

// 登录请求
export const login = (data) => {
  return service({
    url: '/user/login',
    method: 'post',
    data,
  });
}

// 获取情感知识分类树
export const getCategoryTree = () => {
  return service({
    url: '/knowledge/category/tree',
    method: 'get',
  });
}

// 获取情感知识列表
export const getKnowledgeList = (params) => {
  return service({
    url: '/knowledge/article/page',
    method: 'get',
    params,
  });
}

// 上传文件
export const uploadFile = (file, businessInfo) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return service({
    url: '/file/upload',
    method: 'post',
    data: formData,
  })
}

//新增情感文章
export const createArticle = (data) => {
  return service({
    url: '/knowledge/article',
    method: 'post',
    data,
  })
}

// 获取情感文章详情
export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

// 更新情感文章
export function updateArticle(id, data) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'put',
    data,
  })
}

// 改变情感文章状态
export function changeArticleStatus(id, data) {
  return service({
    url: `/knowledge/article/${id}/status`,
    method: 'put',
    data
  })
}

// 删除情感文章
export function deleteArticle(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'delete',
  })
}

// 获取咨询记录列表
export function getConsultationList(params) {
  return service({
    url: '/psychological-chat/sessions',
    method: 'get',
    params,
  })
}

// 获取咨询记录详情
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 获取情感日志列表
export function getEmotionalLogList(params) {
  return service({
    url: '/emotion-diary/admin/page',
    method: 'get',
    params,
  })
}
// 删除情绪日志
export function deleteEmotionalLog(id) {
  return service({
    url: `/emotion-diary/admin/${id}`,
    method: 'delete',
  })
}

// 获取数据分析概览
export function getDataAnalyticsOverview() {
  return service({
    url: '/data-analytics/overview',
    method: 'get',
  })
}