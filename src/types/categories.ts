import { Category, Task } from './index';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'fitness',
    name: '健身',
    icon: 'Dumbbell',
    color: '#ef4444',
    gradient: 'bg-red-500',
    enabled: true,
  },
  {
    id: 'coding',
    name: '编程学习',
    icon: 'Code',
    color: '#3b82f6',
    gradient: 'bg-blue-500',
    enabled: true,
  },
  {
    id: 'english',
    name: '英语',
    icon: 'Globe',
    color: '#22c55e',
    gradient: 'bg-green-500',
    enabled: true,
  },
  {
    id: 'exam',
    name: '考试',
    icon: 'GraduationCap',
    color: '#8b5cf6',
    gradient: 'bg-purple-500',
    enabled: true,
  },
  {
    id: 'side',
    name: '副业',
    icon: 'Briefcase',
    color: '#f59e0b',
    gradient: 'bg-amber-500',
    enabled: true,
  },
];

export const DEFAULT_TASKS: Task[] = [
  // ========== 健身模块 - 训练 ==========
  {
    id: 'fitness-training',
    categoryId: 'fitness',
    name: '🏋️ 训练计划',
    icon: 'Dumbbell',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 1,
    group: '训练',
    groupOrder: 1,
    description: '系统训练计划，点击查看详情',
    learningRoute: [
      '🟢 周一：胸部 + 三头',
      '🟡 周二：背部 + 二头',
      '🔴 周三：腿部',
      '⚪ 周四：休息/有氧',
      '🟢 周五：肩部 + 腹肌',
      '🟡 周六：全身训练',
      '🔴 周日：休息'
    ],
    resources: [
      { name: 'Jeff Nippard', url: 'https://www.youtube.com/@JeffNippard' },
      { name: '5x5 训练计划', url: 'https://stronglifts.com/5x5/' }
    ]
  },
  {
    id: 'fitness-strength',
    categoryId: 'fitness',
    name: '力量训练',
    icon: 'Dumbbell',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 10,
    group: '训练',
    groupOrder: 10,
    description: '胸、背、腿、肩、手臂等大肌群训练',
    learningRoute: [
      '周一：胸部 - 卧推、哑铃飞鸟、俯卧撑',
      '周二：背部 - 引体向上、划船、硬拉',
      '周三：腿部 - 深蹲、硬拉、腿举',
      '周四：休息',
      '周五：肩部 - 推举、侧平举、俯身侧平举',
      '周六：手臂 - 二头弯举、三头下压',
      '周日：休息'
    ],
    resources: [
      { name: '胸部动作演示', url: 'https://www.musclewiki.com/male/chest' },
      { name: '背部动作演示', url: 'https://www.musclewiki.com/male/back' },
      { name: '腿部动作演示', url: 'https://www.musclewiki.com/male/legs' },
      { name: '肩部动作演示', url: 'https://www.musclewiki.com/male/shoulders' },
      { name: 'Jeff Nippard', url: 'https://www.youtube.com/@JeffNippard' },
      { name: '5x5 训练计划', url: 'https://stronglifts.com/5x5/' }
    ]
  },
  {
    id: 'fitness-cardio',
    categoryId: 'fitness',
    name: '有氧运动',
    icon: 'Heart',
    unit: '分钟',
    defaultDuration: 30,
    enabled: true,
    order: 20,
    group: '训练',
    groupOrder: 20,
    description: '跑步、骑行、游泳、跳绳、HIIT',
    learningRoute: [
      '周一：晨间跑步 5KM',
      '周二：HIIT 20分钟',
      '周三：骑行 30分钟',
      '周四：休息',
      '周五：跳绳 15分钟',
      '周六：游泳/椭圆机 40分钟',
      '周日：LISS 慢跑 30分钟'
    ],
    resources: [
      { name: 'HIIT 训练演示', url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI' },
      { name: '跑步教程', url: 'https://www.youtube.com/watch?v=2L2lnxIcN3E' },
      { name: 'Nike Training', url: 'https://www.nike.com/nt/training' },
      { name: 'Keep 跑步', url: 'https://www.gotokeep.com' }
    ]
  },
  {
    id: 'fitness-core',
    categoryId: 'fitness',
    name: '核心训练',
    icon: 'Activity',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 30,
    group: '训练',
    groupOrder: 30,
    description: '腹肌、腹斜肌、下背部、髋部肌群',
    learningRoute: [
      '平板支撑 3组×60秒',
      '卷腹 4组×15次',
      '俄罗斯转体 4组×20次',
      '登山者 3组×30秒',
      '死虫式 3组×12次/侧',
      '悬垂举腿 3组×10次'
    ],
    resources: [
      { name: '核心训练演示', url: 'https://www.musclewiki.com/male/abs' },
      { name: 'Athlean-X 核心', url: 'https://www.youtube.com/@ATHLEANX' },
      { name: '腹肌训练指南', url: 'https://www.verywellfit.com/core-exercises' }
    ]
  },
  {
    id: 'fitness-stretch',
    categoryId: 'fitness',
    name: '拉伸/瑜伽',
    icon: 'Sparkles',
    unit: '分钟',
    defaultDuration: 15,
    enabled: true,
    order: 40,
    group: '训练',
    groupOrder: 40,
    description: '训练后拉伸、柔韧性练习、瑜伽',
    learningRoute: [
      '训练后静态拉伸 10-15分钟',
      '周一：胸肩拉伸 - 胸部、肩部',
      '周三：背髋拉伸 - 背部、髋屈肌',
      '周五：腿部拉伸 - 股四头肌、腘绳肌',
      '周六：全身瑜伽 30分钟',
      '周日：放松冥想 15分钟'
    ],
    resources: [
      { name: '全身拉伸演示', url: 'https://www.youtube.com/watch?v=x1iS5qkQ4jI' },
      { name: '瑜伽教程', url: 'https://www.youtube.com/user/yogawithadriene' },
      { name: 'Keep 瑜伽', url: 'https://www.gotokeep.com/exercises/yoga' }
    ]
  },

  // ========== 健身模块 - 记录 ==========
  {
    id: 'fitness-photo',
    categoryId: 'fitness',
    name: '📸 健身打卡',
    icon: 'Camera',
    unit: '次',
    defaultDuration: 1,
    enabled: true,
    order: 100,
    group: '记录',
    groupOrder: 1,
    description: '记录健身照片，见证蜕变',
    learningRoute: [
      '每周拍摄正面、侧面、背面照片',
      '每月对比身材变化',
      '记录体重、体脂率等数据',
      '保持训练日志，总结进步'
    ],
    resources: [
      { name: 'Progress Pics App', url: 'https://www.progresspics.com' },
      { name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com' }
    ]
  },

  // ========== 编程学习 - 计算机基础 ==========
  {
    id: 'coding-cs',
    categoryId: 'coding',
    name: '计算机基础',
    icon: 'Monitor',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 5,
    description: '计算机组成原理、OS、网络、数据库',
    learningRoute: [
      'Week 1-2: 计算机组成原理',
      '  • 数据表示与运算',
      '  • 存储体系：Cache/虚拟内存',
      'Week 3-4: 操作系统',
      '  • 进程与线程管理',
      '  • 内存管理/文件系统',
      'Week 5-6: 计算机网络',
      '  • TCP/IP 协议栈',
      '  • HTTP/HTTPS/DNS',
      'Week 7-8: 数据库基础',
      '  • SQL 语言与索引',
      '  • 事务/ACID/隔离级别'
    ],
    resources: [
      { name: 'CSAPP', url: 'https://book.douban.com/subject/26912767' },
      { name: 'TCP/IP 详解', url: 'https://book.douban.com/subject/1088054' },
      { name: '图解HTTP', url: 'https://book.douban.com/subject/25863515' },
      { name: 'MySQL 必知必会', url: 'https://book.douban.com/subject/3354490' }
    ]
  },
  // ========== 编程学习 - Java ==========
  {
    id: 'coding-java',
    categoryId: 'coding',
    name: 'Java 后端',
    icon: 'Coffee',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 10,
    description: 'Java、Spring Boot、微服务架构',
    learningRoute: [
      'Week 1-2: Java 核心基础强化',
      '  • 集合源码：ArrayList/HashMap/LinkedList',
      '  • 并发编程：Thread/Executor/CompletableFuture',
      '  • JVM 原理：内存模型、GC、类加载',
      '',
      'Week 3-4: Spring Boot 入门',
      '  • IoC/AOP 原理与源码',
      '  • Spring MVC 请求处理流程',
      '  • MyBatis Plus 数据库操作',
      '',
      'Week 5-6: Spring Cloud 微服务',
      '  • Nacos 服务注册与配置中心',
      '  • Feign/Ribbon 负载均衡',
      '  • Sentinel 熔断限流',
      '',
      'Week 7-8: 项目实战 - 博客系统',
      '  • MySQL/Redis 数据库设计',
      '  • ElasticSearch 全文检索',
      '  • Docker Compose 部署'
    ],
    resources: [
      { name: 'Spring Boot 官方文档', url: 'https://spring.io/projects/spring-boot' },
      { name: 'Java Guide', url: 'https://javaguide.cn' },
      { name: '尚硅谷 Java 教程', url: 'https://www.bilibili.com/video/BV1Kb411W7MN' },
      { name: 'MySQL 教程', url: 'https://www.bilibili.com/video/BV1Kr4y1i7ru' }
    ],
    projects: [
    {
      name: 'Java 电商后台',
      learningRoute: [
      '📋 Week1：项目初始化',
      '• 技术选型：Vue3 + Element Plus + Spring Boot',
      '• 搭建前端项目：Vite + Vue Router + Pinia',
      '• 搭建后端项目：Spring Boot + MyBatis Plus',
      '• 设计数据库：用户/商品/订单/库存表结构',
      '• 搭建开发环境：Docker MySQL + Redis',
      '',
      '📦 Week2：核心模块',
      '• 用户模块：登录注册、权限管理（RBAC）',
      '• 商品模块：SPU/SKU管理、图片上传OSS',
      '• 分类模块：树形结构、无限级分类',
      '• 库存模块：库存预警、进出库记录',
      '',
      '🛒 Week3：业务模块',
      '• 订单模块：下单流程、状态流转、支付集成',
      '• 统计模块：销售报表、趋势图、导出Excel',
      '• 通知模块：邮件/短信通知、模板消息',
      '• 搜索模块：ElasticSearch全文检索',
      '',
      '🔒 Week4：安全与部署',
      '• 接口鉴权：Spring Security + JWT',
      '• 数据脱敏：敏感信息加密存储',
      '• 日志审计：记录操作日志',
      '• 性能优化：数据库索引、懒加载',
      '• 部署：Docker Compose一键部署'
    ],
      resources: [
      { name: 'Vue 3 文档', url: 'https://vuejs.org' },
      { name: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' },
      { name: 'Element Plus', url: 'https://element-plus.org' }
    ]
    }
    ]
},

  // ========== 编程学习 - Go ==========
  {
    id: 'coding-go',
    categoryId: 'coding',
    name: 'Go 后端',
    icon: 'Box',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 20,
    description: 'Go、Gin、gRPC、云原生开发',
    learningRoute: [
      'Week 1-2: Go 基础语法',
      '  • 基础数据类型与结构体',
      '  • 接口与反射机制',
      '  • 并发编程：Goroutine/Channel',
      '',
      'Week 3-4: Gin 框架入门',
      '  • RESTful API 设计',
      '  • 中间件与拦截器',
      '  • GORM 数据库操作',
      '',
      'Week 5-6: gRPC 与微服务',
      '  • Protobuf 协议',
      '  • gRPC 服务编写',
      '  • 微服务通信与治理',
      '',
      'Week 7-8: Docker/K8s 基础',
      '  • Docker 镜像构建',
      '  • Kubernetes 部署',
      '  • CI/CD 流水线'
    ],
    resources: [
      { name: 'Go 官方文档', url: 'https://go.dev/doc' },
      { name: 'Gin 框架', url: 'https://gin-gonic.com' },
      { name: 'Go 语言圣经', url: 'https://book.go-zh.org/' },
      { name: 'Docker 教程', url: 'https://www.docker.com/get-started' }
    ],
    projects: [
    {
      name: 'Go 微服务',
      learningRoute: [
      '📋 Week1：架构设计',
      '• 微服务架构理论：康威定律、拆分原则',
      '• 技术选型：Go + gRPC + Protobuf',
      '• 服务注册与发现：Nacos/Consul',
      '• 链路追踪：Jaeger',
      '',
      '📦 Week2：用户服务',
      '• 用户注册/登录/鉴权',
      '• JWT/OAuth2 认证',
      '• 分布式 Session',
      '• 权限控制：RBAC',
      '',
      '🛒 Week3：商品服务',
      '• 商品 CRUD 接口',
      '• 分类管理：树形结构',
      '• 库存管理：分布式锁',
      '• 搜索服务：ES 集成',
      '',
      '📦 Week4：订单服务',
      '• 分布式事务：Seata',
      '• 订单创建/取消/支付',
      '• 消息队列：RabbitMQ/Kafka',
      '• 定时任务：优惠券/库存',
      '',
      '🚀 Week5-6：部署运维',
      '• Docker Compose 编排',
      '• Kubernetes 部署',
      '• CI/CD 流水线',
      '• 监控告警：Prometheus + Grafana'
    ],
      resources: [
      { name: 'Go 官方文档', url: 'https://go.dev/doc' },
      { name: 'gRPC 文档', url: 'https://grpc.io/docs' },
      { name: 'Docker', url: 'https://www.docker.com' }
    ]
    }
    ]
},

  // ========== 编程学习 - Python ==========
  {
    id: 'coding-python',
    categoryId: 'coding',
    name: 'Python 全栈',
    icon: 'Terminal',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 30,
    description: 'Python、Web开发、数据分析、AI/ML',
    learningRoute: [
      'Week 1-2: Python 基础与语法',
      '  • 基础语法与数据结构',
      '  • 装饰器/生成器/迭代器',
      '  • 面向对象与模块化',
      '',
      'Week 3-4: Django/Flask Web 开发',
      '  • Flask 入门：路由/模板/蓝图',
      '  • Django 进阶：ORM/Admin/中间件',
      '  • RESTful API：FastAPI/DRF',
      '',
      'Week 5-6: 数据分析 Pandas/NumPy',
      '  • 数据清洗与预处理',
      '  • 数据可视化 Matplotlib/Seaborn',
      '  • 统计分析与特征工程',
      '',
      'Week 7-8: 机器学习入门 Scikit-learn',
      '  • 监督学习：分类/回归',
      '  • 无监督学习：聚类/降维',
      '  • 模型评估与调参'
    ],
    resources: [
      { name: 'Python 官方文档', url: 'https://docs.python.org/3/' },
      { name: 'Django 文档', url: 'https://www.djangoproject.com' },
      { name: 'Kaggle 入门', url: 'https://www.kaggle.com/learn' },
      { name: 'Python Cookbook', url: 'https://book.douban.com/subject/4824710' }
    ],
    projects: [
    {
      name: 'Python 数据可视化',
      learningRoute: [
      '📊 Week1：数据采集',
      '• 明确数据源：数据库/API/爬虫',
      '• 设计数据仓库：维度表、事实表',
      '• 搭建ETL流程：数据抽取→清洗→加载',
      '• 定时任务：使用Cron或Airflow',
      '• 数据校验：异常值检测与告警',
      '',
      '📈 Week2：可视化开发',
      '• 选择可视化库：ECharts/AntV/G2',
      '• 核心图表：折线图、柱状图、饼图、地图',
      '• 仪表盘布局：Grid布局、自适应尺寸',
      '• 主题配置：暗色模式、数据钻取',
      '• 交互功能：筛选、排序、导出',
      '',
      '🎛️ Week3：交互开发',
      '• 时间筛选：快捷选项、自定义范围',
      '• 多维度切换：省市区、年龄段、时间维度',
      '• 下钻分析：点击图表查看明细',
      '• 权限控制：不同角色看到不同数据',
      '• 定时刷新：实时数据看板',
      '',
      '☁️ Week4：部署运维',
      '• 后端服务：Python Flask/FastAPI',
      '• 数据库：PostgreSQL + TimescaleDB',
      '• 缓存层：Redis缓存热点数据',
      '• 部署：Docker + Nginx',
      '• 监控：Grafana + Prometheus'
    ],
      resources: [
      { name: 'ECharts 示例', url: 'https://echarts.apache.org/examples' },
      { name: 'Python Flask', url: 'https://flask.palletsprojects.com' },
      { name: 'Docker Docs', url: 'https://docs.docker.com' }
    ]
    }
    ]
},

  // ========== 编程学习 - C++ ==========
  {
    id: 'coding-cpp',
    categoryId: 'coding',
    name: 'C++ 开发',
    icon: 'FileCode',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 40,
    description: 'C++、STL、算法竞赛、底层开发',
    learningRoute: [
      'Week 1-2: C++ 基础与面向对象',
      '  • 语法基础与内存管理',
      '  • 类与继承、多态',
      '  • 模板与泛型编程',
      '',
      'Week 3-4: STL 容器与算法源码',
      '  • vector/list/deque 源码分析',
      '  • unordered_map/set 哈希表',
      '  • 算法实现原理',
      '',
      'Week 5-6: 内存管理、智能指针',
      '  • new/delete 底层实现',
      '  • shared_ptr/unique_ptr/weak_ptr',
      '  • 内存池与 allocator',
      '',
      'Week 7-8: 并发编程、多线程',
      '  • std::thread 线程管理',
      '  • mutex/condition_variable',
      '  • 线程池实现'
    ],
    resources: [
      { name: 'C++ Primer', url: 'https://book.douban.com/subject/25708312' },
      { name: 'STL 源码剖析', url: 'https://book.douban.com/subject/1112141' },
      { name: '侯捷 C++ 视频', url: 'https://www.bilibili.com/video/BV1Kb411W7MN' },
      { name: 'C++ LeetCode', url: 'https://leetcode.cn/tag/cpp/' }
    ]
  },

  // ========== 编程学习 - 前端 ==========
  {
    id: 'coding-frontend',
    categoryId: 'coding',
    name: '前端/全栈',
    icon: 'Layout',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 50,
    description: 'React、Vue、TypeScript、Node.js 全栈',
    learningRoute: [
      'Week 1-2: TypeScript 进阶',
      '  • 类型系统与泛型',
      '  • 高级类型：交叉/联合/映射',
      '  • 类型守卫与条件类型',
      '',
      'Week 3-4: React 深入',
      '  • Hooks 源码：useState/useEffect',
      '  • 虚拟 DOM 与 Diff 算法',
      '  • 状态管理：Zustand/Redux',
      '',
      'Week 5-6: 全栈技能',
      '  • Node.js/Express/Koa',
      '  • MongoDB/Redis 数据库',
      '  • RESTful API 设计',
      '',
      'Week 7-8: 性能优化专题',
      '  • React 渲染优化',
      '  • 代码分割与懒加载',
      '  • Webpack/Vite 原理'
    ],
    resources: [
      { name: 'React 官方文档', url: 'https://react.dev' },
      { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
      { name: 'Vue 3 文档', url: 'https://vuejs.org' }
    ],
    projects: [
    {
      name: '前端博客系统',
      learningRoute: [
      '📋 Day1-2：需求分析与设计',
      '• 确定博客核心功能：文章列表、详情页、分类标签',
      '• 设计数据库：users表、posts表、tags表、comments表',
      '• 绘制ER图，设计API接口RESTful规范',
      '• 编写README.md技术文档',
      '',
      '🎨 Day3-4：前端开发',
      '• 初始化Next.js项目，配置Tailwind CSS',
      '• 搭建页面路由：/、/post/:id、/about',
      '• 开发组件：Header、PostCard、Article、TagList',
      '• 状态管理：使用Zustand管理文章数据',
      '• 样式美化：响应式布局，暗色模式支持',
      '',
      '⚙️ Day5-6：后端开发',
      '• 搭建Node.js/Express或Go/Gin服务',
      '• 连接MySQL/PostgreSQL数据库',
      '• 实现CRUD接口：GET/POST/PUT/DELETE',
      '• 集成JWT实现用户认证',
      '• 添加Redis缓存优化查询性能',
      '',
      '🚀 Day7：部署上线',
      '• 前端部署：Vercel或Netlify',
      '• 后端部署：Railway、Render或阿里云服务器',
      '• 域名配置与HTTPS证书',
      '• SEO优化：meta标签、结构化数据'
    ],
      resources: [
      { name: 'Next.js 文档', url: 'https://nextjs.org/docs' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
      { name: 'Vercel 部署', url: 'https://vercel.com' }
    ]
    },
    {
      name: 'AI 聊天应用',
      learningRoute: [
      '🎯 Week1：前端界面',
      '• 初始化React + TypeScript项目',
      '• 设计聊天界面：消息气泡、输入框、对话列表',
      '• 实现打字机效果，流式输出动画',
      '• 添加主题切换（浅色/深色/渐变）',
      '• 移动端适配：响应式布局',
      '',
      '🤖 Week2：API集成',
      '• 注册OpenAI账号，获取API Key',
      '• 设计后端代理：解决跨域与API安全',
      '• 流式响应：使用Server-Sent Events',
      '• 添加提示词模板：角色扮演，专业助手',
      '• 实现上下文记忆：保存最近N轮对话',
      '',
      '💾 Week3：功能完善',
      '• 用户系统：注册登录、会员订阅',
      '• 对话历史：本地存储+云端同步',
      '• 对话管理：重命名、删除、置顶',
      '• 分享功能：生成分享链接/二维码',
      '• 成本统计：API调用次数与费用',
      '',
      '⚡ Week4：优化与部署',
      '• 性能优化：首屏加载、代码分割',
      '• 用户体验：加载状态，空状态、错误处理',
      '• 数据分析：埋点统计、用户行为',
      '• 部署上线：Vercel + Railway/VPS'
    ],
      resources: [
      { name: 'OpenAI API', url: 'https://platform.openai.com/docs' },
      { name: 'React 文档', url: 'https://react.dev' },
      { name: 'Vercel 部署', url: 'https://vercel.com' }
    ]
    }
    ]
},

  // ========== 编程学习 - 算法 ==========
  {
    id: 'coding-algorithm',
    categoryId: 'coding',
    name: '算法刷题',
    icon: 'Binary',
    unit: '题',
    defaultDuration: 45,
    enabled: true,
    order: 60,
    description: 'LeetCode、牛客网算法题',
    learningRoute: [
      '第1周：数组、链表、哈希表',
      '第2周：字符串、双指针',
      '第3周：栈、队列、递归',
      '第4周：树、排序',
      '第5周：回溯、贪心',
      '第6周：动态规划',
      '每日 2-3 题，周末复盘'
    ],
    resources: [
      { name: 'LeetCode 中国站', url: 'https://leetcode.cn' },
      { name: '代码随想录', url: 'https://programmercarl.com' },
      { name: 'labuladong 算法', url: 'https://labuladong.github.io/algo' },
      { name: '剑指Offer', url: 'https://leetcode.cn/problem-library' }
    ]
  },

  // ========== 编程学习 - 书籍 ==========
  {
    id: 'coding-reading',
    categoryId: 'coding',
    name: '技术书籍',
    icon: 'BookMarked',
    unit: '页',
    defaultDuration: 30,
    enabled: true,
    order: 70,
    description: '技术经典书籍、源码阅读',
    learningRoute: [
      '《JavaScript高级程序设计》',
      '《你不知道的JavaScript》',
      '《深入理解计算机系统》',
      '《代码整洁之道》',
      '《架构整洁之道》',
      '每月 1 本书，精读 + 笔记'
    ],
    resources: [
      { name: 'GitHub 电子书', url: 'https://github.com/EbookFoundation/free-programming-books' },
      { name: '极客时间', url: 'https://time.geekbang.org' },
      { name: '掘金小册', url: 'https://juejin.cn/books' }
    ]
  },


  // ========== 编程学习 - 项目实战 ==========
  {
    id: 'coding-project-java',
    categoryId: 'coding',
    name: 'Java 电商后台',
    icon: 'ShoppingCart',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 100,
    group: '项目',
    groupOrder: 5,
    description: 'Spring Boot 电商后台系统',
    learningRoute: [
      'Week 1: 项目搭建与数据库设计',
      '  • Spring Boot + MyBatis Plus 项目初始化',
      '  • 用户/商品/订单/库存数据库设计',
      '  • Docker 搭建 MySQL + Redis 环境',
      'Week 2: 核心业务模块',
      '  • 用户注册登录、JWT 鉴权',
      '  • 商品 SPU/SKU 管理与图片上传',
      '  • 购物车与订单流程',
      'Week 3: 支付与部署',
      '  • 微信/支付宝支付集成',
      '  • ElasticSearch 商品搜索',
      '  • Docker Compose 一键部署'
    ],
    resources: [
      { name: 'Spring Boot 文档', url: 'https://spring.io/projects/spring-boot' },
      { name: 'MyBatis Plus', url: 'https://baomidou.com' },
      { name: '微信支付文档', url: 'https://pay.weixin.qq.com' }
    ]
  },
  {
    id: 'coding-project-go',
    categoryId: 'coding',
    name: 'Go 微服务',
    icon: 'Server',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 110,
    group: '项目',
    groupOrder: 10,
    description: 'Go gRPC 微服务架构',
    learningRoute: [
      'Week 1: 服务拆分与通信',
      '  • 微服务架构设计与服务拆分',
      '  • Protobuf 定义与 gRPC 通信',
      '  • Nacos 服务注册与发现',
      'Week 2: 业务服务开发',
      '  • 用户服务：注册登录与 JWT 鉴权',
      '  • 商品服务：CRUD 与分布式缓存',
      '  • 订单服务：分布式事务 Seata',
      'Week 3: 可观测性与部署',
      '  • Jaeger 链路追踪',
      '  • Prometheus + Grafana 监控',
      '  • Kubernetes 容器编排'
    ],
    resources: [
      { name: 'gRPC 官方文档', url: 'https://grpc.io/docs' },
      { name: 'Go 微服务实战', url: 'https://go.dev/doc' },
      { name: 'Kubernetes 教程', url: 'https://kubernetes.io/docs/tutorials' }
    ]
  },
  {
    id: 'coding-project-python',
    categoryId: 'coding',
    name: 'Python 数据可视化',
    icon: 'BarChart',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 120,
    group: '项目',
    groupOrder: 15,
    description: 'Python 数据看板与可视化',
    learningRoute: [
      'Week 1: 数据采集与清洗',
      '  • 多数据源接入：数据库/API/CSV',
      '  • Pandas 数据清洗与预处理',
      '  • ETL 流程搭建与定时调度',
      'Week 2: 可视化看板开发',
      '  • ECharts/AntV 核心图表配置',
      '  • Flask + Dash 构建交互式看板',
      '  • 多维度筛选与下钻分析',
      'Week 3: 部署与自动化',
      '  • 自动化报表邮件推送',
      '  • Nginx 反向代理部署',
      '  • Grafana 补充监控面板'
    ],
    resources: [
      { name: 'Pandas 文档', url: 'https://pandas.pydata.org' },
      { name: 'ECharts 示例', url: 'https://echarts.apache.org/examples' },
      { name: 'Flask 文档', url: 'https://flask.palletsprojects.com' }
    ]
  },
  {
    id: 'coding-project-blog',
    categoryId: 'coding',
    name: '前端博客系统',
    icon: 'FileText',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 130,
    group: '项目',
    groupOrder: 20,
    description: 'Next.js 全栈博客',
    learningRoute: [
      '📋 第1阶段：项目初始化与设计',
      '  • Next.js + TypeScript 项目搭建',
      '  • Prisma + PostgreSQL 数据库设计',
      '  • Tailwind CSS 主题配置',
      '📋 第2阶段：核心功能开发',
      '  • 文章 CRUD 与 Markdown 渲染',
      '  • 分类标签系统与全文搜索',
      '  • 用户认证与评论系统',
      '📋 第3阶段：优化与部署',
      '  • SEO 优化与 RSS 订阅',
      '  • Vercel 持续部署',
      '  • 自定义域名与 HTTPS'
    ],
    resources: [
      { name: 'Next.js 文档', url: 'https://nextjs.org/docs' },
      { name: 'Prisma 文档', url: 'https://www.prisma.io/docs' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com' }
    ]
  },
  {
    id: 'coding-project-ai',
    categoryId: 'coding',
    name: 'AI 聊天应用',
    icon: 'MessageCircle',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 140,
    group: '项目',
    groupOrder: 25,
    description: 'AI 对话应用',
    learningRoute: [
      'Week 1: 前端界面开发',
      '  • React + TypeScript 聊天界面',
      '  • 流式输出与打字机动画',
      '  • 多轮对话上下文管理',
      'Week 2: 后端与 API 集成',
      '  • Node.js/Express 代理服务',
      '  • OpenAI API 流式接入',
      '  • SSE 实时推送与重连',
      'Week 3: 功能完善与部署',
      '  • 对话历史云端同步',
      '  • 提示词模板与角色设定',
      '  • Vercel + Railway 部署'
    ],
    resources: [
      { name: 'OpenAI API', url: 'https://platform.openai.com/docs' },
      { name: 'React 文档', url: 'https://react.dev' },
      { name: 'Vercel 部署', url: 'https://vercel.com' }
    ]
  },
  // ========== 英语模块 - 听力 ==========
  {
    id: 'english-listening-learn',
    categoryId: 'english',
    name: '🎧 听力学习',
    icon: 'Headphones',
    unit: '分钟',
    defaultDuration: 30,
    enabled: true,
    order: 10,
    group: '听力',
    groupOrder: 10,
    description: '听力技巧与方法学习',
    learningRoute: [
      '听力题型解析：填空/选择/配对',
      '定位词技巧：转折词/数字/专有名词',
      '同义替换总结规律',
      '精听 vs 泛听方法',
      '常见口音熟悉：英/美/澳'
    ],
    resources: [
      { name: '雅思哥听力', url: 'https://www.yasige.com' },
      { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish' },
      { name: 'TED Talks', url: 'https://www.ted.com/talks' }
    ]
  },
  {
    id: 'english-listening-practice',
    categoryId: 'english',
    name: '🎧 听力练习',
    icon: 'Headphones',
    unit: '分钟',
    defaultDuration: 30,
    enabled: true,
    order: 11,
    group: '听力',
    groupOrder: 11,
    description: '雅思听力真题/BBC/TED 实际练习',
    learningRoute: [
      '周一：雅思听力真题 Section 1-2',
      '周二：BBC Learning English 精听',
      '周三：雅思听力 Section 3-4',
      '周四：TED 演讲泛听',
      '周五：本周错题复盘',
      '周六/日：美剧/播客 磨耳朵'
    ],
    resources: [
      { name: '雅思听力真题', url: 'https://www.yasige.com' },
      { name: 'ESLPod', url: 'https://www.eslpod.com' },
      { name: '6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' }
    ]
  },

  // ========== 英语模块 - 口语 ==========
  {
    id: 'english-speaking-learn',
    categoryId: 'english',
    name: '🗣️ 口语学习',
    icon: 'Mic',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 20,
    group: '口语',
    groupOrder: 20,
    description: '口语技巧与素材积累',
    learningRoute: [
      'Part 1 答题结构：观点+原因+举例',
      'Part 2 线索卡准备法',
      'Part 3 答题思路：观点→解释→举例→总结',
      '连接词与高级词汇替换',
      '发音规则：连读/弱读/重音'
    ],
    resources: [
      { name: '雅思口语题库', url: 'https://www.yasi123.com' },
      { name: 'YouGlish', url: 'https://youglish.com' },
      { name: 'Rachel\'s English', url: 'https://rachelsenglish.com' }
    ]
  },
  {
    id: 'english-speaking-practice',
    categoryId: 'english',
    name: '🗣️ 口语练习',
    icon: 'Mic',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 21,
    group: '口语',
    groupOrder: 21,
    description: '实际口语练习',
    learningRoute: [
      'Day 1-2：Part 1 日常话题 10题',
      'Day 3-4：Part 2 卡片题 2道（2分钟/道）',
      'Day 5-6：Part 3 讨论题 10题',
      '每日影子跟读 10分钟',
      '每周外教/语伴练习 1次'
    ],
    resources: [
      { name: 'Cambly 外教', url: 'https://www.cambly.com' },
      { name: '口语侠', url: 'https://www.kouyuxia.com' },
      { name: '雅思哥口语', url: 'https://www.yasige.com' }
    ]
  },

  // ========== 英语模块 - 阅读 ==========
  {
    id: 'english-reading-learn',
    categoryId: 'english',
    name: '📖 阅读学习',
    icon: 'BookOpen',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 30,
    group: '阅读',
    groupOrder: 30,
    description: '阅读技巧与方法论',
    learningRoute: [
      '阅读顺序：标题→题目→文章',
      '定位词技巧与同义替换',
      '判断题解题技巧：True/False/Not Given',
      'heading 题配对技巧',
      '长难句分析方法'
    ],
    resources: [
      { name: '雅思阅读技巧', url: 'https://www.yasige.com' },
      { name: '扇贝阅读', url: 'https://www.shanbay.com/read' },
      { name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org' }
    ]
  },
  {
    id: 'english-reading-practice',
    categoryId: 'english',
    name: '📖 阅读练习',
    icon: 'BookOpen',
    unit: '篇',
    defaultDuration: 20,
    enabled: true,
    order: 31,
    group: '阅读',
    groupOrder: 31,
    description: '实际阅读练习',
    learningRoute: [
      '每日 1 篇雅思阅读真题（18分钟内）',
      '精读：生词/同义替换/长难句',
      '周六：The Economist / 卫报',
      '周日：本周阅读词汇整理',
      '阅读速度提升训练'
    ],
    resources: [
      { name: 'The Economist', url: 'https://www.economist.com' },
      { name: 'BBC News', url: 'https://www.bbc.com/news' },
      { name: 'National Geographic', url: 'https://www.nationalgeographic.com' }
    ]
  },

  // ========== 英语模块 - 写作 ==========
  {
    id: 'english-writing-learn',
    categoryId: 'english',
    name: '✍️ 写作学习',
    icon: 'PenTool',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 40,
    group: '写作',
    groupOrder: 40,
    description: '写作技巧与素材',
    learningRoute: [
      '小作文：图表描述结构与句型',
      '大作文：四大题型解题思路',
      'Task Response 评分标准',
      'Coherence & Cohesion 连接技巧',
      '词汇多样性：同义替换/词伙积累'
    ],
    resources: [
      { name: 'Simon 雅思', url: 'https://ielts-simon.com' },
      { name: '雅思写作真经', url: 'https://book.douban.com/subject/27169130' },
      { name: 'Grammarly', url: 'https://www.grammarly.com' }
    ]
  },
  {
    id: 'english-writing-practice',
    categoryId: 'english',
    name: '✍️ 写作练习',
    icon: 'PenTool',
    unit: '篇',
    defaultDuration: 30,
    enabled: true,
    order: 41,
    group: '写作',
    groupOrder: 41,
    description: '实际写作练习',
    learningRoute: [
      '周一：小作文（图表描述）1篇',
      '周三：大作文（议论文）1篇',
      '周五：Task Response 专项练习',
      '周六：万能论点整理/语料积累',
      '周日：作文批改与复盘',
      '目标：每周 2 篇完整作文'
    ],
    resources: [
      { name: 'IELTS Buddy', url: 'https://www.ieltsbuddy.com' },
      { name: 'Write & Improve', url: 'https://writeandimprove.com' },
      { name: 'Lang-8', url: 'https://lang-8.com' }
    ]
  },

  // ========== 英语模块 - 词汇 ==========
  {
    id: 'english-vocabulary',
    categoryId: 'english',
    name: '📚 词汇积累',
    icon: 'BookMarked',
    unit: '个',
    defaultDuration: 20,
    enabled: true,
    order: 50,
    group: '词汇',
    groupOrder: 50,
    description: '每日词汇积累',
    learningRoute: [
      '每日新词 20-30个',
      '复习旧词 50-100个（艾宾浩斯曲线）',
      '周六：本周词汇总复习',
      '周日：月度词汇测试',
      '重点：高频词汇、词根词缀'
    ],
    resources: [
      { name: '不背单词', url: 'https://www.bubei.cn' },
      { name: '墨墨背单词', url: 'https://www.maimemo.com' },
      { name: '雅思词汇真经', url: 'https://book.douban.com/subject/35112225' }
    ]
  },

  // ========== 考试模块 - PMP ==========
  {
    id: 'exam-pmp',
    categoryId: 'exam',
    name: 'PMP 备考',
    icon: 'BookOpen',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 10,
    group: 'PMP',
    groupOrder: 10,
    description: 'PMP 项目管理专业人士认证',
    learningRoute: [
      'Week 1-2：五大过程组学习',
      '• 启动过程组：项目章程、识别干系人',
      '• 规划过程组：所有子计划制定',
      '• 执行过程组：项目工作执行',
      '• 监控过程组：项目监控与控制',
      '• 收尾过程组：项目验收与总结',
      '',
      'Week 3-4：十大知识领域',
      '• 范围管理：WBS、需求收集',
      '• 进度管理：关键路径、CPM',
      '• 成本管理：估算、预算、挣值管理',
      '• 质量管理：QA/QC、七种工具',
      '• 资源、沟通、风险、采购、干系人管理'
    ],
    resources: [
      { name: 'PMI 官方', url: 'https://www.pmi.org' },
      { name: 'PMBOK 指南', url: 'https://www.pmi.org/pmbok' },
      { name: 'PMP 题库', url: 'https://www.pmi.org' }
    ]
  },
  {
    id: 'exam-pmp-practice',
    categoryId: 'exam',
    name: 'PMP 练题',
    icon: 'CheckCircle',
    unit: '题',
    defaultDuration: 30,
    enabled: true,
    order: 11,
    group: 'PMP',
    groupOrder: 11,
    description: 'PMP 考试真题练习',
    learningRoute: [
      '每日 20 题，涵盖五大过程组',
      'Week 1-2：场景题专项练习',
      'Week 3-4：计算题专项（EVM/CPM）',
      'Week 5-6：冲刺阶段，做模拟题',
      'Week 7-8：错题复盘，查漏补缺',
      '目标：通过模拟考试'
    ],
    resources: [
      { name: 'PMP 模拟题', url: 'https://www.pmi.org' },
      { name: 'PMP 计算题练习', url: 'https://www.pmi.org' }
    ]
  },

  // ========== 考试模块 - CSIP ==========
  {
    id: 'exam-csip',
    categoryId: 'exam',
    name: 'CSIP 备考',
    icon: 'Award',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 20,
    group: 'CSIP',
    groupOrder: 20,
    description: 'CSIP 系统集成项目管理工程师',
    learningRoute: [
      'Week 1-2：信息化基础',
      '• 信息系统建设与系统集成',
      '• 信息系统服务管理',
      '• 信息化战略与规划',
      '',
      'Week 3-4：项目管理基础',
      '• 项目管理知识体系',
      '• 项目立项、实施、验收流程',
      '• 项目监理方法',
      '',
      'Week 5-6：技术知识',
      '• 软件工程、网络技术',
      '• 信息安全、数据治理',
      '• 新技术应用（云计算、大数据、AI）'
    ],
    resources: [
      { name: 'CSIP 官方', url: 'http://www.csi-se.com.cn' },
      { name: 'CSIP 教程', url: 'http://www.csi-se.com.cn' }
    ]
  },
  {
    id: 'exam-csip-practice',
    categoryId: 'exam',
    name: 'CSIP 练题',
    icon: 'CheckSquare',
    unit: '题',
    defaultDuration: 30,
    enabled: true,
    order: 21,
    group: 'CSIP',
    groupOrder: 21,
    description: 'CSIP 考试真题练习',
    learningRoute: [
      '每日 20 题，上午案例题',
      '每日 20 题，下午选择填空题',
      'Week 1-2：综合知识专项',
      'Week 3-4：案例分析专项',
      'Week 5-6：历年真题模拟',
      'Week 7-8：错题复习与总结'
    ],
    resources: [
      { name: 'CSIP 真题', url: 'http://www.csi-se.com.cn' },
      { name: 'CSIP 题库', url: 'http://www.csi-se.com.cn' }
    ]
  },

  // ========== 考试模块 - IELTS ==========
  {
    id: 'exam-ielts-learn',
    categoryId: 'exam',
    name: 'IELTS 学习',
    icon: 'Languages',
    unit: '分钟',
    defaultDuration: 45,
    enabled: true,
    order: 30,
    group: 'IELTS',
    groupOrder: 30,
    description: '雅思学习技巧与方法',
    learningRoute: [
      '听力：题型分析与解题技巧',
      '• Section 1-4 各题型特点',
      '• 定位词与同义替换',
      '• 雅思听力 7.5+ 技巧',
      '',
      '阅读：三篇文章应试策略',
      '• 判断题、配对题、填空题',
      '• 长难句分析与时间分配',
      '• 雅思阅读 7.5+ 技巧',
      '',
      '写作：大小作文高分模板',
      '• 小作文图表描述结构',
      '• 大作文四大题型思路',
      '• 高级词汇与句型积累'
    ],
    resources: [
      { name: 'IELTS 官方', url: 'https://www.ielts.org' },
      { name: '剑桥雅思真题', url: 'https://www.cambridgeenglish.org' },
      { name: '雅思哥', url: 'https://www.yasige.com' }
    ]
  },
  {
    id: 'exam-ielts-practice',
    categoryId: 'exam',
    name: 'IELTS 练习',
    icon: 'CheckCircle',
    unit: '题',
    defaultDuration: 45,
    enabled: true,
    order: 31,
    group: 'IELTS',
    groupOrder: 31,
    description: '雅思真题实际练习',
    learningRoute: [
      '听力：每日 2 套剑桥听力',
      '阅读：每日 3 篇文章（54分钟）',
      '写作：每日 1 篇小作文 + 1 篇大作文',
      '口语：每日 Part 1-3 各准备 1 题',
      '每周：1 套完整模拟考试',
      '目标：总分 7.5+'
    ],
    resources: [
      { name: '剑桥雅思真题', url: 'https://www.cambridgeenglish.org' },
      { name: '雅思听力练习', url: 'https://www.yasige.com' }
    ]
  },

  // ========== 副业模块 - 行动 ==========
  {
    id: 'side-action',
    categoryId: 'side',
    name: '💰 变现行动',
    icon: 'Briefcase',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 1,
    group: '行动',
    groupOrder: 1,
    description: '自媒体、产品、接单，点击查看详情',
    learningRoute: [
      '📝 自媒体 - 短视频/公众号/博客',
      '🛠️ 产品 - SaaS/插件/模板',
      '💼 接单 - 外包/咨询/项目',
      '📊 复盘 - 数据分析/优化'
    ],
    resources: [
      { name: 'Indie Hackers', url: 'https://www.indiehackers.com' },
      { name: 'Product Hunt', url: 'https://www.producthunt.com' }
    ]
  },
  {
    id: 'side-content',
    categoryId: 'side',
    name: '自媒体内容',
    icon: 'Video',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 10,
    group: '行动',
    groupOrder: 10,
    description: '短视频、公众号、博客内容产出',
    learningRoute: [
      '定位：技术/职场/学习分享',
      '内容规划：选题库建立',
      '制作：脚本 → 录制/写作 → 编辑',
      '发布：公众号/知乎/B站/小红书',
      '数据分析：阅读/播放/互动率',
      '每周至少 2-3 篇内容'
    ],
    resources: [
      { name: '剪映', url: 'https://www.capcut.com' },
      { name: 'Canva', url: 'https://www.canva.com' },
      { name: '新榜', url: 'https://www.newrank.cn' },
      { name: 'B站创作中心', url: 'https://member.bilibili.com' }
    ]
  },
  {
    id: 'side-product',
    categoryId: 'side',
    name: '产品开发',
    icon: 'Rocket',
    unit: '分钟',
    defaultDuration: 60,
    enabled: true,
    order: 20,
    group: '行动',
    groupOrder: 20,
    description: 'SaaS工具、Chrome插件、付费模板',
    learningRoute: [
      '需求调研：目标用户痛点',
      'MVP 设计：核心功能确定',
      '开发迭代：2周完成MVP',
      '上线推广：Product Hunt',
      '变现：订阅/一次性付费',
      '案例：小红书模板、Notion模板'
    ],
    resources: [
      { name: 'Product Hunt', url: 'https://www.producthunt.com' },
      { name: 'Gumroad', url: 'https://gumroad.com' },
      { name: 'Lemon Squeezy', url: 'https://lemonsqueezy.com' },
      { name: 'Indie Hackers', url: 'https://www.indiehackers.com' }
    ]
  },
  {
    id: 'side-freelance',
    categoryId: 'side',
    name: '技能接单',
    icon: 'Users',
    unit: '单',
    defaultDuration: 30,
    enabled: true,
    order: 30,
    group: '行动',
    groupOrder: 30,
    description: '自由职业、外包项目、技术咨询',
    learningRoute: [
      '技能包：前端开发/技术咨询',
      '平台：Upwork/Fiverr/猪八戒',
      '简历：作品集展示',
      '定价：时薪 $30-100',
      '客户维护：长期合作',
      '目标：每月 2-3 单'
    ],
    resources: [
      { name: 'Upwork', url: 'https://www.upwork.com' },
      { name: 'Toptal', url: 'https://www.toptal.com' },
      { name: '电鸭社区', url: 'https://eleduck.com' },
      { name: '程序员客栈', url: 'https://www.proginn.com' }
    ]
  },
  {
    id: 'side-learning',
    categoryId: 'side',
    name: '副业技能',
    icon: 'GraduationCap',
    unit: '分钟',
    defaultDuration: 30,
    enabled: true,
    order: 40,
    group: '学习',
    groupOrder: 10,
    description: '短视频制作、运营、变现知识',
    learningRoute: [
      'Week 1-2：短视频剪辑技能',
      'Week 3-4：私域运营',
      'Week 5-6：自媒体变现模式',
      'Week 7-8：案例拆解',
      '持续关注：行业最新玩法'
    ],
    resources: [
      { name: '生财有术', url: 'https://www.shengcaiyouhu.com' },
      { name: '私域流量课', url: 'https://www.siyuyunying.com' },
      { name: '短视频运营', url: 'https://www.douyin.com' }
    ]
  },
  {
    id: 'side-research',
    categoryId: 'side',
    name: '市场调研',
    icon: 'Search',
    unit: '分钟',
    defaultDuration: 20,
    enabled: true,
    order: 5,
    description: '行业分析、竞品调研、用户访谈',
    learningRoute: [
      '每周：1 个细分赛道调研',
      '竞品分析：功能/定价/用户评价',
      '用户调研：问卷/访谈',
      '机会评估：市场规模/痛点',
      '形成：调研报告'
    ],
    resources: [
      { name: '艾瑞咨询', url: 'https://www.iresearch.com.cn' },
      { name: 'QuestMobile', url: 'https://www.questmobile.com.cn' },
      { name: '七麦数据', url: 'https://www.qimai.cn' },
      { name: 'SimilarWeb', url: 'https://www.similarweb.com' }
    ]
  },
];