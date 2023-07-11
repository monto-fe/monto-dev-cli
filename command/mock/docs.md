1、控制接口响应速度速度
3、支持 MockAPI 生成自定义字段
4、构建客户端

- 实现功能 MockAPI
- 生成 React 基础组件
- 根据接口实现 Golang 增删改查代码
- 根据注释或 Swagger 的规则，重新写一个 UI 界面
  4、读取 swagger 文档
  2、控制接口报错
  3、自定义状态，或者特殊字段

通过解析请求参数生成不同的数据
通过设置 setTimeout，配置延时返回效果
TODO: 提取生成 json 数据的代码
TODO: 第一次生成的情况下，要判断 mock 下对应的文件是否存在，而不仅仅是判断 mock

// 如何使用

- 1、安装 CLI（全局、本地）
- 2、yarn um-dev-cli mock (直接本地新建 mock 目录)
- 3、支持 Action
- 4、支持 json 文件配置 mock 规则
- 5、支持 mock 数据存放在其他地方
- 6、根据接口直接生成代码，
  - 可以直接生成组件
  - 也可以生成对应的项目自行启动
  - 路径默认是 mock 平级路径下新生成 monto-component
