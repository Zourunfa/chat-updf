import HttpRequest from './axios'

// 使用方式
// import Http from '@/libs/http/request'
// export const getEmailCaptcha = data => { // 发送邮箱验证码
//   return Http.request({
//     url: '/v1/user/emailCaptcha',
//     data,
//     showError: false, // 设置为false遇到错误时就不会自动显示错误信息了
//     method: 'post'
//   })
// }

export default new HttpRequest()
