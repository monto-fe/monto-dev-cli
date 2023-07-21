## 一、支持能力
- 支持一行命令启动本地RESTful/Action风格API的http服务
- 支持项目正常请求API和模拟API无缝切换，且可以代理跨域请求
- 支持自定义配置请求头和请求时间
- 定义数据简单，且支持Mockjs规则定义数据

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
- 该操作会在执行命令的目录下生成mock目录作为mock数据的存储地址
- 可以将该目录加入.gitignore或者自定义目录地址
- restful风格的api会自动启动浏览器

### 3、如何模拟接口

> 参考生成mock目录下的json数据，返回数据可以使用mock的规则定义，也可以直接确定的值。

**RESTFul风格**

在restful目录下新建`get`、`post`、`put`等请求方法的目录，目录下分别是mock的json数据。

请求的url以短线连接成为文件名，比如想要新建一个get请求的user数据，请求接口为`/v1/user`,则对应新建文件`v1-user.json`

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

**Action风格**

直接新建以Action命名的JSON文件即可，返回值内容即为json文件内容。

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

直接定义返回的JSON参数，请求

## 三、CLI命令配置

只生成mock接口，不需要该配置文件。如果需要更多的配置，在项目根目录下新建`monto.config.js`

- proxyApiUrl: 可选参数后端服务地址，如果本地没有模拟数据，将会反向代理到当前地址
- headers: 可选参数，自定义headers字段，内部已经预置`Access-Control-Allow-Headers:Origin,X-Requested-With,Content-Type,Accept`，可以进行覆盖，注意[key:value]，value值中不可以有空格
- type: api类型，可选action/restful

```js
module.exports = {
  mock: {
    proxyApiUrl: '',
    headers:
      'Access-Control-Allow-Headers:Origin,X-Requested-With,Content-Type,Accept,X-Accesstoken',
    type: 'restful',
  }
}
```

## 四、mock规则说明

参考：[mockjs](https://github.com/nuysoft/Mock/wiki/Getting-Started)

## 五、待实现

1、构建客户端
2、支持Docker启动服务
3、读取swagger文档生成模拟接口
4、根据接口直接生成代码