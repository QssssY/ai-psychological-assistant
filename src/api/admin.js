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

export function deleteArticle(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'delete',
  })
}
