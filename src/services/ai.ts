// ============================================================
// MiniMax AI Plan Generation Service
// ============================================================
// ★★★ 在下面第12行填写你的 MiniMax API Key ★★★
// ============================================================

import { AITemplate, CategoryId, UserPlanTask } from '@/types';

// >>> 把 YOUR_MINIMAX_API_KEY_HERE 替换为你的 key <<<
const MINIMAX_API_KEY = 'sk-cp-wwq7bF1PzEpZkWDX6euEIsL55ic2K9qP7O2Qahwi0_-NbuQRZRYlI9O1q2eGGGLt-_zL-GwH6ui0SZ5L_F2hl5FuKi0xbdDMxqzwvfMJZ2FYxrq3S3aJ2aA';

// MiniMax API 地址（通过 Vite proxy 避免 CORS）
// 开发时: /api/minimax → Vite proxy → https://api.minimax.io
// 部署时: 需添加 Vercel Serverless Function 或改用直连
const API_BASE_URL = '/api/minimax/v1/chat/completions';

const CATEGORY_NAMES: Record<CategoryId, string> = {
  fitness: '健身',
  coding: '编程学习',
  english: '英语',
  exam: '考试备考',
  side: '副业',
};

function buildPrompt(
  categoryId: CategoryId,
  questions: AITemplate['questions'],
  answers: Record<string, string>,
): string {
  const qaText = questions
    .map((q) => `问题：${q.question}\n回答：${q.options.find((o) => o.value === answers[q.key])?.label || answers[q.key]}`)
    .join('\n');

  return `你是一个专业的学习计划生成助手。请根据以下信息生成一个 21 天的学习计划。

分类：${CATEGORY_NAMES[categoryId]}

用户问答记录：
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
4. 计划要贴合用户的实际水平和时间投入
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
  template: AITemplate,
  answers: Record<string, string>,
  categoryId: CategoryId,
): Promise<{ title: string; tasks: UserPlanTask[] }> {
  const key = (MINIMAX_API_KEY as string);
  if (!key || key === '' || key.startsWith('YOUR_')) {
    throw new Error('请先在 src/services/ai.ts 第10行配置有效的 MiniMax API Key');
  }

  const prompt = buildPrompt(categoryId, template.questions, answers);

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
