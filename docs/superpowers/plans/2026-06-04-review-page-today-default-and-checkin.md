# 复盘页默认今天+直接打卡 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** 让 /stats 复盘页进入即显示今天详情 + 提供「今日打卡」入口直接补卡

**Architecture:** 所有改动集中在 src/pages/Stats.tsx 一个文件。复用 useCheckInStore.addCheckIn/loadDateCheckIns 和 <TaskCheckInDialog> 组件，不改 store、schema、其它页面。

**Tech Stack:** React + TypeScript + Zustand + Dexie + Tailwind + lucide-react + date-fns

**Spec:** docs/superpowers/specs/2026-06-04-review-page-today-default-and-checkin-design.md

---

## 文件清单

| 操作 | 路径 | 责任 |
|---|---|---|
| 修改 | src/pages/Stats.tsx | 复盘页全部改动（默认选中、加 effect、智能周导航、加按钮、加 modal、复用 dialog） |
| 修改 | src/store/useCheckInStore.ts | 无 |
| 修改 | src/components/CheckInDialog.tsx | 无 |

仅 Stats.tsx 一个文件被改动。

---

## Task 1：默认选中今天

**Files:**
- Modify: src/pages/Stats.tsx:31

- [ ] **Step 1: 修改 selectedDay 初始值**

找到第 31 行：
`	s
const [selectedDay, setSelectedDay] = useState<string | null>(null);
`

改为：
`	s
const [selectedDay, setSelectedDay] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));
`

- [ ] **Step 2: 验证 build 通过**

Run:
`ash
npm run build
`

Expected: 编译通过，无 TS 错误。dist/ 重新生成。

- [ ] **Step 3: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "feat(stats): default selectedDay to today"
`

---

## Task 2：抽取加载逻辑为 effect

**Files:**
- Modify: src/pages/Stats.tsx:94-105

- [ ] **Step 1: 新增 useEffect**

在 handleDayClick 上方插入：

`	sx
useEffect(() => {
  if (!selectedDay) return;
  const record = weeklyRecords.find(r => r.date === selectedDay);
  setSelectedDayCheckIns(record?.checkIns || []);
  loadDailySummary(selectedDay).then(summaries => {
    setSelectedDaySummaries(summaries);
    setDailySummary(summaries.length > 0 ? summaries[0].content : '');
  });
}, [selectedDay, weeklyRecords, loadDailySummary]);
`

- [ ] **Step 2: 简化 handleDayClick**

把现有第 94-105 行 handleDayClick 改为：
`	sx
const handleDayClick = (date: string) => {
  setSelectedDay(date);
  setSaved(false);
  setEditingComments({});
};
`

- [ ] **Step 3: 验证 build 通过**

Run:
`ash
npm run build
`

Expected: 编译通过。

- [ ] **Step 4: 启动 dev server 验证**

Run:
`ash
taskkill /f /im node.exe 2>/dev/null; sleep 1; npm run dev
`

Expected: 服务启动，访问 http://localhost:3000/stats 看到今天的详情面板，加载出打卡记录和今日总结 textarea。

- [ ] **Step 5: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "refactor(stats): extract day-load logic into useEffect"
`

---

## Task 3：周导航智能保留选中

**Files:**
- Modify: src/pages/Stats.tsx:84-92,3-6

- [ ] **Step 1: 扩展 date-fns import**

找到文件顶部的 import：
`	sx
import { startOfWeek, endOfWeek, subDays, format, parseISO } from 'date-fns';
`

改为：
`	sx
import { startOfWeek, endOfWeek, subDays, format, parseISO, isBefore, isAfter } from 'date-fns';
`

- [ ] **Step 2: 重写 handlePrevWeek / handleNextWeek**

把第 86-92 行的两个函数改为：

`	sx
const handlePrevWeek = () => {
  const newStart = subDays(weekStart, 1);
  setCurrentWeek(newStart);
  const today = format(new Date(), 'yyyy-MM-dd');
  const newEnd = subDays(weekEnd, 7);
  const inRange = !isBefore(today, format(newStart, 'yyyy-MM-dd'))
                   && !isAfter(today, format(newEnd, 'yyyy-MM-dd'));
  setSelectedDay(inRange ? today : null);
};
const handleNextWeek = () => {
  const newStart = subDays(weekStart, -7);
  setCurrentWeek(newStart);
  const today = format(new Date(), 'yyyy-MM-dd');
  const newEnd = subDays(weekEnd, -7);
  const inRange = !isBefore(today, format(newStart, 'yyyy-MM-dd'))
                   && !isAfter(today, format(newEnd, 'yyyy-MM-dd'));
  setSelectedDay(inRange ? today : null);
};
`

- [ ] **Step 3: 验证 build**

Run:
`ash
npm run build
`

Expected: 编译通过。

- [ ] **Step 4: 验证：上一周/下一周行为**

手动：
1. 进入 /stats 看到今天高亮选中
2. 点「上一周」→ 详情消失（这周不含今天）
3. 点「下一周」回到今天 → 详情再次出现
4. 在包含今天的周内上下切 → 今天保持选中

- [ ] **Step 5: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "feat(stats): keep today selected when navigating weeks"
`

---

## Task 4：删除空状态占位提示

**Files:**
- Modify: src/pages/Stats.tsx:430-435

- [ ] **Step 1: 删除空状态 JSX**

找到第 430-435 行（详细打卡记录展示块之后、可能存在的「点击上方日期」占位）：

`	sx
{!selectedDay && (
  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
    <p>点击上方日期查看详细打卡记录</p>
  </div>
)}
`

整段删除。如果详情面板是独立 {selectedDay && (...)} 包裹的，那么这个空状态块是独立的 !selectedDay && ...。删除后保留详情面板自身的 selectedDay && (...) 条件即可（当用户翻到不含今天的周时，selectedDay 为 null，详情自动隐藏，这是符合预期的）。

- [ ] **Step 2: 验证 build**

Run:
`ash
npm run build
`

Expected: 编译通过。

- [ ] **Step 3: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "refactor(stats): remove obsolete empty-state prompt"
`

---

## Task 5：详情面板 header 加「今日打卡」按钮

**Files:**
- Modify: src/pages/Stats.tsx:1-25, 244-260

- [ ] **Step 1: 引入 Plus icon**

文件顶部 lucide-react import 已有多种 icon。在 import 末尾追加：
`	sx
Plus,
`

如果原来用一行多 icon，按行末加逗号续行。

- [ ] **Step 2: 在详情 header 加按钮**

找到详情 header（大约第 244-260 行）—— h2 显示日期的位置，标题右侧加按钮：

`	sx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
    <Calendar className="w-5 h-5 text-orange-500" />
    {format(parseISO(selectedDay), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
  </h2>
  {format(parseISO(selectedDay), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
    <button
      onClick={() => setCheckInPickerOpen(true)}
      className="brand-gradient text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity">
      <Plus className="w-4 h-4" /> 今日打卡
    </button>
  )}
</div>
`

- [ ] **Step 3: 验证 build**

Run:
`ash
npm run build
`

Expected: 编译通过。如果报 setCheckInPickerOpen 未定义，那是预期的——Task 6 才会加。

- [ ] **Step 4: 提交（如果 build 通过含未定义错误可跳过）**

如果 build 因 setCheckInPickerOpen 失败，先临时注释掉按钮的 onClick 和条件渲染，确保编译通过再 commit：

`ash
git add src/pages/Stats.tsx
git commit -m "feat(stats): add '今日打卡' button to today detail header"
`

---

## Task 6：新增 state 和任务选择 modal

**Files:**
- Modify: src/pages/Stats.tsx:27-90, 380-441

- [ ] **Step 1: 加新 state**

在 selectedDaySummaries 等 state 旁边（约第 38 行附近）追加：

`	sx
const [checkInPickerOpen, setCheckInPickerOpen] = useState(false);
const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
const [checkInTask, setCheckInTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);
`

- [ ] **Step 2: 引入 usePlanStore 并派生 activePlanTasks**

找到 useCheckInStore 调用的位置（第 27 行附近），追加：

`	sx
const { plans, loadPlans } = usePlanStore();
React.useEffect(() => { loadPlans(); }, [loadPlans]);
const activePlanTasks = React.useMemo(() =>
  plans.filter(p => p.isActive).flatMap(p =>
    p.tasks.map(t => ({ ...t, planId: p.id!, planCategoryId: p.categoryId }))
  ),
  [plans]
);
`

确保 import：
`	sx
import { useCheckInStore, usePlanStore } from '@/store';
`
（如果原文件只 import 了 useCheckInStore，扩展成两者）

- [ ] **Step 3: 加任务选择 modal**

在文件末尾，整个 return JSX 结束标签 </div> 之前（约第 430-441 之间），追加：

`	sx
{/* Task picker modal */}
{checkInPickerOpen && (
  <div
    className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
    onClick={() => setCheckInPickerOpen(false)}>
    <div
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-md max-h-[70vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">选择任务</h3>
        <button onClick={() => setCheckInPickerOpen(false)}
          className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      {activePlanTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-6">暂无 active plan 任务</p>
      ) : (
        <div className="space-y-2">
          {activePlanTasks.map(t => (
            <button
              key={${t.planId}-}
              onClick={() => {
                setCheckInTask({ planId: t.planId!, categoryId: t.planCategoryId, name: t.name });
                setCheckInPickerOpen(false);
                setCheckInDialogOpen(true);
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors">
              <div className="font-medium text-gray-800 dark:text-gray-200">{t.name}</div>
              {t.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.description}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)}
`

需要在 lucide-react import 加 X icon。

- [ ] **Step 4: 验证 build**

Run:
`ash
npm run build
`

Expected: 编译通过。

- [ ] **Step 5: 启动 dev 验证**

Run:
`ash
taskkill /f /im node.exe 2>/dev/null; sleep 1; npm run dev
`

手动：
1. 进入 /stats
2. 点「今日打卡」按钮 → 任务选择 modal 弹出
3. 列出 active plan 任务
4. 点空白处或 X 关闭

- [ ] **Step 6: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "feat(stats): add task picker modal for '今日打卡'"
`

---

## Task 7：复用 TaskCheckInDialog

**Files:**
- Modify: src/pages/Stats.tsx:3-4, 441-450

- [ ] **Step 1: 引入 TaskCheckInDialog**

文件顶部 import 已有多种组件。确保：
`	sx
import { TaskCheckInDialog } from '@/components/CheckInDialog';
`

- [ ] **Step 2: 在 return 末尾添加 TaskCheckInDialog**

在 Task 6 加的 task picker modal 之后（也是整个 return 结束前），追加：

`	sx
{/* Check-in dialog (reused from Home page) */}
{checkInTask && (
  <TaskCheckInDialog
    open={checkInDialogOpen}
    onOpenChange={(o) => {
      setCheckInDialogOpen(o);
      if (!o) setCheckInTask(null);
    }}
    taskName={checkInTask.name}
    onConfirm={async (duration, quantity, note, photo) => {
      await addCheckIn(
        plan--,
        checkInTask.categoryId,
        duration, quantity, note, photo
      );
      const today = format(new Date(), 'yyyy-MM-dd');
      const refreshed = await loadDateCheckIns(today);
      setSelectedDayCheckIns(refreshed);
      setWeeklyRecords(prev => prev.map(r =>
        r.date === today
          ? { ...r, checkIns: refreshed, totalCount: refreshed.length }
          : r
      ));
      setCheckInTask(null);
    }}
  />
)}
`

需要确认 useCheckInStore 解构出来有 ddCheckIn 和 loadDateCheckIns。检查第 27 行的解构：
`	sx
const { categories, tasks, getDailyStats, loadDailySummary, saveDailySummary, loadAllSummaries, updateCheckInComment } = useCheckInStore();
`

如果缺少，扩展为：
`	sx
const { categories, tasks, getDailyStats, loadDailySummary, saveDailySummary, loadAllSummaries, updateCheckInComment, addCheckIn, loadDateCheckIns } = useCheckInStore();
`

- [ ] **Step 3: 验证 build**

Run:
`ash
npm run build
`

Expected: 编译通过。

- [ ] **Step 4: 启动 dev 完整验证**

Run:
`ash
taskkill /f /im node.exe 2>/dev/null; sleep 1; npm run dev
`

手动：
1. 访问 http://localhost:3000/stats
2. 进入即看到今天详情（打卡记录列表、今日总结 textarea、「今日打卡」按钮）
3. 点「今日打卡」→ 任务选择 modal 弹出
4. 选一个任务 → TaskCheckInDialog 弹出
5. 填时长/数量/备注 → 点确认
6. 详情面板的记录列表立即多一项
7. 关闭浏览器再打开 → 数据持久化

- [ ] **Step 5: 提交**

`ash
git add src/pages/Stats.tsx
git commit -m "feat(stats): integrate TaskCheckInDialog for direct check-in"
`

---

## Task 8：构建并部署

**Files:**
- Modify: 无

- [ ] **Step 1: 完整 build**

Run:
`ash
npm run build
`

Expected: 编译通过，dist 重新生成。

- [ ] **Step 2: 推 GitHub**

Run:
`ash
git push
`

Expected: 推到 origin/main。失败时 retry（GFW 偶发阻断）。

- [ ] **Step 3: 部署 Vercel**

Run:
`ash
npx vercel deploy --prod --yes
`

Expected: 部署成功，返回 production URL。

---

## 验证清单（实施完毕后）

- [ ] 
pm run build 无 TS 错误
- [ ] /stats 进入即看到今天详情
- [ ] 「今日打卡」按钮仅在选中今天时显示
- [ ] 点按钮 → 任务选择 modal
- [ ] 选任务 → TaskCheckInDialog 走标准流程
- [ ] 完成打卡后今日记录实时刷新
- [ ] 周历切换其它日期 → 详情切换，「今日打卡」按钮隐藏
- [ ] 上一周/下一周 → 含今天时保持选中
- [ ] 推 GitHub 成功
- [ ] Vercel 部署成功

## 风险

- TaskCheckInDialog 接受的 	askName/onConfirm 签名与 Home 页一致；若有差异需调整（参考 src/pages/Home.tsx:188-189）
- usePlanStore 暴露 loadPlans 但 Stats 之前没调过，loading 之前 activePlanTasks 暂时为 []——空态已处理
- 跨日期（midnight）刷新不在本次范围