import { service } from "@/utils/request";

// 注册用户请求
export const register = (data) => {
  return service({
    url: '/user/add',
    method: 'post',
    data,
  });
}

// 创建新会话
export const startSession = (data) => {
  return service({
    url: '/psychological-chat/session/start',
    method: 'post',
    data,
  });
}

// 获取历史会话列表
export function getSessionList(params) {
  return service.get('/psychological-chat/sessions', { params })
}

// 删除会话
export function deleteSession(sessionId) {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 获取会话详情
export function getSessionDetail(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 获取会话情绪分析
export function getSessionEmotionAnalysis(sessionId) {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 提交情绪日志
export function submitEmotionDiary(data) {
  return service({
    url: '/emotion-diary',
    method: 'post',
    data,
  });
}

export function getKnowledgeArticlePage(params) {
  return service.get('/knowledge/article/page', { params })
}