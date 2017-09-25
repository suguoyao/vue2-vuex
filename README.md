# 基于Vue+Vuex+MuseUI开发的名片夹应用

> 持续更新中...


## 更新内容
``` bash
2017.9.18更新内容:
1.增加图片加载loading
2.地址可前往查看对应地图
3.可发送邮件
4.增加用户使用帮助引导
5.样式调整


2017.9.1更新内容:
1.当前分组下识别名片，默认将名片分配到当前分组
2.搜索名片


2017.8.31更新内容:
1.名片分组
2.删除名片功能
3.快捷拨打电话
4.识别名片
5.将名片保存于CRM系统
6.查看名片详情
7.编辑名片信息可更新
8.可查看公司工商信息
```


## 技术栈

*  vue-cli: 快速构建vue单页应用的脚手架
*  vue2: 基础框架
*  vue-router: 路由框架
*  vuex: 全局数据管理
*  axios: 基于Promise的http库，可用来请求数据
*  es6: 使用了es6新特性，提高代码质量，简化书写方式
*  scss: 强大的 CSS 扩展语言，最终编译成css
*  webpack2: 模块打包工具
*  muse-ui: UI框架

## 项目结构
``` bash
.
├── README.md
├── build                   // 构建服务和webpack配置
├── config                  // 项目不同环境的配置
├── dist                    // 项目build打包后生成的目录
├── index.html              // 项目入口html文件
├── mockdata.json           // 用于存放一些模拟json数据
├── node_modules            // 含所有依赖包的文件夹
├── package.json            // 项目依赖包配置文件
├── src
│   ├── App.vue             // 模板文件入口
│   ├── assets              //
│   ├── common              // 公用文件
│   ├── components          // 各种组件
│   ├── main.js             // webpack预编译入口
│   ├── muse-ui.config.js   // museui框架单组件加载配置文件
│   ├── router              // 路由配置文件
│   └── vuex                // vuex全局状态管理文件夹
├── static                  // 存放静态资源文件如css,js,img
│   ├── css
│   ├── images
│   └── js
└── test
```


## Build Setup

``` bash
# clone项目到本地
git clone https://github.com/526878729/vue2-vuex.git

# 安装依赖
npm install

# 本地运行(端口已设置为8888)
npm run dev

# 打包
npm run build
```
