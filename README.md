# 21Days

21 天习惯养成打卡应用 — 学习计划 + 四象限法则 + 番茄工作法 + 复盘总结

## 功能

- **📚 学习计划** — 内置多套学习路线（编程/英语/考试/健身/副业），支持 MiniMax AI 问卷生成个性化计划，也支持自定义计划
- **✅ 打卡模块** — 四象限法则管理任务优先级，分类打卡记录每日进度；计划任务以琥珀色卡片显示在四象限中
- **🍅 番茄专注** — 打卡任务可选启动番茄钟（15/25/30/45/60min），专注完成后自动记录打卡
- **📋 任务浏览** — 按类别/子模块浏览内置任务和计划任务，查看学习路线和项目实战
- **📊 复盘总结** — 周视图查看每日打卡详情，默认显示今天；详情面板可一键「今日打卡」；支持每日写下总结反思
- **🔐 登录系统** — 个人账号管理，`loginDates` 按用户名隔离；自定义头像与资料

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **状态管理**: Zustand
- **数据库**: IndexedDB (Dexie.js)
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **图标**: Lucide React
- **日期**: date-fns
- **AI**: MiniMax API (MiniMax-M3)

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 环境变量

在 `src/services/ai.ts` 中配置 MiniMax API Key（部署时需替换为环境变量或 Settings 页面配置）：

| 变量 | 说明 |
|------|------|
| `MINIMAX_API_KEY` | MiniMax API 密钥 |

开发时通过 Vite proxy（`/api/minimax` → `https://api.minimax.io`）避免 CORS。

## 构建

```bash
npm run build       # tsc + vite build，输出到 dist/
npm run preview     # 本地预览构建产物
npm run lint        # ESLint
```

## 部署

- **平台**: Vercel
- **生产 URL**: https://21days-woad.vercel.app
- **配置**: `vercel.json`（项目名 `21days`）
- **每次部署**: 改代码 → `npm run build` → `git commit` → `git push` → `npx vercel --prod`
- **GFW 提示**: `github.com` 偶发阻断，`git push` 需 retry 5-10 次（hosts 已配 `140.82.121.3 github.com`）

### 关于 PWA（已移除）

本项目早期启用了 `vite-plugin-pwa` + Workbox，但因 Service Worker 缓存导致旧版本残留、更新机制对用户不透明，**已彻底移除**。当前部署走标准 HTTP 缓存 + Vite 文件 hash 失效策略——每次部署你刷新即生效。

## 目录结构

```
src/
├── components/    # 公共组件（导航栏、番茄钟、日历、对话框等）
├── constants/     # 静态常量（分类定义等）
├── data/          # 静态数据（AI 问卷模板、内置任务等）
├── db/            # IndexedDB 数据库配置（Dexie）
├── pages/         # 页面组件（登录/计划/打卡/任务/复盘/设置）
├── services/      # 外部服务（MiniMax AI API）
├── store/         # Zustand 状态管理（auth/checkIn/settings）
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

## 页面导航

| 页面 | 路由 | 鉴权 | 说明 |
|------|------|------|------|
| 登录 | `/login` | 公开 | 账号登录，`loginDates` 按用户隔离 |
| 计划 | `/` | 需登录 | 首页，AI/自定义计划管理 |
| 打卡 | `/checkin` | 需登录 | 四象限打卡 + 番茄钟 |
| 任务 | `/categories` | 需登录 | 浏览内置/计划任务详情 |
| 复盘 | `/stats` | 需登录 | 周视图 + 每日总结，默认显示今天 |
| 设置 | `/settings` | 需登录 | 个人资料、头像编辑 |

## 进度卡统计

打卡页和任务页的今日进度卡统一按**计划任务**统计（不是内置任务）：

- **分母** = 活跃计划的任务总数
- **分子** = 当天已打卡的不重复计划任务数（基于 `plan-${planId}-${taskName}` 格式匹配）
- DAY 计数器按自然天递增，上限 21

## 计划模板

按 `src/data/aiTemplates.ts` 的 `CATEGORY_QUESTIONS` 分类，AI 问卷根据答案动态生成计划：

| 分类 | 动态计划标题示例 |
|------|------|
| 健身 (`fitness`) | 减脂塑形计划 / 增肌训练计划 / 健康保持计划 |
| 编程 (`coding`) | 前端开发学习计划 / 后端开发学习计划 / AI 数据科学计划 / 移动端开发计划 |
| 英语 (`english`) | `{area}英语备考计划` |
| 考试 (`exam`) | 备考冲刺计划 |
| 副业 (`sideproject`) | 自媒体运营计划 / 自由职业接单计划 / 打造产品计划 / 电商创业计划 |

## 近期更新

- **2026-06-04** — 移除 PWA（消除 Service Worker 缓存导致旧版本残留）；登录页 `loginDates` 改为按用户隔离；复盘页默认显示今天并支持详情面板一键「今日打卡」；5 个页面 header 仅保留 `21Days` brand 文字（移除 descriptor）
- **2026-06-04** — 复盘页改造：默认今天 + 周导航智能保留今天 + 任务选择 modal + 复用 `TaskCheckInDialog`
