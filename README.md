# 21Days

21天习惯养成打卡系统 — 学习计划 + 四象限法则 + 番茄工作法

## 功能

- **📚 学习计划** — 内置多套学习路线（编程/英语/考试/健身/副业），支持 MiniMax AI 问卷生成个性化计划，也支持自定义计划
- **✅ 打卡模块** — 四象限法则管理任务优先级，分类打卡记录每日进度；计划任务以琥珀色卡片显示在四象限中
- **🍅 番茄专注** — 打卡任务可选启动番茄钟（15/25/30/45/60min），专注完成后自动记录打卡
- **📋 任务浏览** — 按类别/子模块浏览内置任务和计划任务，查看学习路线和项目实战
- **📊 复盘总结** — 周视图查看每日打卡详情，支持每日写下总结反思，打卡评论仅当天可编辑
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
- **AI**: MiniMax API (MiniMax-M2.7)

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 环境变量

在 `src/services/ai.ts` 中配置 MiniMax API Key（部署时需替换为环境变量或 Settings 页面配置）：

| 变量 | 说明 |
|------|------|
| `MINIMAX_API_KEY` | MiniMax API 密钥 |

开发时通过 Vite proxy（`/api/minimax` → `https://api.minimax.io`）避免 CORS。

## 构建

```bash
npm run build
```

## 目录结构

```
src/
├── components/    # 公共组件（导航栏、番茄钟等）
├── data/          # 静态数据（AI模板、内置任务等）
├── db/            # IndexedDB 数据库配置
├── pages/         # 页面组件（计划/打卡/任务/复盘/设置）
├── services/      # 外部服务（MiniMax AI API）
├── store/         # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 页面导航

| 页面 | 路由 | 说明 |
|------|------|------|
| 计划 | `/` | 首页，AI/自定义计划管理 |
| 打卡 | `/checkin` | 四象限打卡 + 番茄钟 |
| 任务 | `/categories` | 浏览内置/计划任务详情 |
| 复盘 | `/stats` | 周视图 + 每日总结 |
| 设置 | `/settings` | 个人资料、头像编辑 |

## 进度卡统计

打卡页和任务页的今日进度卡统一按**计划任务**统计（不是内置任务）：

- **分母** = 活跃计划的任务总数
- **分子** = 当天已打卡的不重复计划任务数（基于 `plan-${planId}-${taskName}` 格式匹配）
- DAY 计数器按自然天递增，上限 21

## 计划模板

| 分类 | 模板 |
|------|------|
| 编程学习 | 前端入门、Python 全栈、Go 后端、Java 后端 |
| 英语 | 雅思备考、日常口语 |
| 考试备考 | PMP、CSIP |
| 健身 | 增肌、减脂、居家徒手 |
| 副业 | 自媒体运营、技能接单 |
