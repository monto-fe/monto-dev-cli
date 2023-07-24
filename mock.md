## 一、支持能力

- 支持一行命令启动本地 RESTful/Action 风格 API 的 http 服务
- 支持项目正常请求 API 和模拟 API 无缝切换，且可以代理跨域请求
- 支持自定义配置请求头和请求时间
- 定义数据简单，且支持 Mockjs 规则定义数据

## 二、快速使用

### 1、安装

```js
// 全局安装
npm i monto-dev-cli -g
// 本地安装
npm i monto-dev-cli -D
```

### 2、使用

```js
yarn monto-dev-cli mock
```

**注意事项**

- 该操作会在执行命令的目录下生成 mock 目录作为 mock 数据的存储地址
- 可以将该目录加入.gitignore 或者自定义目录地址
- restful 风格的 api 会自动启动浏览器

### 3、如何模拟接口

> 参考生成 mock 目录下的 json 数据，返回数据可以使用 mock 的规则定义，也可以直接确定的值。

**RESTFul 风格**

在 restful 目录下新建`get`、`post`、`put`等请求方法的目录，目录下分别是 mock 的 json 数据。

请求的 url 以短线连接成为文件名，比如想要新建一个 get 请求的 user 数据，请求接口为`/v1/user`,则对应新建文件`v1-user.json`

```js
{
  "RetCode": 0,
  "Message": "success",
  "Data|1-9": [
    {
      "Id|+1": 1,
      "UserName": "@name"
    }
  ]
}
```

**Action 风格**

直接新建以 Action 命名的 JSON 文件即可，返回值内容即为 json 文件内容。

```json
{
  "Action": "Query",
  "RetCode": 0,
  "Message": "",
  "Data|1-10": [
    {
      "Id|+1": 1,
      "Name": "@name",
      "Email": "@email",
      "Portrait": "@image"
    }
  ]
}
```

直接定义返回的 JSON 参数，请求

## 三、CLI 命令配置

只生成 mock 接口，不需要该配置文件。如果需要更多的配置，在项目根目录下新建`monto.config.js`

- proxyApiUrl: 可选参数后端服务地址，如果本地没有模拟数据，将会反向代理到当前地址
- headers: 可选参数，自定义 headers 字段，内部已经预置`Access-Control-Allow-Headers:Origin,X-Requested-With,Content-Type,Accept`，可以进行覆盖，注意[key:value]，value 值中不可以有空格
- type: api 类型，可选 action/restful

```js
module.exports = {
  mock: {
    proxyApiUrl: '',
    headers:
      'Access-Control-Allow-Headers:Origin,X-Requested-With,Content-Type,Accept,X-Accesstoken',
    type: 'restful',
  },
};
```

## 四、mock 规则说明

参考：[mockjs](https://github.com/nuysoft/Mock/wiki/Getting-Started)

## 五、待实现

1、构建客户端
2、支持 Docker 启动服务
3、读取 swagger 文档生成模拟接口
4、根据接口直接生成代码
