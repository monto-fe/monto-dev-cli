## 安装

yarn add monto-dev-cli

## 使用

monto-dev-cli g -c Box Button -t function

monto-dev-cli c -p

功能规划：

1. 生成基于 react 的各种组件 - 类式、函数式、js、ts，并可以制定生成目录
2. 生成 emotion 样式包裹组件
3. 一键配置 githook + eslint
4. 创建组件蓝图，上传优秀组件，便于复用

将 CLI 通过 docker-compose 构建，完成一键启动 CLI 服务，界面操作

完成能力说明：

- mockAPI: action restful
- 判断当前端口是否被占用，启动端口
- 自动生成 mock 数据
- restful 自动打开浏览器，请求地址
