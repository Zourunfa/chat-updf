import Http from '@/libs/https/request'

export const fetchTranslate = data => {
  // 创建企业
  let url = '/api/v1/chat/translate'

  return Http.request({
    url,
    data,
    method: 'post',
  })
}

export const fetchTalk = data => {
  // 创建企业
  let url = '/api/v1/chat/talk'

  return Http.request({
    url,
    data,
    method: 'post',
  })
}
export const getInviteUrl = () => {
  // 生成邀请链接
  return Http.request({
    url: '/v1/company/generateInviteUrl',
    method: 'get',
  })
}
