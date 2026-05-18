import { create } from 'zustand';
import { db } from '../db';
import { UserPlan, UserPlanTask, CategoryId } from '../types';
import { AI_TEMPLATES } from '../data/aiTemplates';
import { generatePlanFromAI } from '../services/ai';

interface PlanState {
  plans: UserPlan[];
  loading: boolean;
  loadPlans: () => Promise<void>;
  createPlan: (plan: UserPlan) => Promise<void>;
  updatePlan: (id: number, updates: Partial<UserPlan>) => Promise<void>;
  deletePlan: (id: number) => Promise<void>;
  getTemplatesByCategory: (categoryId: CategoryId) => typeof AI_TEMPLATES;
  generateAIPlan: (templateId: string, answers: Record<string, string>) => Promise<{ title: string; tasks: UserPlanTask[] }>;
  createCustomPlan: () => UserPlan;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  loading: false,

  loadPlans: async () => {
    set({ loading: true });
    const plans = await db.userPlans.orderBy('createdAt').reverse().toArray();
    set({ plans, loading: false });
  },

  createPlan: async (plan: UserPlan) => {
    const now = Date.now();
    const newPlan = { ...plan, createdAt: now, updatedAt: now };
    await db.userPlans.add(newPlan);
    await get().loadPlans();
  },

  updatePlan: async (id: number, updates: Partial<UserPlan>) => {
    await db.userPlans.update(id, { ...updates, updatedAt: Date.now() });
    await get().loadPlans();
  },

  deletePlan: async (id: number) => {
    await db.userPlans.delete(id);
    await get().loadPlans();
  },

  getTemplatesByCategory: (categoryId: CategoryId) => {
    return AI_TEMPLATES.filter(t => t.categoryId === categoryId);
  },

  generateAIPlan: async (templateId: string, answers: Record<string, string>) => {
    const template = AI_TEMPLATES.find(t => t.id === templateId);
    if (!template) return { title: '默认计划', tasks: [] };
    try {
      const result = await generatePlanFromAI(template, answers, template.categoryId);
      return result;
    } catch (err: any) {
      console.warn('AI API 调用失败，使用本地模板生成:', err.message);
      return template.generatePlan(answers);
    }
  },

  createCustomPlan: () => {
    return {
      title: '',
      categoryId: 'coding' as CategoryId,
      type: 'custom' as const,
      description: '',
      isActive: true,
      tasks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },
}));