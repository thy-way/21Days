# 21Days

21天习惯养成打卡系统 — 学习计划 + 四象限法则 + 番茄工作法

## 功能

- **📚 学习计划** — 内置多套学习路线（编程/英语/考试/健身/副业），支持 AI 问卷生成个性化计划，也支持自定义计划
- **✅ 打卡模块** — 四象限法则管理任务优先级，分类打卡记录每日进度
- **🍅 番茄专注** — 打卡任务可选启动番茄钟，专注完成后自动记录
- **📋 复盘总结** — 周视图查看每日打卡详情，支持每日写下总结反思
- **🔐 登录系统** — 个人账号管理，自定义头像与资料

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **状态管理**: Zustand
- **数据库**: IndexedDB (Dexie.js)
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **图标**: Lucide React
- **日期**: date-fns

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 构建

```bash
npm run build
```

## 目录结构

```
src/
├── components/    # 公共组件（导航栏、UI组件等）
├── data/          # 静态数据（AI模板等）
├── db/            # IndexedDB 数据库配置
├── pages/         # 页面组件
├── store/         # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 计划模板

| 分类 | 模板 |
|------|------|
| 编程学习 | 前端入门、Python 全栈、Go 后端、Java 后端 |
| 英语 | 雅思备考、日常口语 |
| 考试备考 | PMP、CSIP |
| 健身 | 增肌、减脂、居家徒手 |
| 副业 | 自媒体运营、技能接单 |
