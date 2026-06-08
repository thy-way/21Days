# 后续规划备忘

> 记录 2026/5/21 讨论的后续方向，方便日后查阅。

---

## 一、细节打磨方向

当前 Day 1-5 优化已完成，后续可以继续打磨：

| 优先级 | 内容 | 说明 |
|---|---|---|
| P0 | AI 生产环境代理 | MiniMax API 目前仅开发模式可用（Vite proxy），部署需要 Serverless Function |
| P1 | 番茄钟自动启动 | TomatoTimer.tsx 目前需手动点开始，可加自动开始选项 |
| P1 | 首页 loading 状态 | IndexedDB 初始化时白屏，可加 splash/loading |
| P2 | PWA 推送通知 | Service Worker 已注册，可加 Web Push 提醒打卡 |
| P2 | 数据导出增强 | 当前只有 JSON 导出，可加 CSV/PDF 报表 |
| P3 | 暗色模式 | Settings.tsx 已有 theme 字段（light/dark/system），但未实现切换 |
| P3 | 多语言 | 目前纯中文，可加 i18n 框架 |

---

## 二、订阅制（渐进式方案）

### Phase 1 — Supabase 集成（~半天）
1. 注册 Supabase 账号（免费）
2. 新建项目，获取 VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
3. 安装 @supabase/supabase-js
4. 新建 src/lib/supabase.ts
5. 重写 Login.tsx & authStore.ts → Supabase Auth（邮箱+密码）
6. ProtectedRoute 改为查 Supabase session

### Phase 2 — Stripe 订阅（~半天）
1. Stripe Dashboard 创建 Payment Link
2. Supabase Edge Function 处理 webhook → 更新 user_metadata.tier
3. 前端显示 Current Tier + 「升级 Pro」按钮

### Phase 3 — 功能门控（~半天）
1. AI 生成限 Pro → MiniMax API key 移到后端 Edge Function
2. 复盘历史 Free 限 7 天，Pro 无限
3. 番茄钟完整版限 Pro

### 关键文件
- src/services/ai.ts — 加 tier 检查
- src/pages/Settings.tsx — 加订阅状态/管理入口
- src/store/ — 可能需要 subscriptionStore.ts

---

## 三、做成原生 App

### 方案 A：Capacitor（推荐，1-2 天）
`
现有 Web 代码 → Capacitor 壳 → iOS App Store / Google Play
`
- 不需要重写 UI
- 可调用原生 API（推送通知、相机）
- 维护成本极低

### 方案 B：React Native / Expo（2-4 周）
- 重写 UI，复用 zustand store + dexie 逻辑
- 更原生体验
- 适合有长期商业规划时投入

### 当前 PWA 状态（已满足基本需求）
- ✅ 可安装到桌面（manifest.webmanifest + SW skipWaiting+clientsClaim）
- ✅ 离线可用（IndexedDB + Workbox precache）
- ✅ 全屏沉浸（display: standalone）
- ✅ 自定义安装按钮（beforeinstallprompt 捕获）
- ✅ 版本更新提示（useRegisterSW + ReloadPrompt）
- ❌ 推送通知（需要实现）

---

## 四、技术债务记录

| 问题 | 说明 | 建议修复时机 |
|---|---|---|
| dist/ 产物 461 kB JS | 可能偏大，可考虑 code-split | 做大版本前 |
| types/categories.ts 动态 import 警告 | 被 db/index.ts 同时动态和静态 import | 可选 |
| ESLint 8 个 no-explicit-any warning | 分散在 5 个文件，不影响运行 | 可选 |
| Settings.tsx catch error 未使用变量 | eslint no-unused-vars warning | 可选 |
| 无自动化测试 | 无 unit test / e2e test | 加功能前建议补充 |

---

## 五、部署相关

| 平台 | 前端 | 后端（如果需要） |
|---|---|---|
| Vercel | ✅ 零配置 | Edge Functions |
| Cloudflare Pages | ✅ 需适配 | Workers |
| Railway | — | ✅ Express 后端 |

当前 npm run build 产物在 dist/，可直接部署到 Vercel。

---

## 六、PWA 完善 + 真登录系统

### 背景
2026-06-04 重构 PWA 实现（移除后重新添加，带 skipWaiting+clientsClaim+ReloadPrompt），但：
- **安装按钮未弹出** — manifest 图标为 SVG（`sizes: any`），Chrome 要求 192x192/512x512 PNG 才能触发 `beforeinstallprompt`
- **登录伪系统** — 当前 `authStore.ts` 纯客户端，任何用户名+非空密码即可登录，数据仅存 localStorage，跨设备丢失
- **与 PWA 矛盾** — 可安装的 App 应该有真正的账号系统

### Phase 1 — 修复 PWA 图标（~30 分钟）

```
当前：
  manifest icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]

改为：
  public/
  ├── icon.svg          # 源矢量（保留）
  ├── icon-192.png      # PWA 192x192
  └── icon-512.png      # PWA 512x512

  manifest icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ]
```

生成 PNG 的方式：
- 手边有设计工具（Figma/PS）→ 从 icon.svg 导出
- 没有 → 用 `npx pwa-asset-generator` 或在线工具 `https://favicon.io`
- 最简单：临时用 Canvas 在浏览器中截图 192x192 / 512x512 的 SVG 渲染结果

修改后验证：
1. DevTools → Manifest → icons 列应有 192+512 两条
2. DevTools → Manifest → Installability → 无红色错误
3. 点击页面任意按钮几次 → `beforeinstallprompt` 应触发 → 底部弹「安装到主屏幕」

### Phase 2 — Supabase Auth 集成（2-3 小时）

#### 动机
- 真正的邮箱+密码注册/登录（非伪登录）
- 为后续云端数据同步打基础
- 用户可在多设备安装 PWA 后用同一账号

#### 步骤

**1. 注册 Supabase**
- https://supabase.com → 创建账号 → 新建项目（免费 tier）
- 拿到：`SUPABASE_URL` + `SUPABASE_ANON_KEY`

**2. 安装 SDK**
```bash
npm install @supabase/supabase-js
```

**3. 新建 `src/services/supabase.ts`**
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**4. 重构 `src/store/authStore.ts`**
```
当前：
  login(username: string) → 写 localStorage

改为：
  login(email: string, password: string) → supabase.auth.signInWithPassword()
  register(email: string, password: string) → supabase.auth.signUp()
  logout() → supabase.auth.signOut()
  session → supabase.auth.getSession()
  onAuthStateChange → 监听 AuthStateChange 事件
  
  保留 loginDates 等业务数据在 localStorage（不依赖服务端）
```

**5. 更新 Login.tsx**
```
替换：
  - 用户名 + 密码输入框 → 邮箱 + 密码输入框
  - 登录按钮 → 登录/注册切换（首次用注册）
  - 伪验证 → 调 Supabase Auth API

保持：
  - 视觉风格不变（橙色渐变、DAY 计数器）
  - 错误提示（邮箱格式/密码长度）
```

**6. 环境变量**
```
// .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

// .env.example（提交到 git，占位）
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**.gitignore 增加：**
```
.env.local
.env.*.local
```

（当前 `.env.local` 已被 gitignore？验证一下）

**7. 部署注意事项**
- Vercel 项目设置 → Environment Variables → 添加 `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- 无需 Serverless Function（Supabase JS SDK 直接连接 Supabase API，前端 HTTPS 公网可达）

#### 不改的部分
- ❌ IndexedDB（Dexie）数据 — 仍存本地
- ❌ 登录前页面状态 — `isLoggedIn` 改为查 `supabase.auth.session()`
- ❌ loginDates / 头像 / bio — 仍存 localStorage（用户维度，同设备互通）
- ❌ 数据同步 — 不做（留待 Phase 3）

#### 风险
| 风险 | 缓解 |
|---|---|
| Supabase 免费 tier 限制（50k 用户） | 个人项目完全够用 |
| 用户邮箱验证 | Supabase 默认发验证邮件，可跳过改为自动确认 |
| 离线时无法登录 | 已登录 session 缓存，离线仍可用；首次注册需要网络 |
| 密码找回 | Supabase Auth 内置密码重置流程 |

### Phase 3（可选）— 数据同步到 Supabase 数据库

将 IndexedDB 数据（checkIns、summaries、plans）同步到 Supabase PostgreSQL：
- ✅ 跨设备数据一致
- ❌ 离线-在线冲突处理复杂
- ❌ 需要迁移现有本地数据
- 评估：当前阶段不值得做，等用户有明确需求时再投入

### 关联的现有规划

参考「二、订阅制」Phase 1（Supabase 集成）— 之前规划的 Phase 1 与当前的 Phase 2 本质相同，可合并执行。差异在于：
- 之前定位为「订阅制的前置步骤」
- 当前定位为「PWA 完善的基础设施」
- 执行层面完全一致，登入 Supabase 后后续加 Stripe/门控也很容易


