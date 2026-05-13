import { AITemplate, QuadrantType } from '@/types';

export const AI_TEMPLATES: AITemplate[] = [
  // ======= 编程学习 =======
  {
    id: 'coding-frontend',
    categoryId: 'coding',
    name: '前端入门',
    description: '从零开始学习前端开发，掌握 React/Vue 框架',
    questions: [
      {
        key: 'level', question: '你的前端基础如何？', type: 'single',
        options: [
          { label: '零基础', value: 'beginner' },
          { label: '有 HTML/CSS 基础', value: 'basic' },
          { label: '有框架使用经验', value: 'experienced' },
        ],
      },
      {
        key: 'goal', question: '学习目标是什么？', type: 'single',
        options: [
          { label: '找工作/转行', value: 'career' },
          { label: '做个人项目', value: 'project' },
          { label: '兴趣了解', value: 'hobby' },
        ],
      },
      {
        key: 'framework', question: '偏好的前端框架？', type: 'single',
        options: [
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
          { label: '不确定', value: 'undecided' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '< 5 小时', value: 'low' },
          { label: '5-10 小时', value: 'medium' },
          { label: '10-20 小时', value: 'high' },
          { label: '20 小时+', value: 'fulltime' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level, goal, framework, hours } = answers;
      const isReact = framework === 'react' || framework === 'undecided';
      const dur = hours === 'fulltime' ? '2' : hours === 'high' ? '3' : '4';
      const tasks = [];

      if (level !== 'experienced') {
        tasks.push({
          id: 'ft-1', name: 'HTML + CSS 基础（' + dur + '周）',
          learningRoute: [
            '📋 第1周：HTML5 核心语义',
            '  • 语义化标签：header/nav/main/section/article',
            '  • 表单与验证：input 类型、表单验证 API',
            '  • 多媒体：video/audio 标签与 API',
            '',
            '📋 第2周：CSS3 布局与样式',
            '  • Flexbox 弹性布局：主轴/交叉轴、对齐方式',
            '  • Grid 网格布局：grid-template、grid-area',
            '  • CSS 动画：transition/animation/keyframes',
            '  • 响应式设计：media query、移动端适配',
          ],
          resources: [
            { name: 'MDN HTML 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML' },
            { name: 'CSS Flexbox 教程', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
          ],
          quadrant: 'not-urgent-important' as QuadrantType,
        });
      }

      tasks.push({
        id: 'ft-2', name: 'JavaScript 核心（' + dur + '周）',
        learningRoute: [
          '📋 第1周：JS 基础语法',
          '  • 变量/作用域/闭包',
          '  • this/call/apply/bind',
          '  • 原型链与继承',
          '',
          '📋 第2周：ES6+ 新特性',
          '  • Promise/async-await',
          '  • 模块化：ES Module',
          '  • 解构/展开/可选链',
        ],
        resources: [
          { name: 'MDN JavaScript', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
        ],
        quadrant: 'not-urgent-important' as QuadrantType,
      });

      const fw = isReact ? 'React' : 'Vue';
      tasks.push({
        id: 'ft-3', name: fw + ' 框架入门（' + dur + '周）',
        learningRoute: [
          '📋 第1周：' + fw + ' 核心概念',
          '  • 组件化开发：props/state/生命周期',
          '  • ' + (isReact ? 'Hooks：useState/useEffect/useMemo' : '响应式：ref/reactive/computed'),
          '  • 路由：' + (isReact ? 'React Router' : 'Vue Router'),
          '',
          '📋 第2周：进阶开发',
          '  • 状态管理：' + (isReact ? 'Zustand/Redux' : 'Pinia'),
          '  • UI 框架：Ant Design / Element Plus',
          '  • 前后端交互：Axios/fetch',
        ],
        resources: [
          { name: fw + ' 文档', url: isReact ? 'https://react.dev' : 'https://vuejs.org' },
        ],
        quadrant: 'urgent-important' as QuadrantType,
      });

      if (goal !== 'hobby') {
        tasks.push({
          id: 'ft-4', name: '项目实战',
          learningRoute: [
            '🚀 实战项目：个人博客 / 管理系统 / 电商页面',
            '  • 需求分析与技术选型',
            '  • 组件拆分与目录结构设计',
            '  • API 对接与数据流管理',
            '  • 打包部署：Vercel/Netlify',
          ],
          resources: [{ name: 'Vercel', url: 'https://vercel.com' }],
          quadrant: 'urgent-important' as QuadrantType,
        });
      }

      return { title: '前端 ' + fw + ' 入门计划', tasks };
    },
  },
  {
    id: 'coding-python',
    categoryId: 'coding',
    name: 'Python 全栈',
    description: '从 Python 基础到 Web 开发/数据分析',
    questions: [
      {
        key: 'level', question: '你的编程基础如何？', type: 'single',
        options: [
          { label: '零基础', value: 'beginner' },
          { label: '有其他语言基础', value: 'basic' },
          { label: '有 Python 基础', value: 'intermediate' },
        ],
      },
      {
        key: 'direction', question: '学习方向？', type: 'single',
        options: [
          { label: 'Web 开发', value: 'web' },
          { label: '数据分析/AI', value: 'data' },
          { label: '自动化脚本', value: 'automation' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '< 5 小时', value: 'low' },
          { label: '5-10 小时', value: 'medium' },
          { label: '10-20 小时', value: 'high' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level, direction, hours } = answers;
      const dur = hours === 'high' ? '2' : '3';
      const tasks = [];

      if (level !== 'intermediate') {
        tasks.push({
          id: 'py-1', name: 'Python 基础语法（' + dur + '周）',
          learningRoute: [
            '📋 语法速通',
            '  • 基础数据类型与容器',
            '  • 函数/类/模块',
            '  • 文件操作与异常处理',
          ],
          resources: [{ name: 'Python 官方文档', url: 'https://docs.python.org/3/' }],
          quadrant: 'not-urgent-important' as QuadrantType,
        });
      }

      if (direction === 'web') {
        tasks.push({
          id: 'py-2', name: 'Web 框架（' + dur + '周）',
          learningRoute: [
            '📋 Flask/FastAPI 入门',
            '  • 路由与中间件',
            '  • 数据库 ORM：SQLAlchemy',
            '  • RESTful API 设计',
            '',
            '📋 项目实战',
            '  • 用户认证与权限',
            '  • 部署：Docker + Nginx',
          ],
          resources: [{ name: 'FastAPI 文档', url: 'https://fastapi.tiangolo.com/' }],
          quadrant: 'urgent-important' as QuadrantType,
        });
      } else if (direction === 'data') {
        tasks.push({
          id: 'py-2', name: '数据分析（' + dur + '周）',
          learningRoute: [
            '📋 Pandas/NumPy',
            '  • 数据清洗与预处理',
            '  • 数据可视化 Matplotlib',
            '',
            '📋 机器学习入门',
            '  • Scikit-learn 基础',
            '  • 分类/回归/聚类',
          ],
          resources: [
            { name: 'Pandas 文档', url: 'https://pandas.pydata.org/' },
            { name: 'Kaggle 入门', url: 'https://www.kaggle.com/learn' },
          ],
          quadrant: 'urgent-important' as QuadrantType,
        });
      } else {
        tasks.push({
          id: 'py-2', name: '自动化脚本（' + dur + '周）',
          learningRoute: [
            '📋 实用工具开发',
            '  • 文件批量处理',
            '  • 爬虫入门：requests/BeautifulSoup',
            '  • 定时任务与邮件通知',
          ],
          resources: [{ name: 'Requests 文档', url: 'https://docs.python-requests.org/' }],
          quadrant: 'urgent-important' as QuadrantType,
        });
      }

      const dn = direction === 'web' ? 'Web开发' : direction === 'data' ? '数据分析' : '自动化';
      return { title: 'Python ' + dn + '学习计划', tasks };
    },
  },
  {
    id: 'coding-go',
    categoryId: 'coding',
    name: 'Go 后端',
    description: '从 Go 基础到微服务开发',
    questions: [
      {
        key: 'level', question: '你的编程基础如何？', type: 'single',
        options: [
          { label: '有其他语言基础', value: 'basic' },
          { label: '有 Go 基础', value: 'intermediate' },
        ],
      },
      {
        key: 'goal', question: '学习目标？', type: 'single',
        options: [
          { label: '后端开发', value: 'backend' },
          { label: '云原生/K8s', value: 'cloud' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '5-10 小时', value: 'medium' },
          { label: '10-20 小时', value: 'high' },
          { label: '20 小时+', value: 'fulltime' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level, goal, hours } = answers;
      const dur = hours === 'fulltime' ? '2' : hours === 'high' ? '3' : '4';
      const tasks = [];

      if (level === 'basic') {
        tasks.push({
          id: 'go-1', name: 'Go 基础语法（' + dur + '周）',
          learningRoute: [
            '📋 基础语法',
            '  • 变量/数据类型/控制流',
            '  • 结构体与接口',
            '  • 错误处理：defer/panic/recover',
          ],
          resources: [{ name: 'Go 官方文档', url: 'https://go.dev/doc' }],
          quadrant: 'not-urgent-important' as QuadrantType,
        });
      }

      tasks.push({
        id: 'go-2', name: 'Go 并发编程（' + dur + '周）',
        learningRoute: [
          '📋 并发核心',
          '  • Goroutine 与调度器',
          '  • Channel 与 select',
          '  • sync 包：Mutex/WaitGroup/Once',
        ],
        resources: [{ name: 'Go 并发编程', url: 'https://go.dev/blog/pipelines' }],
        quadrant: (goal === 'cloud' ? 'urgent' : 'not-urgent') + '-important' as any,
      });

      tasks.push({
        id: 'go-3', name: (goal === 'cloud' ? 'Docker/K8s 云原生' : 'Gin Web 框架') + '（' + dur + '周）',
        learningRoute: goal === 'cloud'
          ? [
              '📋 Docker 容器化',
              '  • Dockerfile 编写与镜像构建',
              '  • Docker Compose 编排',
              '',
              '📋 Kubernetes 入门',
              '  • Pod/Service/Deployment',
              '  • ConfigMap/Secret',
            ]
          : [
              '📋 Gin 框架开发',
              '  • 路由与中间件',
              '  • GORM 数据库操作',
              '  • RESTful API 设计',
            ],
        resources: goal === 'cloud'
          ? [{ name: 'Kubernetes 文档', url: 'https://kubernetes.io/docs/' }]
          : [{ name: 'Gin 框架', url: 'https://gin-gonic.com' }],
        quadrant: 'urgent-important' as QuadrantType,
      });

      return { title: 'Go ' + (goal === 'cloud' ? '云原生' : '后端') + '开发计划', tasks };
    },
  },
  {
    id: 'coding-java',
    categoryId: 'coding',
    name: 'Java 后端',
    description: '系统学习 Java + Spring Boot 后端开发',
    questions: [
      {
        key: 'level', question: '你的 Java 基础？', type: 'single',
        options: [
          { label: '零基础', value: 'beginner' },
          { label: '有 Java 基础', value: 'basic' },
          { label: '有 Spring 经验', value: 'experienced' },
        ],
      },
      {
        key: 'goal', question: '学习目标？', type: 'single',
        options: [
          { label: '找工作/面试', value: 'career' },
          { label: '做个人项目', value: 'project' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '5-10 小时', value: 'medium' },
          { label: '10-20 小时', value: 'high' },
          { label: '20 小时+', value: 'fulltime' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level, goal, hours } = answers;
      const dur = hours === 'fulltime' ? '2' : hours === 'high' ? '3' : '4';
      const tasks = [];

      if (level === 'beginner') {
        tasks.push({
          id: 'j-1', name: 'Java 基础（' + dur + '周）',
          learningRoute: [
            '📋 Java 核心语法',
            '  • 面向对象：封装/继承/多态',
            '  • 集合框架：List/Map/Set 源码',
            '  • 异常处理与泛型',
          ],
          resources: [{ name: 'Java 基础教程', url: 'https://docs.oracle.com/javase/tutorial/' }],
          quadrant: 'not-urgent-important' as QuadrantType,
        });
      }

      tasks.push({
        id: 'j-2', name: 'Spring Boot（' + dur + '周）',
        learningRoute: [
          '📋 Spring Boot 入门',
          '  • IoC/AOP 原理',
          '  • Spring MVC 请求流程',
          '  • MyBatis Plus 数据库操作',
          '',
          '📋 项目实战',
          '  • 用户认证 JWT',
          '  • RESTful API 设计',
          '  • Swagger 接口文档',
        ],
        resources: [
          { name: 'Spring Boot 文档', url: 'https://spring.io/projects/spring-boot' },
          { name: 'Java Guide', url: 'https://javaguide.cn' },
        ],
        quadrant: 'urgent-important' as QuadrantType,
      });

      if (goal === 'career') {
        tasks.push({
          id: 'j-3', name: '面试准备（' + dur + '周）',
          learningRoute: [
            '📋 面试冲刺',
            '  • JVM 内存模型与 GC',
            '  • 并发编程：线程池/AQS/锁',
            '  • MySQL 优化与索引',
            '  • Redis 缓存与分布式锁',
            '  • 系统设计：高并发/高可用',
          ],
          resources: [{ name: 'Java Interview', url: 'https://javaguide.cn' }],
          quadrant: 'urgent-important' as QuadrantType,
        });
      }

      return { title: 'Java 后端开发计划', tasks };
    },
  },
  {
    id: 'english-ielts',
    categoryId: 'english',
    name: '雅思备考',
    description: '系统备考雅思，目标 6.5-7.5 分',
    questions: [
      {
        key: 'target', question: '目标分数？', type: 'single',
        options: [
          { label: '6.0-6.5', value: '6' },
          { label: '6.5-7.0', value: '65' },
          { label: '7.0-7.5', value: '7' },
          { label: '7.5+', value: '75' },
        ],
      },
      {
        key: 'weakness', question: '最薄弱的单项？', type: 'single',
        options: [
          { label: '听力', value: 'listening' },
          { label: '阅读', value: 'reading' },
          { label: '写作', value: 'writing' },
          { label: '口语', value: 'speaking' },
        ],
      },
      {
        key: 'deadline', question: '备考时间？', type: 'single',
        options: [
          { label: '1-2 个月', value: 'short' },
          { label: '3-4 个月', value: 'medium' },
          { label: '6 个月+', value: 'long' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '< 5 小时', value: 'low' },
          { label: '5-10 小时', value: 'medium' },
          { label: '10-15 小时', value: 'high' },
          { label: '15 小时+', value: 'fulltime' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { target, weakness, deadline, hours } = answers;
      const isShort = deadline === 'short';
      const intense = hours === 'high' || hours === 'fulltime' ? '强化' : '常规';

      const tasks = [
        {
          id: 'ielts-1', name: '听力 ' + intense + '训练',
          learningRoute: [
            '📋 ' + (isShort ? '每日' : '每周') + '训练计划',
            '  • ' + (isShort ? '每日 1 套真题' : '每周 3-4 套真题'),
            '  • 精听训练：Section 3-4 逐句听写',
            '  • 错题归类：同义替换/定位词/干扰项',
            '  • ' + (weakness === 'listening' ? '重点加练' : '保持练习'),
          ],
          resources: [
            { name: '剑桥雅思真题', url: 'https://www.cambridgeenglish.org/' },
          ],
          quadrant: 'urgent-important' as QuadrantType,
        },
        {
          id: 'ielts-2', name: '阅读 ' + intense + '训练',
          learningRoute: [
            '📋 阅读策略',
            '  • 平行阅读法：文章+题目同步进行',
            '  • 题型专项：判断题/配对题/填空题',
            '  • 长难句分析：每日 5 句精析',
            '  • 速度训练：限制 15 分钟/篇',
          ],
          resources: [
            { name: 'The Economist', url: 'https://www.economist.com/' },
          ],
          quadrant: 'urgent-important' as QuadrantType,
        },
        {
          id: 'ielts-3', name: '写作 ' + intense + '训练',
          learningRoute: [
            '📋 写作提升',
            '  • Task 1：图表描述模板与词汇',
            '  • Task 2：四大题型结构',
            '  • 每周 ' + (isShort ? '4' : '2') + ' 篇完整作文',
            '  • 素材积累：万能论点+高级替换词',
          ],
          resources: [
            { name: 'Simon 雅思', url: 'https://ielts-simon.com/' },
          ],
          quadrant: 'urgent-important' as QuadrantType,
        },
        {
          id: 'ielts-4', name: '口语 ' + intense + '训练',
          learningRoute: [
            '📋 口语提升',
            '  • Part 1：日常话题准备（20+话题）',
            '  • Part 2：线索卡答题法（2分钟/题）',
            '  • Part 3：深入讨论（观点+解释+举例）',
            '  • ' + (isShort ? '每日' : '每周') + '影子跟读 15 分钟',
          ],
          resources: [
            { name: '口语侠', url: 'https://www.kouyuxia.com/' },
          ],
          quadrant: 'urgent-important' as QuadrantType,
        },
      ];

      return { title: '雅思 ' + target + '.0 分备考计划', tasks };
    },
  },
  {
    id: 'english-daily',
    categoryId: 'english',
    name: '日常口语',
    description: '提升日常英语口语交流能力',
    questions: [
      {
        key: 'level', question: '目前英语水平？', type: 'single',
        options: [
          { label: '初级（能简单交流）', value: 'beginner' },
          { label: '中级（能日常对话）', value: 'intermediate' },
          { label: '中高级（流利交流）', value: 'advanced' },
        ],
      },
      {
        key: 'goal', question: '主要目标？', type: 'single',
        options: [
          { label: '能流畅日常交流', value: 'daily' },
          { label: '职场英语', value: 'business' },
          { label: '出国旅游', value: 'travel' },
        ],
      },
      {
        key: 'hours', question: '每天能投入多少时间？', type: 'single',
        options: [
          { label: '15-30 分钟', value: 'low' },
          { label: '30-60 分钟', value: 'medium' },
          { label: '1 小时+', value: 'high' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level: _level, goal, hours } = answers;
      const daily = hours === 'high' ? '45' : '20';
      const area = goal === 'business' ? '职场' : goal === 'travel' ? '旅游' : '日常';

      return {
        title: area + '英语口语提升计划',
        tasks: [
          {
            id: 'de-1', name: '每日听说训练',
            learningRoute: [
              '📋 每日 ' + daily + ' 分钟训练',
              '  • 影子跟读法：模仿 native speaker',
              '  • 常用句型积累：每日 5-10 句',
              '  • 自言自语：用英语描述日常活动',
            ],
            resources: [
              { name: 'Rachel English', url: 'https://rachelsenglish.com/' },
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'de-2', name: area + '场景词汇',
            learningRoute: [
              '📋 场景词汇库',
              '  • 分类记忆：' + area + '场景常用词汇',
              '  • 情景对话模拟',
              '  • 实用短语与表达',
            ],
            resources: [
              { name: 'YouGlish', url: 'https://youglish.com/' },
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
          {
            id: 'de-3', name: '实战练习',
            learningRoute: [
              '📋 每周实战',
              '  • 与外教/语伴对话 1-2 次',
              '  • 录制自己对话并复盘',
              '  • 观看相关主题英文内容',
            ],
            resources: [
              { name: 'Cambly', url: 'https://www.cambly.com' },
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'exam-pmp',
    categoryId: 'exam',
    name: 'PMP 备考',
    description: '系统备考 PMP 项目管理认证',
    questions: [
      {
        key: 'experience', question: '项目管理经验？', type: 'single',
        options: [
          { label: '无经验', value: 'none' },
          { label: '1-3 年', value: 'junior' },
          { label: '3 年+', value: 'senior' },
        ],
      },
      {
        key: 'deadline', question: '备考时间？', type: 'single',
        options: [
          { label: '1 个月', value: 'short' },
          { label: '2-3 个月', value: 'medium' },
          { label: '4 个月+', value: 'long' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { experience: _experience, deadline: _deadline } = answers;

      return {
        title: 'PMP 项目管理认证备考计划',
        tasks: [
          {
            id: 'pmp-1', name: 'PMBOK 理论学习',
            learningRoute: [
              '📋 五大过程组',
              '  • 启动：项目章程、识别干系人',
              '  • 规划：需求收集、WBS',
              '  • 执行：团队管理、沟通',
              '  • 监控：进度/成本/质量',
              '  • 收尾：项目验收、总结',
            ],
            resources: [{ name: 'PMI 官方', url: 'https://www.pmi.org' }],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'pmp-2', name: '模拟题训练',
            learningRoute: [
              '📋 刷题计划',
              '  • 每日 20 题，专项练习',
              '  • 场景题：敏捷/混合方法论',
              '  • 计算题：EVM/CPM/SPI/CPI',
            ],
            resources: [{ name: 'PMP 模拟题', url: 'https://www.pmi.org' }],
            quadrant: 'urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'exam-csip',
    categoryId: 'exam',
    name: 'CSIP 备考',
    description: '系统集成项目管理工程师（中级）',
    questions: [
      {
        key: 'background', question: '你的专业背景？', type: 'single',
        options: [
          { label: '计算机相关专业', value: 'cs' },
          { label: '非计算机专业', value: 'noncs' },
        ],
      },
      {
        key: 'deadline', question: '备考时间？', type: 'single',
        options: [
          { label: '1-2 个月', value: 'short' },
          { label: '3-4 个月', value: 'medium' },
        ],
      },
    ],
    generatePlan: (_answers) => {
      return {
        title: 'CSIP 系统集成项目管理工程师备考计划',
        tasks: [
          {
            id: 'csip-1', name: '综合知识（上午）',
            learningRoute: [
              '📋 上午考试范围',
              '  • 信息化基础知识',
              '  • 系统集成技术',
              '  • 项目管理基础',
              '  • 法律法规与标准',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'csip-2', name: '案例分析（下午）',
            learningRoute: [
              '📋 下午考试范围',
              '  • 项目立项与可行性分析',
              '  • 项目计划与控制',
              '  • 配置管理与变更控制',
              '  • 论文与项目总结',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'fitness-muscle',
    categoryId: 'fitness',
    name: '增肌计划',
    description: '科学增肌训练+饮食计划',
    questions: [
      {
        key: 'level', question: '训练经验？', type: 'single',
        options: [
          { label: '新手', value: 'beginner' },
          { label: '有训练基础', value: 'intermediate' },
          { label: '有系统训练经验', value: 'advanced' },
        ],
      },
      {
        key: 'days', question: '每周能训练几天？', type: 'single',
        options: [
          { label: '3 天', value: '3' },
          { label: '4 天', value: '4' },
          { label: '5 天', value: '5' },
          { label: '6 天', value: '6' },
        ],
      },
      {
        key: 'goal', question: '主要目标？', type: 'single',
        options: [
          { label: '增肌增重', value: 'bulk' },
          { label: '力量提升', value: 'strength' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { level: _level, days, goal } = answers;

      return {
        title: (goal === 'bulk' ? '增肌' : '力量') + '训练计划',
        tasks: [
          {
            id: 'fit-1', name: '力量训练',
            learningRoute: [
              '📋 ' + days + '天/周 分化训练',
              '  • 推类动作：卧推/肩推/臂屈伸',
              '  • 拉类动作：引体向上/划船/弯举',
              '  • 腿部训练：深蹲/硬拉/腿举',
            ],
            resources: [
              { name: 'MuscleWiki', url: 'https://www.musclewiki.com/' },
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'fit-2', name: '有氧与核心',
            learningRoute: [
              '📋 辅助训练',
              '  • 每周 2 次核心训练',
              '  • 每周 1-2 次低强度有氧',
              '  • 训练前后动态/静态拉伸',
            ],
            resources: [
              { name: 'Athlean-X', url: 'https://www.youtube.com/@ATHLEANX' },
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
          {
            id: 'fit-3', name: '饮食计划',
            learningRoute: [
              '📋 ' + (goal === 'bulk' ? '增肌' : '力量') + '期饮食',
              '  • 蛋白质摄入：1.6-2.2g/kg 体重',
              '  • 碳水循环与热量盈余',
              '  • 补剂选择：蛋白粉/肌酸',
            ],
            resources: [
              { name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com' },
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'fitness-fatloss',
    categoryId: 'fitness',
    name: '减脂计划',
    description: '科学减脂，保留肌肉的减脂方案',
    questions: [
      {
        key: 'level', question: '训练经验？', type: 'single',
        options: [
          { label: '新手', value: 'beginner' },
          { label: '有训练基础', value: 'intermediate' },
        ],
      },
      {
        key: 'days', question: '每周能训练几天？', type: 'single',
        options: [
          { label: '3-4 天', value: '3' },
          { label: '5-6 天', value: '5' },
        ],
      },
    ],
    generatePlan: (answers) => {
      return {
        title: '科学减脂计划',
        tasks: [
          {
            id: 'fat-1', name: '力量+有氧训练',
            learningRoute: [
              '📋 ' + (answers.days === '3' ? '3-4' : '5-6') + '天/周',
              '  • 力量训练：保持肌肉量',
              '  • HIIT 高强度间歇：15-20 分钟',
              '  • 低强度有氧：30-40 分钟',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'fat-2', name: '饮食与热量控制',
            learningRoute: [
              '📋 减脂期饮食',
              '  • 热量缺口：300-500 卡',
              '  • 蛋白质：1.8-2.2g/kg',
              '  • 食物选择：高蛋白低GI',
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'fitness-home',
    categoryId: 'fitness',
    name: '居家徒手',
    description: '无需器械，在家就能练',
    questions: [
      {
        key: 'level', question: '训练经验？', type: 'single',
        options: [
          { label: '新手', value: 'beginner' },
          { label: '有一定基础', value: 'intermediate' },
        ],
      },
      {
        key: 'equipment', question: '可用器械？', type: 'single',
        options: [
          { label: '徒手（无器械）', value: 'bodyweight' },
          { label: '有哑铃/弹力带', value: 'some' },
        ],
      },
    ],
    generatePlan: (answers) => {
      return {
        title: '居家徒手训练计划',
        tasks: [
          {
            id: 'home-1', name: '徒手训练',
            learningRoute: [
              '📋 居家训练计划',
              '  • 俯卧撑：4组×力竭',
              '  • 深蹲：4组×20次',
              '  • 平板支撑：4组×45秒',
              '  • ' + (answers.equipment === 'some' ? '哑铃推举/划船' : '臀桥/波比跳'),
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'home-2', name: '灵活性与放松',
            learningRoute: [
              '📋 拉伸与放松',
              '  • 全身动态拉伸（训练前）',
              '  • 静态拉伸（训练后）',
              '  • 泡沫轴放松',
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'side-media',
    categoryId: 'side',
    name: '自媒体运营',
    description: '从 0 开始做自媒体账号',
    questions: [
      {
        key: 'platform', question: '目标平台？', type: 'single',
        options: [
          { label: '小红书', value: 'red' },
          { label: 'B站/YouTube', value: 'video' },
          { label: '公众号', value: 'wechat' },
          { label: '知乎', value: 'zhihu' },
        ],
      },
      {
        key: 'content', question: '内容方向？', type: 'single',
        options: [
          { label: '技术分享', value: 'tech' },
          { label: '学习成长', value: 'study' },
          { label: '生活日常', value: 'life' },
        ],
      },
      {
        key: 'hours', question: '每周能投入多少时间？', type: 'single',
        options: [
          { label: '< 5 小时', value: 'low' },
          { label: '5-10 小时', value: 'medium' },
          { label: '10-20 小时', value: 'high' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { platform, content, hours } = answers;
      const freq = hours === 'high' ? '3-4' : hours === 'medium' ? '2-3' : '1-2';
      const platName = platform === 'red' ? '小红书' : platform === 'video' ? 'B站' : platform === 'wechat' ? '公众号' : '知乎';

      return {
        title: platName + ' ' + content + ' 账号运营计划',
        tasks: [
          {
            id: 'side-1', name: '账号搭建与定位',
            learningRoute: [
              '📋 账号初始化',
              '  • 账号定位：' + content + '方向',
              '  • 主页设计：头像/简介/背景',
              '  • 竞品分析：对标账号拆解',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'side-2', name: '内容制作',
            learningRoute: [
              '📋 每周 ' + freq + ' 篇内容',
              '  • 选题库建立：热点+长青',
              '  • 脚本/文案撰写',
              '  • 制作与编辑',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'side-3', name: '运营与增长',
            learningRoute: [
              '📋 增长策略',
              '  • 数据分析：阅读/互动/转化',
              '  • 互动维护：评论/私信',
              '  • 合作互推：同领域博主',
              '  • 变现探索：广告/带货/课程',
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
  {
    id: 'side-freelance',
    categoryId: 'side',
    name: '技能接单',
    description: '通过技能接单实现副业收入',
    questions: [
      {
        key: 'skill', question: '你的核心技能？', type: 'single',
        options: [
          { label: '前端/后端开发', value: 'dev' },
          { label: 'UI/UX 设计', value: 'design' },
          { label: '写作/翻译', value: 'write' },
        ],
      },
      {
        key: 'goal', question: '月收入目标？', type: 'single',
        options: [
          { label: '1000-3000 元', value: 'low' },
          { label: '3000-8000 元', value: 'medium' },
          { label: '8000 元+', value: 'high' },
        ],
      },
    ],
    generatePlan: (answers) => {
      const { skill, goal } = answers;

      return {
        title: (skill === 'dev' ? '技术开发' : skill === 'design' ? '设计' : '写作') + '副业接单计划',
        tasks: [
          {
            id: 'free-1', name: '作品集与定价',
            learningRoute: [
              '📋 接单准备',
              '  • 整理作品集/案例',
              '  • 制定服务价格体系',
              '  • 准备合同模板',
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'free-2', name: '获客渠道',
            learningRoute: [
              '📋 多渠道接单',
              '  • Upwork/Fiverr 国际平台',
              '  • 电鸭/程序员客栈 国内平台',
              '  • 朋友圈/社群口碑',
            ],
            resources: [
              { name: 'Upwork', url: 'https://www.upwork.com' },
              { name: '电鸭社区', url: 'https://eleduck.com' },
            ],
            quadrant: 'urgent-important' as QuadrantType,
          },
          {
            id: 'free-3', name: '客户维护',
            learningRoute: [
              '📋 长期发展',
              '  • 服务质量：准时交付',
              '  • 客户沟通：需求确认',
              '  • 转介绍：老客户推荐',
              '  • 目标：月入 ' + (goal === 'low' ? '1000-3000' : goal === 'medium' ? '3000-8000' : '8000+') + ' 元',
            ],
            quadrant: 'not-urgent-important' as QuadrantType,
          },
        ],
      };
    },
  },
];
