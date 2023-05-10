import axios from 'axios'
import { ElMessage } from 'element-plus'

// 显示中的错误提示: {'Please login first': true}
// 防止错误信息的重复显示，同一个错误信息显示2500ms后自动清除
const errMsgData = {}
class HttpRequest {
  constructor() {
    this.queue = {}
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.queue[url] = true
      return config
    })
    // 响应拦截

    instance.interceptors.response.use(
      res => {
        // 可以在定义接口时增加showError=false来不让自动显示错误信息
        const showError = res.config.showError || res.config.showError == null
        const data = res.data
        // this.destroy(url)

        if (data.code === 200) {
          return data
        } else {
          if (showError) this.showError(`${data.msg}`)
          return Promise.reject(data)
        }
      },
      error => {
        // 添加调试信息

        const res = { code: 408, data: {}, msg: 'error' }
        return Promise.reject(res)
      }
    )
  }

  /**
   * 显示错误信息，防止相同的错误信息重复显示，2.5秒后自动清除，清除后相同的错误信息会再次显示
   * @param {*} errMsg
   */
  showError(errMsg) {
    if (!errMsgData[errMsg]) {
      ElMessage.error({
        message: errMsg,
        duration: 3000,
      })
      errMsgData[errMsg] = true
      setTimeout(() => {
        delete errMsgData[errMsg]
      }, 2500)
    }
  }

  request(options) {
    const instance = axios.create()

    if (options.headers) {
      config.headers = Object.assign({}, options.headers)
      delete options.headers
    }
    options = Object.assign({}, options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
