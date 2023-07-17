---
title: webSocket分装
date: 2023-07-17 09:24:52
permalink: /pages/6e64e1b8ebb63/
categories:
  - 前端技术
tags:
  - webSocket
---
<!--
 * @Author: LYM
 * @Date: 2023-07-17 09:24:52
 * @LastEditors: LYM
 * @LastEditTime: 2023-07-17 10:28:21
 * @Description: Please set Description
-->
# WebSocket 应用

## websocket API

[WebSocket API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket "WebSocket API")

### websocket分装

```ts
import { Message } from 'element-ui'

export type Callback = (e: Event) => void
export type MessageCallback<RT> = (e: RT) => void

interface IOptions<RT> {
  url: string | null // 链接的通道的地址
  heartTime?: number // 心跳时间间隔
  heartMsg?: string // 心跳信息,默认为'ping'
  isReconnect?: boolean // 是否自动重连
  isRestory?: boolean // 是否销毁
  reconnectTime?: number // 重连时间间隔
  reconnectCount?: number // 重连次数 -1 则不限制
  openCb?: Callback // 连接成功的回调
  closeCb?: Callback // 关闭的回调
  messageCb?: MessageCallback<RT> // 消息的回调
  errorCb?: Callback // 错误的回调
}

/**
 * 心跳基类
 */

export class Heart {
  heartTimeOut!: number // 心跳计时器
  ServerHeartTimeOut!: number // 心跳计时器
  timeout = 5000
  // 重置
  reset(): void {
    clearTimeout(this.heartTimeOut)
    clearTimeout(this.ServerHeartTimeOut)
  }

  /**
   * 启动心跳
   * @param {Function} cb 回调函数
   */
  start(cb: Callback): void {
    this.heartTimeOut = setTimeout((e: Event) => {
      cb(e)
      this.ServerHeartTimeOut = setTimeout((e: Event) => {
        cb(e)
        // 重新开始检测
        this.reset()
        this.start(cb)
      }, this.timeout)
    }, this.timeout)
  }
}

export default class Socket<T, RT> extends Heart {
  ws!: WebSocket

  reconnectTimer = 0 // 重连计时器
  reconnectCount = 10 // 变量保存，防止丢失

  options: IOptions<RT> = {
    url: null, // 链接的通道的地址
    heartTime: 5000, // 心跳时间间隔
    heartMsg: 'ping', // 心跳信息,默认为'ping'
    isReconnect: true, // 是否自动重连
    isRestory: false, // 是否销毁
    reconnectTime: 5000, // 重连时间间隔
    reconnectCount: 5, // 重连次数 -1 则不限制
    openCb: (e: Event) => {
      console.log('连接成功的默认回调::::', e)
    }, // 连接成功的回调
    closeCb: (e: Event) => {
      console.log('关闭的默认回调::::', e)
    }, // 关闭的回调
    messageCb: (e: RT) => {
      console.log('连接成功的默认回调::::', e)
    }, // 消息的回调
    errorCb: (e: Event) => {
      console.log('错误的默认回调::::', e)
    } // 错误的回调
  }

  constructor(ops: IOptions<RT>) {
    super()
    Object.assign(this.options, ops)
    this.create()
  }

  /**
   * 建立连接
   */
  create(): void {
    if (!('WebSocket' in window)) {
      throw new Error('当前浏览器不支持，无法使用')
    }
    if (!this.options.url) {
      throw new Error('地址不存在，无法建立通道')
    }
    // this.ws = null
    this.ws = new WebSocket(this.options.url)
    this.onopen(this.options.openCb as Callback)
    this.onclose(this.options.closeCb as Callback)
    this.onmessage(this.options.messageCb as MessageCallback<RT>)
  }

  /**
   * 自定义连接成功事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onopen(callback: Callback): void {
    this.ws.onopen = event => {
      clearTimeout(this.reconnectTimer) // 清除重连定时器
      this.options.reconnectCount = this.reconnectCount // 计数器重置
      // 建立心跳机制
      super.reset()
      super.start(() => {
        this.send(this.options.heartMsg as string)
      })
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.openCb === 'function' && this.options.openCb(event)
      }
    }
  }

  /**
   * 自定义关闭事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onclose(callback: Callback): void {
    this.ws.onclose = event => {
      super.reset()
      !this.options.isRestory && this.onreconnect()
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.closeCb === 'function' && this.options.closeCb(event)
      }
    }
  }

  /**
   * 自定义错误事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onerror(callback: Callback): void {
    this.ws.onerror = event => {
      if (typeof callback === 'function') {
        callback(event)
      } else {
        typeof this.options.errorCb === 'function' && this.options.errorCb(event)
      }
    }
  }

  /**
   * 自定义消息监听事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onmessage(callback: MessageCallback<RT>): void {
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const strMessage = event.data
      const { code, data, msg }: KWResponse.Result<RT> = JSON.parse(strMessage)
      if (code === 200) {
        // 收到任何消息，重新开始倒计时心跳检测
        super.reset()
        super.start(() => {
          this.send(this.options.heartMsg as string)
        })
        console.log(data, 'onmessage')
        if (typeof callback === 'function') {
          callback(data)
        } else {
          typeof this.options.messageCb === 'function' && this.options.messageCb(data)
        }
      } else {
        Message.error(msg || '收到失败的数据！')
      }
    }
  }

  /**
   * 自定义发送消息事件
   * @param {String} data 发送的文本
   */
  send(data: T | string): void {
    if (this.ws.readyState !== this.ws.OPEN) {
      throw new Error('没有连接到服务器，无法推送')
    }
    data = JSON.stringify(data)
    this.ws.send(data)
  }

  /**
   * 连接事件
   */
  onreconnect(): void {
    if ((this.options.reconnectCount as number) > 0 || this.options.reconnectCount === -1) {
      this.reconnectTimer = setTimeout(() => {
        this.create()
        if (this.options.reconnectCount !== -1) (this.options.reconnectCount as number)--
      }, this.options.reconnectTime)
    } else {
      clearTimeout(this.reconnectTimer)
      this.options.reconnectCount = this.reconnectCount
    }
  }

  /**
   * 销毁
   */
  destroy(): void {
    super.reset()
    clearTimeout(this.reconnectTimer) // 清除重连定时器
    this.options.isRestory = true
    this.ws.close()
  }
}
```

#### 使用

```ts
const wbSocket = new Socket<T, RT>({ url: url })
wbSocket.onmessage((data: RT) => {
      const str = JSON.stringify(data)
      console.log('server data:', str)
    })
```

## websocket error code 错误码说明 （CloseEvent事件说明

### 构造器EDIT
>
>[CloseEvent()](https://developer.mozilla.org/zh-CN/search?q=CloseEvent " CloseEvent()")
创建一个 CloseEvent.

### 属性EDIT
>
> 该接口也继承了其父类 Event 的属性.
CloseEvent.code 只读返回一个 unsigned short 类型的数字, 表示服务端发送的关闭码, 以下为已分配的状态码.

| 状态码    | 名称                 | 描述                                                                                              |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| 0–999     |                      | 保留段, 未使用.                                                                                   |
| 1000      | CLOSE_NORMAL         | 正常关闭; 无论为何目的而创建, 该链接都已成功完成任务.                                             |
| 1001      | CLOSE_GOING_AWAY     | 终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开.                         |
| 1002      | CLOSE_PROTOCOL_ERROR | 由于协议错误而中断连接.                                                                           |
| 1003      | CLOSE_UNSUPPORTED    | 由于接收到不允许的数据类型而断开连接 (如仅接收文本数据的终端接收到了二进制数据).                  |
| 1004      |                      | 保留.其意义可能会在未来定义.                                                                      |
| 1005      |                      | 保留. 表示没有收到预期的状态码.                                                                   |
| 1006      |                      |                                                                                                   |
| 1007      | Unsupported Data     | 由于收到了格式不符的数据而断开连接 (如文本消息中包含了非 UTF-8 数据).                             |
| 1008      | Policy Violation     | 由于收到不符合约定的数据而断开连接. 这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景. |
| 1009      | CLOSE_TOO_LARGE      | 由于收到过大的数据帧而断开连接.                                                                   |
| 1010      | Missing Extension    | 客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接.                         |
| 1011      | Internal Error       | 客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接.                                   |
| 1012      | Service Restart      | 服务器由于重启而断开连接.                                                                         |
| 1013      | Try Again Later      | 服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接.                                 |
| 1014      |                      | 由 WebSocket 标准保留以便未来使用.                                                                |
| 1016–1999 |                      | 由 WebSocket 标准保留以便未来使用.                                                                |
| 2000–2999 |                      | 由 WebSocket 拓展保留使用.                                                                        |
| 3000–3999 |                      | 可以由库或框架使用. 不应由应用使用. 可以在 IANA 注册, 先到先得.                                   |
| 4000–4999 |                      | 可以由应用使用.                                                                                   |
