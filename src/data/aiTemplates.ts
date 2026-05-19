import { AIQuestion, CategoryId, QuadrantType, UserPlanTask } from '@/types';

interface CategoryQuestions {
  categoryId: CategoryId;
  questions: AIQuestion[];
  buildPlan: (answers: Record<string, string>) => { title: string; tasks: UserPlanTask[] };
}

export const CATEGORY_QUESTIONS: CategoryQuestions[] = [
  {
    categoryId: 'fitness',
    questions: [
      { key: 'dailyTime', question: '你每天能投入多少时间锻炼？', type: 'single',
        options: [{ label: '15-30 分钟', value: 'low' }, { label: '30-60 分钟', value: 'medium' }, { label: '1 小时以上', value: 'high' }] },
      { key: 'level', question: '你目前的运动水平如何？', type: 'single',
        options: [{ label: '几乎不运动', value: 'beginner' }, { label: '偶尔运动', value: 'basic' }, { label: '规律训练', value: 'intermediate' }, { label: '系统训练多年', value: 'advanced' }] },
      { key: 'goal', question: '你的主要目标是什么？', type: 'single',
        options: [{ label: '减脂塑形', value: 'fatloss' }, { label: '增肌增重', value: 'muscle' }, { label: '保持健康', value: 'health' }, { label: '提升运动表现', value: 'performance' }] },
      { key: 'style', question: '你更喜欢哪种锻炼方式？', type: 'single',
        options: [{ label: '健身房器械', value: 'gym' }, { label: '居家徒手', value: 'home' }, { label: '户外运动', value: 'outdoor' }, { label: '混合', value: 'mixed' }] },
      { key: 'daysPerWeek', question: '每周方便锻炼几天？', type: 'single',
        options: [{ label: '2 天', value: '2' }, { label: '3 天', value: '3' }, { label: '4 天', value: '4' }, { label: '5-6 天', value: '5' }] },
      { key: 'focus', question: '有什么特别想加强的部位吗？', type: 'single',
        options: [{ label: '全身均衡', value: 'full' }, { label: '上肢/核心', value: 'upper' }, { label: '下肢/臀部', value: 'lower' }, { label: '心肺耐力', value: 'cardio' }] },
    ],
    buildPlan: (answers) => {
      const goal = answers.goal || 'health';
      const days = answers.daysPerWeek || '3';
      const style = answers.style || 'mixed';
      return {
        title: goal === 'fatloss' ? '减脂塑形计划' : goal === 'muscle' ? '增肌训练计划' : '健康保持计划',
        tasks: [
          { id: 'f-1', name: `${days}天/周 核心训练`,
            learningRoute: [`📋 每周训练 ${days} 天`, '  • 力量训练 40 分钟', '  • 有氧运动 20 分钟', `  • 训练方式：${style === 'home' ? '徒手训练' : style === 'gym' ? '器械训练' : '混合训练'}`, `  • 重点加强：${answers.focus === 'full' ? '全身均衡' : answers.focus === 'upper' ? '上肢核心' : answers.focus === 'lower' ? '下肢臀部' : '心肺耐力'}`],
            resources: [{ name: 'Keep', url: 'https://www.gotokeep.com' }], quadrant: 'urgent-important' as QuadrantType },
          { id: 'f-2', name: '饮食与恢复',
            learningRoute: ['📋 饮食管理', '  • 蛋白质摄入充足', '  • 保证 7-8 小时睡眠', '  • 训练后拉伸 10 分钟'],
            resources: [{ name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com' }], quadrant: 'not-urgent-important' as QuadrantType },
        ],
      };
    },
  },
  {
    categoryId: 'coding',
    questions: [
      { key: 'dailyTime', question: '你每天能投入多少时间学习？', type: 'single',
        options: [{ label: '30 分钟以内', value: 'low' }, { label: '30-60 分钟', value: 'medium' }, { label: '1-2 小时', value: 'high' }, { label: '2 小时以上', value: 'fulltime' }] },
      { key: 'level', question: '你目前的编程水平如何？', type: 'single',
        options: [{ label: '零基础', value: 'beginner' }, { label: '了解基础语法', value: 'basic' }, { label: '能独立做项目', value: 'intermediate' }, { label: '高级/专业', value: 'advanced' }] },
      { key: 'goal', question: '学习编程的主要目标？', type: 'single',
        options: [{ label: '转行找工作', value: 'career' }, { label: '提升工作技能', value: 'upskill' }, { label: '做个人项目', value: 'project' }, { label: '兴趣探索', value: 'hobby' }] },
      { key: 'interest', question: '你更感兴趣的方向？', type: 'single',
        options: [{ label: '前端开发（网页/App）', value: 'frontend' }, { label: '后端/服务端', value: 'backend' }, { label: 'AI/数据科学', value: 'ai' }, { label: '移动端开发', value: 'mobile' }] },
      { key: 'studyStyle', question: '你更喜欢哪种学习方式？', type: 'single',
        options: [{ label: '视频教程', value: 'video' }, { label: '阅读文档/书籍', value: 'reading' }, { label: '动手做项目', value: 'hands-on' }, { label: '混合', value: 'mixed' }] },
      { key: 'availableDays', question: '每周哪几天比较方便学习？', type: 'single',
        options: [{ label: '工作日晚上', value: 'weekday' }, { label: '周末集中学', value: 'weekend' }, { label: '每天都可以', value: 'everyday' }, { label: '不固定', value: 'flexible' }] },
    ],
    buildPlan: (answers) => {
      const interest = answers.interest || 'frontend';
      const level = answers.level || 'beginner';
      return {
        title: interest === 'frontend' ? '前端开发入门计划' : interest === 'backend' ? '后端开发学习计划' : interest === 'ai' ? 'AI 数据科学计划' : '移动端开发计划',
        tasks: [
          { id: 'c-1', name: level === 'beginner' ? '编程基础入门' : '核心技能提升',
            learningRoute: [level === 'beginner' ? '📋 基础语法学习' : '📋 进阶知识学习', '  • 系统学习核心概念', '  • 每日编码练习 30 分钟', '  • 完成小练习巩固理解'],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 'c-2', name: `${interest === 'frontend' ? '前端框架' : interest === 'backend' ? '后端框架' : interest === 'ai' ? '数据科学工具' : '移动端框架'}实践`,
            learningRoute: ['📋 框架学习', '  • 学习主流框架/工具', '  • 阅读官方文档', '  • 搭建简单项目'],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 'c-3', name: '项目实战',
            learningRoute: ['📋 完成一个完整项目', '  • 需求分析', '  • 开发实现', '  • 部署上线'],
            quadrant: 'urgent-important' as QuadrantType },
        ],
      };
    },
  },
  {
    categoryId: 'english',
    questions: [
      { key: 'dailyTime', question: '你每天能投入多少时间学英语？', type: 'single',
        options: [{ label: '15-30 分钟', value: 'low' }, { label: '30-60 分钟', value: 'medium' }, { label: '1 小时以上', value: 'high' }] },
      { key: 'level', question: '你目前的英语水平如何？', type: 'single',
        options: [{ label: '初级（基础词汇）', value: 'beginner' }, { label: '中级（能日常交流）', value: 'intermediate' }, { label: '中高级（较流利）', value: 'advanced' }] },
      { key: 'goal', question: '学英语的主要目标？', type: 'single',
        options: [{ label: '日常交流', value: 'daily' }, { label: '工作/职场英语', value: 'business' }, { label: '考试（雅思/托福）', value: 'exam' }, { label: '出国旅游', value: 'travel' }] },
      { key: 'weakness', question: '你最想提升的方面？', type: 'single',
        options: [{ label: '口语表达', value: 'speaking' }, { label: '听力理解', value: 'listening' }, { label: '阅读能力', value: 'reading' }, { label: '写作能力', value: 'writing' }] },
      { key: 'habit', question: '你目前的英语学习习惯？', type: 'single',
        options: [{ label: '几乎不学', value: 'none' }, { label: '偶尔背单词', value: 'occasional' }, { label: '有规律学习', value: 'regular' }, { label: '每天都有接触', value: 'daily' }] },
    ],
    buildPlan: (answers) => {
      const goal = answers.goal || 'daily';
      const weakness = answers.weakness || 'speaking';
      const area = goal === 'business' ? '职场' : goal === 'exam' ? '备考' : goal === 'travel' ? '旅游' : '日常';
      return {
        title: `${area}英语提升计划`,
        tasks: [
          { id: 'e-1', name: `${weakness === 'speaking' ? '口语' : weakness === 'listening' ? '听力' : weakness === 'reading' ? '阅读' : '写作'}专项训练`,
            learningRoute: [`📋 重点提升${weakness === 'speaking' ? '口语' : weakness === 'listening' ? '听力' : weakness === 'reading' ? '阅读' : '写作'}`, '  • 每日 15 分钟专项练习', `  • 使用 ${area} 场景材料`, '  • 记录学习笔记'],
            resources: [{ name: '每日英语听力', url: 'https://www.eudic.net' }], quadrant: 'urgent-important' as QuadrantType },
          { id: 'e-2', name: `${area}场景词汇积累`,
            learningRoute: ['📋 场景词汇', `  • ${area}常用词汇学习`, '  • 场景对话练习', '  • 每周复习测试'],
            quadrant: 'not-urgent-important' as QuadrantType },
          { id: 'e-3', name: '实战练习',
            learningRoute: ['📋 每周实战', '  • 看英文视频/听播客', '  • 尝试用英语输出', '  • 记录学习心得'],
            resources: [{ name: 'YouGlish', url: 'https://youglish.com' }], quadrant: 'urgent-important' as QuadrantType },
        ],
      };
    },
  },
  {
    categoryId: 'exam',
    questions: [
      { key: 'dailyTime', question: '你每天能投入多少时间备考？', type: 'single',
        options: [{ label: '30 分钟以内', value: 'low' }, { label: '1-2 小时', value: 'medium' }, { label: '2-4 小时', value: 'high' }, { label: '4 小时以上', value: 'fulltime' }] },
      { key: 'level', question: '你对考试内容的掌握程度？', type: 'single',
        options: [{ label: '刚开始准备', value: 'beginner' }, { label: '了解大部分内容', value: 'intermediate' }, { label: '已经复习过一轮', value: 'advanced' }] },
      { key: 'goal', question: '你的备考目标？', type: 'single',
        options: [{ label: '通过考试', value: 'pass' }, { label: '拿到好成绩', value: 'good' }, { label: '冲刺高分', value: 'excellent' }] },
      { key: 'weakness', question: '你最薄弱的部分？', type: 'single',
        options: [{ label: '理论知识', value: 'theory' }, { label: '实践/案例分析', value: 'practice' }, { label: '做题速度', value: 'speed' }, { label: '全面均衡', value: 'balanced' }] },
      { key: 'deadline', question: '距离考试还有多久？', type: 'single',
        options: [{ label: '1 个月以内', value: 'urgent' }, { label: '1-3 个月', value: 'normal' }, { label: '3 个月以上', value: 'long' }] },
      { key: 'examType', question: '是什么类型的考试？', type: 'single',
        options: [{ label: '职业资格认证', value: 'cert' }, { label: '升学考试', value: 'academic' }, { label: '公务员/事业单位', value: 'civil' }, { label: '其他', value: 'other' }] },
    ],
    buildPlan: (answers) => {
      const deadline = answers.deadline || 'normal';
      return {
        title: '高效备考计划',
        tasks: [
          { id: 'ex-1', name: deadline === 'urgent' ? '冲刺复习' : '系统学习',
            learningRoute: deadline === 'urgent'
              ? ['📋 冲刺阶段', '  • 重点突破高频考点', '  • 做真题/模拟题', '  • 查漏补缺']
              : ['📋 基础阶段', '  • 系统学习教材', '  • 整理知识框架', '  • 标记薄弱环节'],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 'ex-2', name: '刷题训练',
            learningRoute: ['📋 刷题计划', '  • 每日定量练习', '  • 错题整理与反思', '  • 限时模拟训练'],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 'ex-3', name: '冲刺与复盘',
            learningRoute: ['📋 考前冲刺', '  • 回顾错题本', '  • 背诵记忆类内容', '  • 保持良好作息'],
            quadrant: 'not-urgent-important' as QuadrantType },
        ],
      };
    },
  },
  {
    categoryId: 'side',
    questions: [
      { key: 'dailyTime', question: '你每天能投入多少时间做副业？', type: 'single',
        options: [{ label: '30 分钟以内', value: 'low' }, { label: '30-60 分钟', value: 'medium' }, { label: '1-2 小时', value: 'high' }, { label: '2 小时以上', value: 'fulltime' }] },
      { key: 'skill', question: '你有哪些可用技能或资源？', type: 'single',
        options: [{ label: '技术开发能力', value: 'tech' }, { label: '设计/创意能力', value: 'design' }, { label: '写作/翻译能力', value: 'write' }, { label: '运营/营销能力', value: 'marketing' }] },
      { key: 'goal', question: '你做副业的主要目标？', type: 'single',
        options: [{ label: '增加收入', value: 'income' }, { label: '探索新方向', value: 'explore' }, { label: '发展个人品牌', value: 'brand' }, { label: '积累经验', value: 'experience' }] },
      { key: 'style', question: '你更喜欢哪种副业方式？', type: 'single',
        options: [{ label: '接单/自由职业', value: 'freelance' }, { label: '做内容/自媒体', value: 'content' }, { label: '做产品/SaaS', value: 'product' }, { label: '电商/带货', value: 'ecommerce' }] },
      { key: 'availableDays', question: '每周哪几天方便做副业？', type: 'single',
        options: [{ label: '工作日晚上', value: 'weekday' }, { label: '周末', value: 'weekend' }, { label: '每天都可以', value: 'everyday' }, { label: '不固定', value: 'flexible' }] },
    ],
    buildPlan: (answers) => {
      const style = answers.style || 'freelance';
      return {
        title: style === 'content' ? '自媒体运营计划' : style === 'freelance' ? '自由职业接单计划' : style === 'product' ? '独立产品开发计划' : '电商副业计划',
        tasks: [
          { id: 's-1', name: '准备与定位',
            learningRoute: ['📋 副业准备', `  • 明确方向：${style === 'content' ? '内容创作' : style === 'freelance' ? '技能接单' : style === 'product' ? '产品开发' : '电商运营'}`, '  • 制定阶段性目标', `  • 准备所需工具/资源`],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 's-2', name: '执行与输出',
            learningRoute: ['📋 日常执行', '  • 每日固定投入时间', '  • 持续输出/交付', '  • 记录进展与反馈'],
            quadrant: 'urgent-important' as QuadrantType },
          { id: 's-3', name: '复盘与优化',
            learningRoute: ['📋 每周复盘', '  • 分析数据/效果', '  • 调整策略', '  • 拓展新渠道'],
            quadrant: 'not-urgent-important' as QuadrantType },
        ],
      };
    },
  },
];
