import { service } from "@/utils/request";

// 注册用户请求
export const register = (data) => {
  return service({
    url: '/user/add',
    method: 'post',
    data,
  });
}