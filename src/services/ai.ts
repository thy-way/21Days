// ============================================================
// MiniMax AI Plan Generation Service
// ============================================================
// ★★★ API Key 配置在项目根目录 .env 文件中 ★★★
// 创建 .env 文件并写入: VITE_MINIMAX_API_KEY=你的key
// ============================================================

import { AIQuestion, CategoryId, UserPlanTask } from '@/types';
import { CATEGORY_NAMES } from '@/constants/categories';

// >>> 在项目根目录 .env 文件中配置你的 key <<<
// VITE_MINIMAX_API_KEY=你的key
// 从 .env 读取 MiniMax API Key（.env 文件已在 .gitignore 中，不会被提交）
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY as string;

// MiniMax API 地址（通过 Vite proxy 避免 CORS）
// 开发时: /api/minimax → Vite proxy → https://api.minimax.io
// 部署时: 需添加 Vercel Serverless Function 或改用直连
const API_BASE_URL = '/api/minimax/v1/chat/completions';

function buildPrompt(
  categoryId: CategoryId,
  questions: AIQuestion[],
  answers: Record<string, string>,
): string {
  const qaText = questions
    .map((q) => `问题：${q.question}\n回答：${q.options.find((o) => o.value === answers[q.key])?.label || answers[q.key]}`)
    .join('\n');

  return `你是一个专业的学习计划生成助手。请根据用户的生活习惯和目标生成一个 21 天的个性化计划。

分类：${CATEGORY_NAMES[categoryId]}

用户信息：
${qaText}

请生成一个包含 3-6 个任务的详细学习计划，返回严格的 JSON 格式（不要包含任何其他文字）：

{
  "title": "计划标题（简洁明了）",
  "tasks": [
    {
      "id": "task-1",
      "name": "任务名称",
      "learningRoute": ["步骤1", "步骤2", "步骤3"],
      "quadrant": "优先选择其中一个：urgent-important | urgent-not-important | not-urgent-important | not-urgent-not-important",
      "resources": [
        { "name": "资源名称", "url": "https://..." }
      ]
    }
  ]
}

要求：
1. 每个任务要有详细的学习路线（数组，每个元素是一行内容）
2. 每个任务分配一个四象限类型
3. 任务数量 3-6 个
4. 计划要贴合用户的生活习惯、时间安排和能力水平
5. 不要使用任何日语或日文文字
6. 只返回 JSON，不要有任何额外的说明文字`;
}

function parsePlanResponse(raw: string): { title: string; tasks: UserPlanTask[] } {
  // 尝试提取 JSON
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI 返回格式异常，无法解析');
  }

  const data = JSON.parse(jsonMatch[0]);

  if (!data.title || !Array.isArray(data.tasks)) {
    throw new Error('AI 返回数据结构不完整');
  }

  return {
    title: data.title,
    tasks: data.tasks.map((t: any, i: number) => ({
      id: t.id || `task-${i + 1}-${Date.now()}`,
      name: t.name || `任务 ${i + 1}`,
      learningRoute: Array.isArray(t.learningRoute) ? t.learningRoute : [],
      resources: Array.isArray(t.resources) ? t.resources : [],
      quadrant: t.quadrant || 'not-urgent-important',
    })),
  };
}

export async function generatePlanFromAI(
  questions: AIQuestion[],
  answers: Record<string, string>,
  categoryId: CategoryId,
): Promise<{ title: string; tasks: UserPlanTask[] }> {
  const key = (MINIMAX_API_KEY as string);
  if (!key || key === '' || key === 'undefined') {
    throw new Error('请先在项目根目录创建 .env 文件，添加 VITE_MINIMAX_API_KEY=你的key');
  }

  const prompt = buildPrompt(categoryId, questions, answers);

  const body = {
    model: 'MiniMax-M2.7',
    messages: [
      { role: 'system', content: '你是一个专业的学习计划生成助手，请严格按照要求返回 JSON 格式数据。' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 0.9,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let response: Response;
  try {
    response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('API 请求超时（30秒），请检查网络或 API 地址');
    }
    throw new Error('网络请求失败: ' + err.message);
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errText = await response.text().catch(() => '未知错误');
    throw new Error(`API 请求失败 (${response.status}): ${errText}`);
  }

  const result = await response.json();

  // OpenAI 兼容格式
  const content = result.choices?.[0]?.message?.content || result.reply || result.text || '';

  if (!content) {
    throw new Error('API 返回内容为空');
  }

  return parsePlanResponse(content);
}
