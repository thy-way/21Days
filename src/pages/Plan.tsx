import React, { useState, useEffect } from "react";
import { useCheckInStore, usePlanStore } from "@/store";
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
} from "lucide-react";
import { cn } from "@/utils";
import { CATEGORY_STYLES } from "@/utils/categoryStyles";
import { AI_TEMPLATES } from "@/data/aiTemplates";
import {
  UserPlan,
  UserPlanTask,
  CategoryId,
  QuadrantType,
} from "@/types";

const QUADRANT_LABELS: Record<QuadrantType, string> = {
  "urgent-important": "重要紧急",
  "urgent-not-important": "紧急不重要",
  "not-urgent-important": "重要不紧急",
  "not-urgent-not-important": "不重要不紧急",
};

const QUADRANT_COLORS: Record<QuadrantType, string> = {
  "urgent-important": "bg-red-100 text-red-700 border-red-200",
  "urgent-not-important": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "not-urgent-important": "bg-blue-100 text-blue-700 border-blue-200",
  "not-urgent-not-important": "bg-gray-100 text-gray-700 border-gray-200",
};

const CATEGORY_NAMES: Record<CategoryId, string> = {
  fitness: "健身",
  coding: "编程学习",
  english: "英语",
  exam: "考试备考",
  side: "副业",
};

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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
      setSelectedTemplate(null);
      setAnswers({});
      setGenerated(null);
      setGenerating(false);
    }
  }, [open]);

  const templates = selectedCategory
    ? AI_TEMPLATES.filter((t) => t.categoryId === selectedCategory)
    : [];

  const currentTemplate = selectedTemplate
    ? AI_TEMPLATES.find((t) => t.id === selectedTemplate)
    : null;

  const handleCategorySelect = (cat: CategoryId) => {
    setSelectedCategory(cat);
    const tmpls = AI_TEMPLATES.filter((t) => t.categoryId === cat);
    if (tmpls.length === 1) {
      setSelectedTemplate(tmpls[0].id);
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    try {
      const { generateAIPlan } = usePlanStore.getState();
      const result = await generateAIPlan(selectedTemplate, answers);
      setGenerated(result);
      setStep(4);
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
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 bg-purple-50 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {step === 1 && "选择分类"}
              {step === 2 && "选择模板"}
              {step === 3 && "回答问题"}
              {step === 4 && "预览计划"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  s === step
                    ? "bg-blue-500 text-white"
                    : s < step
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {s < step ? "✓" : s}
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
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-100 bg-white hover:border-orange-200"
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
                    <span className="text-sm font-medium text-gray-800">
                      {CATEGORY_NAMES[cat]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Template selection */}
          {step === 2 && (
            <div className="space-y-3">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setStep(3);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-colors",
                    selectedTemplate === tmpl.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-100 bg-white hover:border-orange-200"
                  )}
                >
                  <h4 className="font-semibold text-gray-900">{tmpl.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {tmpl.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {tmpl.questions.length} 个问题
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Questions */}
          {step === 3 && currentTemplate && (
            <div className="space-y-5">
              {currentTemplate.questions.map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    {q.question}
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all",
                          answers[q.key] === opt.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:border-gray-200"
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
                              ? "border-blue-500"
                              : "border-gray-300"
                          )}
                        >
                          {answers[q.key] === opt.value && (
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && generated && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  计划标题
                </label>
                <input
                  type="text"
                  value={generated.title}
                  onChange={(e) =>
                    setGenerated({ ...generated, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          style?.bg || "bg-blue-500"
                        )}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-800 flex-1">
                        {idx + 1}. {task.name}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        任务名称
                      </label>
                      <input
                        type="text"
                        value={task.name}
                        onChange={(e) => updateTask(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
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
        <div className="sticky bottom-0 bg-white flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            取消
          </button>
          <div className="flex gap-2">
            {step === 3 && (
              <button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  !currentTemplate ||
                  currentTemplate.questions.some((q) => !answers[q.key])
                }
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            {step === 4 && (
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
  const [categoryId, setCategoryId] = useState<CategoryId>("coding");
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
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Plus className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEdit ? "编辑计划" : "自定义计划"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              计划标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入计划标题"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as CategoryId)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(CATEGORY_NAMES) as CategoryId[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_NAMES[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="计划描述..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                任务列表 *
              </label>
              <button
                onClick={addTask}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
              >
                <Plus className="w-3.5 h-3.5" />
                添加任务
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      任务 {idx + 1}
                    </span>
                    <button
                      onClick={() => removeTask(idx)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      任务名称 *
                    </label>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) =>
                        updateTaskField(idx, "name", e.target.value)
                      }
                      placeholder="输入任务名称"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-xs font-medium text-gray-500">
                        资源（可选）
                      </label>
                      <button
                        onClick={() => addResource(idx)}
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
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
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={res.url || ""}
                          onChange={(e) =>
                            updateResource(idx, ri, "url", e.target.value)
                          }
                          placeholder="链接（可选）"
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="text-center py-8 text-gray-400 text-sm">
                  暂无任务，点击"添加任务"开始
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
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
  const style = CATEGORY_STYLES[plan.categoryId];

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-shadow">
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
              {CATEGORY_NAMES[plan.categoryId].charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">
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
                  {CATEGORY_NAMES[plan.categoryId]}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    plan.type === "ai-generated"
                      ? "bg-purple-50 text-purple-600"
                      : "bg-amber-50 text-amber-600"
                  )}
                >
                  {plan.type === "ai-generated" ? "AI" : "自定义"}
                </span>
                <span className="text-xs text-gray-400">
                  {plan.tasks.length} 个任务
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
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (plan.id) onDelete(plan.id);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-2">
          {plan.description && (
            <p className="text-sm text-gray-500 mb-2">{plan.description}</p>
          )}
          {plan.tasks.map((task, idx) => (
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
                  <span className="text-sm font-medium text-gray-800">
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
                  <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {task.learningRoute.slice(0, 2).join(" | ")}
                  </div>
                )}
                {task.resources && task.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {task.resources.map((r, ri) => (
                      <span
                        key={ri}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs"
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

interface LearningRouteCardProps {
  title: string;
  route: string[];
  resources?: { name: string; url?: string }[];
}

const LearningRouteCard: React.FC<LearningRouteCardProps> = ({
  title,
  route,
  resources,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-800 truncate">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {route.map((line, index) => (
              <p
                key={index}
                className={cn(
                  "text-sm leading-relaxed",
                  (line.startsWith("Week") ||
                    line.startsWith("第") ||
                    line.startsWith("📋") ||
                    line.startsWith("📦") ||
                    line.startsWith("🛒") ||
                    line.startsWith("🔒") ||
                    line.startsWith("🚀") ||
                    line.startsWith("📊") ||
                    line.startsWith("📈") ||
                    line.startsWith("🎛") ||
                    line.startsWith("☁") ||
                    line.startsWith("🎯") ||
                    line.startsWith("🤖") ||
                    line.startsWith("⚡"))
                    ? "font-semibold text-gray-800"
                    : "text-gray-600"
                )}
              >
                {line || " "}
              </p>
            ))}
          </div>
          {resources && resources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resources.map(
                (r, ri) =>
                  r.url && (
                    <a
                      key={ri}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
                    >
                      {r.name}
                    </a>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Plan: React.FC = () => {
  const { plans, loading, loadPlans, deletePlan } = usePlanStore();
  const { tasks, categories } = useCheckInStore();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<UserPlan | null>(null);
  const [routesExpanded, setRoutesExpanded] = useState(false);
  const [selectedRouteCategory, setSelectedRouteCategory] =
    useState<string>("all");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const filteredRouteTasks =
    selectedModule !== "all"
      ? tasks.filter((t) => t.categoryId === selectedModule && t.learningRoute && t.learningRoute.length > 0)
      : selectedRouteCategory === "all"
        ? tasks.filter((t) => t.learningRoute && t.learningRoute.length > 0)
        : tasks.filter(
            (t) =>
              t.categoryId === selectedRouteCategory &&
              t.learningRoute &&
              t.learningRoute.length > 0
          );

  const routeTasksByCategory = filteredRouteTasks.reduce((acc, task) => {
    if (!acc[task.categoryId]) {
      acc[task.categoryId] = [];
    }
    acc[task.categoryId].push(task);
    return acc;
  }, {} as Record<string, typeof filteredRouteTasks>);

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
    const category = categories.find((c) => c.id === categoryId);
    return category?.gradient || "bg-blue-500";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              {"学习计划"}
            </h1>
            <p className="text-gray-500 mt-1">
              {"管理你的学习计划和路线"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiDialogOpen(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI {"生成"}</span>
            </button>
            <button
              onClick={() => {
                setEditPlan(null);
                setCustomDialogOpen(true);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{"自定义"}</span>
            </button>
          </div>
        </div>

        {/* Module Tab Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setSelectedModule("all")}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              selectedModule === "all" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200"
            )}>
            全部
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedModule(cat.id)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                selectedModule === cat.id ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200"
              )}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtered Plans */}
        {plans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              {"我的计划"}
              <span className="text-sm font-normal text-gray-400 ml-1">
                ({plans.length})
              </span>
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{"加载中..."}</p>
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

        {/* Built-in Routes Section */}
        <div className="mb-8">
          <button
            onClick={() => setRoutesExpanded(!routesExpanded)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-900">{"内置学习路线"}</h2>
                <p className="text-sm text-gray-500">
                  {"系统预设的各类学习路线参考"}
                </p>
              </div>
            </div>
            {routesExpanded ? (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-400" />
            )}
          </button>

          {routesExpanded && (
            <div className="mt-4">
              {/* Category filter - only show when "全部" module selected */}
              {selectedModule === "all" && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedRouteCategory("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                    selectedRouteCategory === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200"
                  )}
                >
                  {"全部"}
                </button>
                {categories.map((cat) => {
                  const style = CATEGORY_STYLES[cat.id];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedRouteCategory(cat.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                        selectedRouteCategory === cat.id
                          ? cn(style.bg, "text-white")
                          : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200"
                      )}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
              )}

              {/* Tasks by category */}
              {Object.entries(routeTasksByCategory).map(
                ([categoryId, categoryTasks]) => {
                  return (
                    <div key={categoryId} className="mb-6">
                      <div
                        className={cn(
                          "flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-white text-sm font-semibold",
                          getCategoryColor(categoryId)
                        )}
                      >
                        <BookOpen className="w-4 h-4" />
                        {getCategoryName(categoryId)}
                        <span className="ml-auto text-xs opacity-80">
                          {categoryTasks.length} {"个路线"}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {categoryTasks.map((task) => (
                          <LearningRouteCard
                            key={task.id}
                            title={task.name}
                            route={task.learningRoute || []}
                            resources={task.resources}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              )}

              {filteredRouteTasks.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{"暂无学习路线"}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty state */}
        {plans.length === 0 && !routesExpanded && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {"还没有学习计划"}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {"使用 AI 生成或自定义创建你的第一个计划"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setAiDialogOpen(true)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI {"生成"}
              </button>
              <button
                onClick={() => {
                  setEditPlan(null);
                  setCustomDialogOpen(true);
                }}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm border border-gray-200"
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
