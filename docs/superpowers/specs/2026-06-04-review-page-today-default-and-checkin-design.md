# 复盘页：默认显示今天 + 直接打卡

## 目标

让 /stats（复盘页）进入即显示今天（默认行为）的详细打卡记录，并提供「今日打卡」入口，使用户不必先去 /checkin 或 /categories 即可补打今天的卡。

## 范围

仅修改 1 个文件：src/pages/Stats.tsx。其它文件、store、DB schema 均不动。

## 行为变化

### 现状

1. 进入 /stats → selectedDay = null → 显示空状态文案「点击上方日期查看详细打卡记录」
2. 用户必须点周历的某一天（通常是今天）才显示详情
3. 详情面板只读历史 + 加评论 + 写「今日总结」，无新打卡入口

### 期望

1. 进入 /stats 自动选中今天并显示详情
2. 详情面板右上角加「今日打卡」按钮（仅今天可见）
3. 点击「今日打卡」→ 弹出任务选择器（active plan 任务列表）→ 选中任务 → 复用现有 TaskCheckInDialog 走标准打卡流程
4. 周历上点击别的日期 → 切换到那一天查看（行为不变）
5. 上一周/下一周 → 智能保留选中（如果新周含今天则保持选中今天，否则清空）

## 实施步骤

### Step 1：默认选中今天
src/pages/Stats.tsx 第 31 行:
`	s
const [selectedDay, setSelectedDay] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));
`

### Step 2：把加载逻辑抽成 effect
新增 effect（原 handleDayClick 第 95-105 行的内容挪入）:
`	s
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

handleDayClick 简化为:
`	s
const handleDayClick = (date: string) => {
  setSelectedDay(date);
  setSaved(false);
  setEditingComments({});
};
`

### Step 3：周导航智能保留
`	s
import { isBefore, isAfter } from 'date-fns';

const handlePrevWeek = () => {
  const newStart = subDays(weekStart, 1);
  setCurrentWeek(newStart);
  const today = format(new Date(), 'yyyy-MM-dd');
  const newEnd = subDays(weekEnd, 7);
  const inRange = !isBefore(today, format(newStart, 'yyyy-MM-dd'))
                   && !isAfter(today, format(newEnd, 'yyyy-MM-dd'));
  setSelectedDay(inRange ? today : null);
};
const handleNextWeek = () => { /* 同理 */ };
`

### Step 4：删除空状态占位
删除 src/pages/Stats.tsx 第 430-435 行（"点击上方日期查看详细打卡记录"占位提示）。

### Step 5：详情面板 header 加「今日打卡」按钮
详情 header 第 244-249 行附近，标题右侧:
`	sx
{isTodaySelected && (
  <button onClick={() => setCheckInPickerOpen(true)}
    className="brand-gradient text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
    <Plus className="w-4 h-4" /> 今日打卡
  </button>
)}
`
从 lucide-react 引入 Plus icon。

### Step 6：任务选择 modal
新增 state + UI:
`	s
const [checkInPickerOpen, setCheckInPickerOpen] = useState(false);
const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
const [checkInTask, setCheckInTask] = useState<{ planId: number; categoryId: string; name: string } | null>(null);
const { plans, loadPlans } = usePlanStore();
React.useEffect(() => { loadPlans(); }, [loadPlans]);
const activePlanTasks = React.useMemo(() =>
  plans.filter(p => p.isActive).flatMap(p =>
    p.tasks.map(t => ({ ...t, planId: p.id!, planCategoryId: p.categoryId }))
  ),
  [plans]
);
`

任务选择 modal:
`	sx
{checkInPickerOpen && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
       onClick={() => setCheckInPickerOpen(false)}>
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-md max-h-[70vh] overflow-y-auto"
         onClick={e => e.stopPropagation()}>
      <h3 className="text-lg font-semibold mb-3">选择任务</h3>
      {activePlanTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-6">暂无 active plan 任务</p>
      ) : (
        <div className="space-y-2">
          {activePlanTasks.map(t => (
            <button key={${t.planId}-}
              onClick={() => {
                setCheckInTask({ planId: t.planId!, categoryId: t.planCategoryId, name: t.name });
                setCheckInPickerOpen(false);
                setCheckInDialogOpen(true);
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700">
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)}
`

### Step 7：复用 TaskCheckInDialog
`	sx
import { TaskCheckInDialog } from '@/components/CheckInDialog';

{checkInTask && (
  <TaskCheckInDialog
    open={checkInDialogOpen}
    onOpenChange={(o) => { setCheckInDialogOpen(o); if (!o) setCheckInTask(null); }}
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
        r.date === today ? { ...r, checkIns: refreshed, totalCount: refreshed.length } : r
      ));
      setCheckInTask(null);
    }}
  />
)}
`

## 验证

1. 
pm run build 通过
2. 启动 dev server 访问 /stats：
   - 进入即看到今天的详情面板
   - 「今日打卡」按钮可见
   - 点击后任务选择 modal 弹出
   - 选任务后 TaskCheckInDialog 弹出
   - 完成打卡后今日记录列表立即多一项
3. 点周历上其它日期 → 详情切换到该天，无「今日打卡」按钮
4. 上一周/下一周 → 智能保留/清空选中
5. 提交并推送 GitHub

## 风险

- 旧用户 localStorage 中已存的 loginDates: string[] 与新类型不兼容——已在最近提交中处理，本次改动不涉及 localStorage。
- active plan 为空时：任务选择 modal 显示「暂无任务」空态。
- 用户翻到未来周时：今天不在该周内，selectedDay 设为 null，详情不显示，无「今日打卡」按钮。