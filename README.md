# Web3 预测市场演示应用

一个基于Next.js构建的Web3预测市场应用，展示类似Polymarket的预测市场功能。

## 功能特点

- 使用Next.js和React构建的现代化Web应用
- 响应式设计，适配各种设备
- 展示预测市场话题卡片
- 集成实时API数据
- 支持自动和手动刷新数据

## 技术栈

- Next.js
- React
- TypeScript
- TailwindCSS
- Axios

## 开始使用

1. 克隆项目
```bash
git clone <repository-url>
cd web3_demo
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
.
├── components/       # React组件
├── pages/            # Next.js页面
├── public/           # 静态资源
├── services/         # API服务
├── styles/           # 全局样式
└── types/            # TypeScript类型定义
```

## API数据源

该应用使用以下API获取预测市场数据：
```
https://api-monad.olab.xyz/api/v2/topic?status=2&isShow=1&page=1&limit=12&topicType=2&keywords=&sortBy=1&chainId=10143
```

## 构建生产版本

```bash
npm run build
npm start
```
