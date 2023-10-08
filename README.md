# Meow Contacts  - Google Contacts的（部分功能）临摹实现

## 在线Demo
项目已经部署在Verce, [点击访问🌍](https://meow-contacts.vercel.app/)

## 登录⚠️
目前使用的Google OAuth 同意屏幕为测试版（提交的应用还没有通过审核，也不知道能不能通过审核😓），因此目前你**无法使用**你的Google账号进行登录。

如果你要完成登录， 请[发邮件告诉我你的邮箱](mailto:aqeja@outlook.com)，这样我就可以将你添加为测试用户了。
## 功能列表
- [x] 接入Google Oauth登录，自动刷新Access Token，实现了持久化登录
- [x] 展示联系人列表
- [x] 搜索联系人
- [x] 创建标签
- [x] 编辑标签
- [x] 将联系人添加到标签
- [x] 将联系人从标签中移除
- [x] 删除标签
  - [x] 仅删除标签，不删除联系人
  - [x] 删除标签及关联此标签的联系人
- [x] 联系人列表响应式设计
- [x] 查看联系人详情
- [x] 删除联系人

## 目录结构
- `/api` 托管在vercel的函数，用于处理Googl Oauth的相关工作
- `/src` 项目前端代码
  - `api` 项目用到的相关API
  - `components`  一些通用的组件
  - `views` 项目中的页面
  - `types` 数据的类型定义
- `/public` 静态资源

## 项目介绍
项目为CSR应用，使用了React、TypeScript、TailwindCSS、recoil等进行开发，组件库为[mui](https://mui.com/)。

## 本地运行
### 将项目代码拉取到本地
```
git clone https://github.com/aqeja/meow-contacts
```
### 安装依赖
为减少依赖安装过程中存在的问题，请尽量使用`pnpm`安装依赖。
```
pnpm i
```

### 运行项目
为确保登录顺利，请确保端口号为5173
```
npm run dev
```

在浏览器打开 [http://localhost:5173/](http://localhost:5173/)