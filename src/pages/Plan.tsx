import React, { useState, useEffect } from "react";
import { usePlanStore } from "@/store";
import {
  Brain,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Target,
  BookOpen,
  Save,
  X,
  Sparkles,
  ChevronLeft,
  Check,
} from "lucide-react";
import { cn } from "@/utils";
import { CATEGORY_STYLES, getCategoryStyles } from "@/utils/categoryStyles";
import { CATEGORY_QUESTIONS } from "@/data/aiTemplates";
import { CATEGORY_NAMES, QUADRANT_LABELS, QUADRANT_COLORS } from "@/constants/categories";
import {
  UserPlan,
  UserPlanTask,
  CategoryId,
  QuadrantType,
} from "@/types";

interface AIGenerateDialogProps {
  open: boolean;
  onClose: () => void;
}

const AIGenerateDialog: React.FC<AIGenerateDialogProps> = ({
  open,
  onClose,
}) => {
  const { createPlan } = usePlanStore();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<{
    title: string;
    tasks: UserPlanTask[];
  } | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedCategory(null);
      setAnswers({});
      setGenerated(null);
      setGenerating(false);
    }
  }, [open]);

  const currentCategory = selectedCategory
    ? CATEGORY_QUESTIONS.find((c) => c.categoryId === selectedCategory)
    : null;

  const handleCategorySelect = (cat: CategoryId) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    setGenerating(true);
    try {
      const { generateAIPlan } = usePlanStore.getState();
      const result = await generateAIPlan(selectedCategory, answers);
      setGenerated(result);
      setStep(3);
    } catch (err: any) {
      alert('生成失败：' + (err.message || '未知错误'));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated || !selectedCategory) return;
    const now = Date.now();
    await createPlan({
      title: generated.title,
      categoryId: selectedCategory,
      type: "ai-generated",
      description: "",
      isActive: true,
      tasks: generated.tasks,
      createdAt: now,
      updatedAt: now,
    });
    onClose();
  };

  const updateTask = (
    index: number,
    field: keyof UserPlanTask,
    value: string | string[] | QuadrantType
  ) => {
    if (!generated) return;
    const tasks = [...generated.tasks];
    tasks[index] = { ...tasks[index], [field]: value };
    setGenerated({ ...generated, tasks });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 bg-orange-50 dark:bg-orange-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {step === 1 && "选择分类"}
              {step === 2 && "回答生活习惯"}
              {step === 3 && "预览计划"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    s === step
                      ? "bg-orange-500 text-white"
                      : s < step
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500"
                )}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>

          {/* Step 1: Category selection */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(CATEGORY_STYLES) as CategoryId[]).map((cat) => {
                const style = CATEGORY_STYLES[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                      selectedCategory === cat
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/20"
                        : "border-gray-100 dark:border-gray-600 bg-white dark:bg-slate-800 hover:border-orange-200 dark:hover:border-orange-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold",
                        style.bg
                      )}
                    >
                      {CATEGORY_NAMES[cat].charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {CATEGORY_NAMES[cat]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Lifestyle Questions */}
          {step === 2 && currentCategory && (
            <div className="space-y-5">
              {currentCategory.questions.map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {q.question}
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all",
                          answers[q.key] === opt.value
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-500/20"
                            : "border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500"
                        )}
                      >
                        <input
                          type="radio"
                          name={q.key}
                          value={opt.value}
                          checked={answers[q.key] === opt.value}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              [q.key]: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
                            answers[q.key] === opt.value
                              ? "border-orange-500"
                              : "border-gray-300 dark:border-gray-500"
                          )}
                        >
                          {answers[q.key] === opt.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && generated && (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  计划标题
                </label>
                <input
                  type="text"
                  value={generated.title}
                  onChange={(e) =>
                    setGenerated({ ...generated, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              {generated.tasks.map((task, idx) => {
                const style = selectedCategory
                  ? CATEGORY_STYLES[selectedCategory]
                  : null;
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "rounded-2xl border p-4 space-y-3",
                      style?.border || "border-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                          style?.bg || "bg-orange-500"
                        )}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex-1">
                        {idx + 1}. {task.name}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        任务名称
                      </label>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        学习路线
                      </label>
                      <textarea
                        value={task.learningRoute.join("\\n")}
                        onChange={(e) =>
                          updateTask(
                            idx,
                            "learningRoute",
                            e.target.value.split("\\n")
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        四象限
                      </label>
                      <select
                        value={task.quadrant || ""}
                        onChange={(e) =>
                          updateTask(
                            idx,
                            "quadrant",
                            e.target.value as QuadrantType
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">未分配</option>
                        {(Object.keys(QUADRANT_LABELS) as QuadrantType[]).map(
                          (q) => (
                            <option key={q} value={q}>
                              {QUADRANT_LABELS[q]}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {task.resources && task.resources.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          资源
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {task.resources.map((r, ri) => (
                            <span
                              key={ri}
                              className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs"
                            >
                              {r.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
          >
            取消
          </button>
          <div className="flex gap-2">
            {step === 2 && (
              <button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  !currentCategory ||
                  currentCategory.questions.some((q) => !answers[q.key])
                }
                className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    生成计划
                  </>
                )}
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存计划
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CustomPlanDialogProps {
  open: boolean;
  onClose: () => void;
  editPlan?: UserPlan | null;
}

const CustomPlanDialog: React.FC<CustomPlanDialogProps> = ({
  open,
  onClose,
  editPlan,
}) => {
  const { createPlan, updatePlan } = usePlanStore();
  const isEdit = !!editPlan;

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<UserPlanTask[]>([]);

  useEffect(() => {
    if (open) {
      if (editPlan) {
        setTitle(editPlan.title);
        setCategoryId(editPlan.categoryId);
        setDescription(editPlan.description || "");
        setTasks(editPlan.tasks.map((t) => ({ ...t })));
      } else {
        setTitle("");
        setCategoryId("coding");
        setDescription("");
        setTasks([]);
      }
    }
  }, [open, editPlan]);

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: "",
        learningRoute: [],
        resources: [],
      },
    ]);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTaskField = (
    index: number,
    field: keyof UserPlanTask,
    value: string | string[] | QuadrantType
  ) => {
    setTasks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addResource = (index: number) => {
    setTasks((prev) => {
      const next = [...prev];
      const resources = next[index].resources || [];
      next[index] = {
        ...next[index],
        resources: [...resources, { name: "", url: "" }],
      };
      return next;
    });
  };

  const updateResource = (
    taskIndex: number,
    resIndex: number,
    field: "name" | "url",
    value: string
  ) => {
    setTasks((prev) => {
      const next = [...prev];
      const resources = [...(next[taskIndex].resources || [])];
      resources[resIndex] = { ...resources[resIndex], [field]: value };
      next[taskIndex] = { ...next[taskIndex], resources };
      return next;
    });
  };

  const removeResource = (taskIndex: number, resIndex: number) => {
    setTasks((prev) => {
      const next = [...prev];
      const resources = next[taskIndex].resources || [];
      next[taskIndex] = {
        ...next[taskIndex],
        resources: resources.filter((_, i) => i !== resIndex),
      };
      return next;
    });
  };

  const handleSave = async () => {
    if (!title.trim() || tasks.length === 0) return;
    const now = Date.now();
    if (isEdit && editPlan?.id) {
      await updatePlan(editPlan.id, {
        title: title.trim(),
        categoryId,
        description: description.trim(),
        tasks,
      });
    } else {
      await createPlan({
        title: title.trim(),
        categoryId,
        type: "custom",
        description: description.trim(),
        isActive: true,
        tasks,
        createdAt: now,
        updatedAt: now,
      });
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEdit ? "编辑计划" : "自定义计划"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              计划标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入计划标题"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              分类
            </label>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="输入分类名称（如：学习、健身、工作）"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="计划描述..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                任务列表 *
              </label>
              <button
                onClick={addTask}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                添加任务
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      任务 {idx + 1}
                    </span>
                    <button
                      onClick={() => removeTask(idx)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      任务名称 *
                    </label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) =>
                        updateTaskField(idx, "name", e.target.value)
                      }
                      placeholder="输入任务名称"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      学习路线
                    </label>
                    <textarea
                      value={task.learningRoute.join("\\n")}
                      onChange={(e) =>
                        updateTaskField(
                          idx,
                          "learningRoute",
                          e.target.value.split("\\n")
                        )
                      }
                      placeholder="每行一个学习步骤"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      四象限
                    </label>
                    <select
                      value={task.quadrant || ""}
                      onChange={(e) =>
                        updateTaskField(
                          idx,
                          "quadrant",
                          e.target.value as QuadrantType
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">未分配</option>
                      {(Object.keys(QUADRANT_LABELS) as QuadrantType[]).map(
                        (q) => (
                          <option key={q} value={q}>
                            {QUADRANT_LABELS[q]}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                        资源（可选）
                      </label>
                      <button
                        onClick={() => addResource(idx)}
                        className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium"
                      >
                        + 添加
                      </button>
                    </div>
                    {(task.resources || []).map((res, ri) => (
                      <div key={ri} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={res.name}
                          onChange={(e) =>
                            updateResource(idx, ri, "name", e.target.value)
                          }
                          placeholder="资源名称"
                          className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          value={res.url || ""}
                          onChange={(e) =>
                            updateResource(idx, ri, "url", e.target.value)
                          }
                          placeholder="链接（可选）"
                          className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => removeResource(idx, ri)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                  暂无任务，点击"添加任务"开始
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-800 flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || tasks.length === 0}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "保存修改" : "创建计划"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PlanCardProps {
  plan: UserPlan;
  onEdit: (plan: UserPlan) => void;
  onDelete: (id: number) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const style = getCategoryStyles(plan.categoryId);
  const getCategoryName = (catId: string) => {
    return CATEGORY_NAMES[catId as CategoryId] || catId;
  };

  const uniqueTasks = React.useMemo(
    () => plan.tasks.filter((t, i, arr) => arr.findIndex((x) => x.name === t.name) === i),
    [plan.tasks]
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-card-hover transition-shadow">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0",
                style.bg
              )}
            >
              {getCategoryName(plan.categoryId).charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate">
                {plan.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    style.bgLight,
                    style.text
                  )}
                >
                  {getCategoryName(plan.categoryId)}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    plan.type === "ai-generated"
                      ? "bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      : "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {plan.type === "ai-generated" ? "AI" : "自定义"}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {uniqueTasks.length} 个任务
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(plan);
              }}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (plan.id) onDelete(plan.id);
              }}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-2">
          {plan.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{plan.description}</p>
          )}
          {uniqueTasks.map((task, idx) => (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border",
                style.border
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
                  style.bg
                )}
              >
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {task.name}
                  </span>
                  {task.quadrant && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs border",
                        QUADRANT_COLORS[task.quadrant]
                      )}
                    >
                      {QUADRANT_LABELS[task.quadrant]}
                    </span>
                  )}
                </div>
                {task.learningRoute && task.learningRoute.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {task.learningRoute.slice(0, 2).join(" | ")}
                  </div>
                )}
                {task.resources && task.resources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {task.resources.map((r, ri) => (
                      <span
                        key={ri}
                        className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded text-xs"
                      >
                        {r.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Plan: React.FC = () => {
  const { plans, loading, loadPlans, deletePlan } = usePlanStore();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<UserPlan | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const plansByCategory = plans.reduce((acc, plan) => {
    if (selectedModule !== "all" && plan.categoryId !== selectedModule) return acc;
    if (!acc[plan.categoryId]) {
      acc[plan.categoryId] = [];
    }
    acc[plan.categoryId].push(plan);
    return acc;
  }, {} as Record<string, UserPlan[]>);

  const handleEdit = (plan: UserPlan) => {
    setEditPlan(plan);
    setCustomDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除此计划吗？")) {
      await deletePlan(id);
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const style = CATEGORY_STYLES[categoryId as CategoryId];
    return style?.gradient || "brand-gradient";
  };

  const getCategoryName = (categoryId: string) => {
    return CATEGORY_NAMES[categoryId as CategoryId] || categoryId;
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="brand-text-gradient">21Days</span>
              </div>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiDialogOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI 生成</span>
            </button>
            <button
              onClick={() => {
                setEditPlan(null);
                setCustomDialogOpen(true);
              }}
              className="px-4 py-2 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">自定义</span>
            </button>
          </div>
        </div>

        {/* Module Tab Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setSelectedModule("all")}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              selectedModule === "all" ? "bg-orange-500 text-white" : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-600"
            )}>
            全部
          </button>
          {(Object.keys(CATEGORY_NAMES) as CategoryId[]).map((catId) => (
            <button key={catId} onClick={() => setSelectedModule(catId)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                selectedModule === catId ? "bg-orange-500 text-white" : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-600"
              )}>
              {CATEGORY_NAMES[catId]}
            </button>
          ))}
        </div>

        {/* Filtered Plans */}
        {plans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              我的计划
              <span className="text-sm font-normal text-amber-500 ml-1">
                ({plans.length})
              </span>
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">{"加载中..."}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(plansByCategory).map(
                  ([categoryId, categoryPlans]) => (
                    <div key={categoryId}>
                      <div
                        className={cn(
                          "flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-white text-sm font-semibold",
                          getCategoryColor(categoryId)
                        )}
                      >
                        <Target className="w-4 h-4" />
                        {getCategoryName(categoryId)}
                        <span className="ml-auto text-xs opacity-80">
                          {categoryPlans.length} {"个计划"}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {categoryPlans.map((plan) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {plans.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {"还没有学习计划"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {"使用 AI 生成或自定义创建你的第一个计划"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setAiDialogOpen(true)}
                className="px-5 py-3 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI {"生成"}
              </button>
              <button
                onClick={() => {
                  setEditPlan(null);
                  setCustomDialogOpen(true);
                }}
                className="px-5 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <Plus className="w-4 h-4" />
                {"自定义创建"}
              </button>
            </div>
          </div>
        )}
      </div>

      <AIGenerateDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
      />
      <CustomPlanDialog
        open={customDialogOpen}
        onClose={() => {
          setCustomDialogOpen(false);
          setEditPlan(null);
        }}
        editPlan={editPlan}
      />
    </div>
  );
};

export default Plan;
