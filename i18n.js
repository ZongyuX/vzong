// vzong · AI视频导航 - 中英双语国际化
// 用法：t('nav.studio') → 返回当前语言的字符串

const translations = {
  zh: {
    // ===== 通用 =====
    "common.loading": "加载中…",
    "common.copy": "复制",
    "common.copied": "已复制",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.close": "关闭",
    "common.back": "返回",
    "common.next": "下一步",
    "common.previous": "上一步",
    "common.save": "保存",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.download": "下载",
    "common.retry": "重试",
    "common.search": "搜索",
    "common.upload": "上传",
    "common.completed": "已完成",
    "common.inProgress": "进行中",
    "common.all": "全部",
    "common.online": "在线",
    "common.offline": "离线",
    "common.checking": "检测中",
    "common.optional": "可选",

    // ===== 品牌 =====
    "brand.name": "vzong",
    "brand.suffix": "·AI视频导航",
    "brand.tagline": "本地生成，云端引导",
    "brand.desc": "AI视频生成导航与创作社区",

    // ===== 导航 =====
    "nav.home": "首页",
    "nav.tutorials": "教程",
    "nav.workshop": "创意工坊",
    "nav.gallery": "我的画廊",
    "nav.settings": "设置",
    "nav.login": "登录",
    "nav.tryFree": "免费开始",
    "nav.logout": "退出",
    "nav.backHome": "返回首页",

    // ===== Landing 首页 =====
    "landing.badge": "网站做引导 · 你在本地生成 · 完全免费",
    "landing.titleLine1": "用 ComfyUI + LTX",
    "landing.titleLine2": "在你的电脑上生成 AI 视频",
    "landing.subtitle": "vzong 不调用任何付费 API。我们提供完整的 ComfyUI + LTX 教程、智能提示词增强器和个人作品画廊。硬件门槛交给你，剩下的引导与社区氛围交给我们。",
    "landing.cta.startTutorial": "开始学习",
    "landing.cta.visitWorkshop": "进入创意工坊",
    "landing.ctaPrimary": "免费开始",
    "landing.ctaSecondary": "查看示例",

    "landing.howitworks.title": "工作原理",
    "landing.howitworks.subtitle": "三个角色，各司其职",
    "landing.howitworks.step1.title": "网站：引导中心",
    "landing.howitworks.step1.desc": "我们提供从环境搭建到模型下载的完整图文教程，手把手带你跑通 ComfyUI + LTX 工作流。",
    "landing.howitworks.step2.title": "网站：创意工坊",
    "landing.howitworks.step2.desc": "内置提示词增强器，调用你本机的 Ollama 服务（完全免费），把一句话想法扩展为专业 Sora 2 风格工单。",
    "landing.howitworks.step3.title": "用户：本地生成",
    "landing.howitworks.step3.desc": "你在自己的电脑上完成视频生成。无需云端排队、无需积分、无需付费，硬件性能即上限。",
    "landing.howitworks.step4.title": "网站：作品展示",
    "landing.howitworks.step4.desc": "把生成的视频上传到个人画廊，分类管理、随时回看，构建你的创作档案。",

    "landing.features.title": "三大核心功能",
    "landing.features.subtitle": "聚焦引导、辅助与展示，不收取任何生成费用",
    "landing.features.tutorial.title": "教程系统",
    "landing.features.tutorial.desc": "6 章图文教程，覆盖 Python、Git、ComfyUI、LTX 模型、工作流配置、出片与排错。每章可标记完成，进度本地保存。",
    "landing.features.workshop.title": "创意工坊",
    "landing.features.workshop.desc": "提示词增强器调用本地 Ollama 服务（如 llama3.2、qwen2.5），把 \"小狗追蝴蝶\" 扩展为包含主体/场景/动作/镜头/风格/约束的结构化工单。",
    "landing.features.gallery.title": "个人画廊",
    "landing.features.gallery.desc": "上传你在本地生成的视频文件，按风格/日期分类管理，支持搜索、删除、元数据编辑。所有视频保存在浏览器 IndexedDB 中。",

    "landing.stats.tutorials": "章教程",
    "landing.stats.models": "兼容模型",
    "landing.stats.styles": "风格预设",
    "landing.stats.free": "% 免费",

    "landing.ctaFinal.title": "现在就开始你的本地 AI 视频之旅",
    "landing.ctaFinal.subtitle": "无需注册即可阅读所有教程，登录后可同步进度与作品元数据。生成能力掌握在你自己手里。",
    "landing.ctaFinal.button": "查看教程",

    // ===== Footer =====
    "landing.footer.tagline": "用本地算力重新定义 AI 视频创作，让每位创作者都拥有完整的工具链。",
    "landing.footer.copyright": "© 2026 vzong·AI视频导航. 保留所有权利.",
    "landing.footer.product": "产品",
    "landing.footer.resources": "资源",
    "landing.footer.legal": "法律",
    "landing.footer.productLinks": ["教程", "创意工坊", "我的画廊", "更新日志"],
    "landing.footer.resourcesLinks": ["ComfyUI 官网", "LTX 项目", "Ollama 官网", "社区论坛"],
    "landing.footer.legalLinks": ["使用条款", "隐私政策", "版权声明"],

    // ===== 教程系统 =====
    "tutorial.title": "教程系统",
    "tutorial.subtitle": "从零开始，在你的电脑上跑通 ComfyUI + LTX",
    "tutorial.progress": "学习进度",
    "tutorial.progressHint": "已完成 {done}/{total} 章",
    "tutorial.startLearning": "开始学习",
    "tutorial.continueLearning": "继续学习",
    "tutorial.markComplete": "标记为已完成",
    "tutorial.markedInComplete": "取消完成标记",
    "tutorial.completed": "已完成",
    "tutorial.prevChapter": "上一章",
    "tutorial.nextChapter": "下一章",
    "tutorial.backToList": "返回章节列表",
    "tutorial.estimatedTime": "预计 {min} 分钟",
    "tutorial.difficulty": "难度",
    "tutorial.difficulty.beginner": "入门",
    "tutorial.difficulty.intermediate": "进阶",
    "tutorial.difficulty.advanced": "高级",
    "tutorial.copyCode": "复制代码",
    "tutorial.warning": "注意事项",
    "tutorial.tip": "小贴士",
    "tutorial.requirement": "前置要求",

    // ===== 创意工坊 =====
    "workshop.title": "创意工坊",
    "workshop.subtitle": "用本地 Ollama 把一句话扩展为专业视频提示词",
    "workshop.ideaLabel": "你的创意想法",
    "workshop.ideaPlaceholder": "例如：一只柴犬在草地上追蝴蝶，阳光明媚",
    "workshop.examples": "示例想法",
    "workshop.example1": "夕阳下的城市天际线，车流如织",
    "workshop.example2": "一位老人在海边钓鱼，海浪轻拍礁石",
    "workshop.example3": "霓虹灯下的赛博朋克街道，雨水反光",
    "workshop.example4": "水墨风格的山水画，云雾缭绕",

    "workshop.advanced": "高级设置",
    "workshop.camera": "运镜",
    "workshop.camera.push": "推 - 缓慢推进",
    "workshop.camera.pull": "拉 - 逐渐拉远",
    "workshop.camera.pan": "摇 - 水平摇摄",
    "workshop.camera.tilt": "移 - 垂直移动",
    "workshop.camera.random": "随机 - 混合运镜",
    "workshop.duration": "时长",
    "workshop.durationUnit": "秒",
    "workshop.style": "风格",
    "workshop.style.cinematic": "电影感",
    "workshop.style.cyberpunk": "赛博朋克",
    "workshop.style.ink": "水墨风",
    "workshop.style.anime": "动漫",
    "workshop.style.realistic": "写实",
    "workshop.style.fantasy": "奇幻",
    "workshop.style.watercolor": "水彩",

    "workshop.ollamaStatus": "Ollama 状态",
    "workshop.ollamaOnline": "已连接",
    "workshop.ollamaOffline": "未连接",
    "workshop.ollamaChecking": "检测中…",
    "workshop.ollamaUrl": "Ollama 地址",
    "workshop.ollamaUrlHint": "默认 http://localhost:11434",
    "workshop.ollamaModel": "选择模型",
    "workshop.ollamaNoModels": "未发现模型，请先在 Ollama 中拉取一个，例如：ollama pull llama3.2",
    "workshop.ollamaRefresh": "刷新模型列表",
    "workshop.ollamaHelp": "如何安装 Ollama？",
    "workshop.ollamaHelpDesc": "访问 ollama.com 下载安装，然后运行 ollama pull llama3.2 拉取一个模型。启动后保持终端窗口开启即可。",

    "workshop.enhance": "调用 Ollama 增强提示词",
    "workshop.enhancing": "Ollama 思考中…",
    "workshop.fallback": "使用内置规则增强（无需 Ollama）",
    "workshop.fallbackHint": "未连接到 Ollama，已使用内置规则为你生成基础工单，可手动复制后编辑",

    "workshop.result.title": "增强结果",
    "workshop.result.copyPrompt": "复制完整提示词",
    "workshop.result.copyWorkOrder": "复制结构化工单",
    "workshop.result.fullPrompt": "完整提示词",
    "workshop.result.workOrder": "结构化工单（Sora 2 风格）",
    "workshop.result.subject": "主体",
    "workshop.result.scene": "场景",
    "workshop.result.action": "动作",
    "workshop.result.camera": "镜头",
    "workshop.result.style": "风格",
    "workshop.result.constraints": "约束",
    "workshop.result.empty": "点击上方按钮，开始生成你的专业提示词",

    // ===== 个人画廊 =====
    "gallery.title": "我的画廊",
    "gallery.subtitle": "上传并管理你在本地生成的视频作品",
    "gallery.uploadBtn": "上传视频",
    "gallery.uploadHint": "点击或拖拽视频文件到此处",
    "gallery.uploadFormats": "支持 MP4 / WebM / MOV，单个文件最大 200MB",
    "gallery.uploading": "上传中…",
    "gallery.uploadSuccess": "上传成功",
    "gallery.uploadFailed": "上传失败",
    "gallery.fileTooLarge": "文件过大，最大支持 200MB",
    "gallery.invalidFormat": "请上传 MP4 / WebM / MOV 格式的视频",

    "gallery.statTotal": "作品总数",
    "gallery.statDuration": "总时长",
    "gallery.statStorage": "占用空间",
    "gallery.statStyles": "风格数量",

    "gallery.filter": "筛选",
    "gallery.filterAll": "全部风格",
    "gallery.sortNewest": "最新优先",
    "gallery.sortOldest": "最早优先",
    "gallery.searchPlaceholder": "搜索标题或描述…",

    "gallery.empty.title": "画廊还是空的",
    "gallery.empty.desc": "在本地用 ComfyUI + LTX 生成视频后，点击右上角 \"上传视频\" 把作品保存到这里。所有视频仅保存在你浏览器的 IndexedDB 中，不会上传到任何服务器。",
    "gallery.empty.cta": "查看教程开始生成",

    "gallery.card.title": "未命名作品",
    "gallery.card.untitled": "未命名",
    "gallery.card.edit": "编辑信息",
    "gallery.card.delete": "删除",
    "gallery.card.download": "下载",
    "gallery.card.duration": "时长",
    "gallery.card.size": "大小",
    "gallery.card.createdAt": "创建于",
    "gallery.card.confirmDelete": "确定删除这个作品吗？此操作无法撤销。",

    "gallery.editModal.title": "编辑作品信息",
    "gallery.editModal.videoTitle": "标题",
    "gallery.editModal.description": "描述",
    "gallery.editModal.style": "风格标签",
    "gallery.editModal.prompt": "原始提示词",
    "gallery.editModal.save": "保存",

    // ===== 设置 =====
    "settings.title": "设置",
    "settings.subtitle": "管理你的账户与偏好",
    "settings.profile": "个人信息",
    "settings.profile.title": "个人信息",
    "settings.profile.desc": "查看你的账户信息",
    "settings.profile.joinedAt": "加入于",
    "settings.accountType": "账户类型",
    "settings.accountTypeGuest": "访客",
    "settings.accountTypeUser": "注册用户",
    "settings.username": "用户名",
    "settings.email": "邮箱",

    "settings.stats": "学习与创作统计",
    "settings.stats.tutorialProgress": "教程进度",
    "settings.stats.galleryCount": "画廊作品",
    "settings.stats.workshopCount": "工坊调用次数",

    "settings.preferences.title": "偏好设置",
    "settings.preferences.desc": "个性化你的使用体验",
    "settings.preferences.language": "界面语言",
    "settings.preferences.languageDesc": "中英文自由切换",
    "settings.preferences.darkMode": "暗色模式",
    "settings.preferences.darkModeDesc": "已开启，护眼舒适",
    "settings.preferences.ollamaUrl": "Ollama 默认地址",
    "settings.preferences.ollamaUrlDesc": "创意工坊默认连接的本地 Ollama 服务地址",

    "settings.dataManagement": "数据管理",
    "settings.exportGallery": "导出画廊元数据",
    "settings.exportGalleryDesc": "导出画廊中所有作品的标题、描述、风格等元数据为 JSON（不含视频文件本身）",
    "settings.clearLocal": "清除本地数据",
    "settings.clearLocalDesc": "将删除本地保存的所有画廊视频、教程进度和访客会话",
    "settings.clearLocalBtn": "清除数据",
    "settings.clearLocalConfirm": "确定要清除所有本地数据吗？这将删除你的画廊视频和教程进度，无法撤销。",

    // ===== Auth =====
    "auth.loginTitle": "登录 vzong",
    "auth.loginSubtitle": "登录后可同步教程进度与作品元数据到云端",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.username": "用户名",
    "auth.loginBtn": "登录",
    "auth.signupBtn": "注册",
    "auth.google": "使用 Google 登录",
    "auth.github": "使用 GitHub 登录",
    "auth.guest": "访客模式继续",
    "auth.guestHint": "数据仅保存在本地，登录后可云端同步",
    "auth.noAccount": "还没有账号？",
    "auth.hasAccount": "已有账号？",
    "auth.signup": "立即注册",
    "auth.login": "去登录",
    "auth.welcomeBack": "欢迎回来",
    "auth.logoutSuccess": "已退出登录",
    "auth.guestMode": "已进入访客模式",

    // ===== Errors =====
    "error.generic": "操作失败，请重试",
    "error.network": "网络错误，请检查连接",
    "error.auth": "认证失败",
    "error.ollamaConnection": "无法连接到 Ollama 服务，请确认已启动",
    "error.ollamaGenerate": "Ollama 生成失败，请重试",
    "error.dbQuota": "存储空间不足，请删除部分旧作品后重试",
  },

  en: {
    // ===== Common =====
    "common.loading": "Loading…",
    "common.copy": "Copy",
    "common.copied": "Copied",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.download": "Download",
    "common.retry": "Retry",
    "common.search": "Search",
    "common.upload": "Upload",
    "common.completed": "Completed",
    "common.inProgress": "In progress",
    "common.all": "All",
    "common.online": "Online",
    "common.offline": "Offline",
    "common.checking": "Checking",
    "common.optional": "optional",

    // ===== Brand =====
    "brand.name": "vzong",
    "brand.suffix": "·AI Video Navigator",
    "brand.tagline": "Generate locally, guided globally",
    "brand.desc": "AI video generation guide and creator community",

    // ===== Navigation =====
    "nav.home": "Home",
    "nav.tutorials": "Tutorials",
    "nav.workshop": "Workshop",
    "nav.gallery": "Gallery",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.tryFree": "Try Free",
    "nav.logout": "Logout",
    "nav.backHome": "Back Home",

    // ===== Landing =====
    "landing.badge": "Site guides · You generate locally · 100% free",
    "landing.titleLine1": "Generate AI videos on your own machine",
    "landing.titleLine2": "with ComfyUI + LTX",
    "landing.subtitle": "vzong does NOT call any paid API. We provide complete ComfyUI + LTX tutorials, a smart prompt enhancer, and a personal gallery. Hardware is your responsibility; guidance and community are ours.",
    "landing.cta.startTutorial": "Start Learning",
    "landing.cta.visitWorkshop": "Visit Workshop",
    "landing.ctaPrimary": "Get Started Free",
    "landing.ctaSecondary": "View Examples",

    "landing.howitworks.title": "How It Works",
    "landing.howitworks.subtitle": "Three roles, each doing what they do best",
    "landing.howitworks.step1.title": "Site: Guide Center",
    "landing.howitworks.step1.desc": "We provide a complete illustrated tutorial from environment setup to model download, walking you through the ComfyUI + LTX workflow step by step.",
    "landing.howitworks.step2.title": "Site: Creative Workshop",
    "landing.howitworks.step2.desc": "Built-in prompt enhancer calls your local Ollama service (completely free), expanding a one-liner into a Sora 2-style structured work order.",
    "landing.howitworks.step3.title": "User: Local Generation",
    "landing.howitworks.step3.desc": "You run video generation on your own computer. No cloud queue, no credits, no fees — your hardware is the only ceiling.",
    "landing.howitworks.step4.title": "Site: Showcase",
    "landing.howitworks.step4.desc": "Upload your generated videos to the personal gallery, categorize and manage them, build your creative archive over time.",

    "landing.features.title": "Three Core Features",
    "landing.features.subtitle": "Focus on guidance, assistance and showcase — no generation fees charged",
    "landing.features.tutorial.title": "Tutorial System",
    "landing.features.tutorial.desc": "6 illustrated chapters covering Python, Git, ComfyUI, LTX model, workflow setup, rendering and troubleshooting. Mark each chapter complete; progress saved locally.",
    "landing.features.workshop.title": "Creative Workshop",
    "landing.features.workshop.desc": "Prompt enhancer calls local Ollama (e.g. llama3.2, qwen2.5), expanding \"puppy chasing butterflies\" into a structured work order with subject / scene / action / camera / style / constraints.",
    "landing.features.gallery.title": "Personal Gallery",
    "landing.features.gallery.desc": "Upload your locally generated video files, categorize by style/date, search, delete, edit metadata. All videos persist in your browser's IndexedDB.",

    "landing.stats.tutorials": "chapters",
    "landing.stats.models": "compatible models",
    "landing.stats.styles": "style presets",
    "landing.stats.free": "% free",

    "landing.ctaFinal.title": "Start your local AI video journey today",
    "landing.ctaFinal.subtitle": "Read all tutorials without signing up. Login to sync progress and work metadata. Generation power stays in your hands.",
    "landing.ctaFinal.button": "View Tutorials",

    // ===== Footer =====
    "landing.footer.tagline": "Redefining AI video creation with local compute — every creator deserves the full toolchain.",
    "landing.footer.copyright": "© 2026 vzong·AI Video Navigator. All rights reserved.",
    "landing.footer.product": "Product",
    "landing.footer.resources": "Resources",
    "landing.footer.legal": "Legal",
    "landing.footer.productLinks": ["Tutorials", "Workshop", "Gallery", "Changelog"],
    "landing.footer.resourcesLinks": ["ComfyUI", "LTX Project", "Ollama", "Community"],
    "landing.footer.legalLinks": ["Terms", "Privacy", "Copyright"],

    // ===== Tutorials =====
    "tutorial.title": "Tutorials",
    "tutorial.subtitle": "From zero to running ComfyUI + LTX on your machine",
    "tutorial.progress": "Learning Progress",
    "tutorial.progressHint": "{done}/{total} chapters completed",
    "tutorial.startLearning": "Start Learning",
    "tutorial.continueLearning": "Continue Learning",
    "tutorial.markComplete": "Mark as Complete",
    "tutorial.markedInComplete": "Mark as Incomplete",
    "tutorial.completed": "Completed",
    "tutorial.prevChapter": "Previous Chapter",
    "tutorial.nextChapter": "Next Chapter",
    "tutorial.backToList": "Back to chapter list",
    "tutorial.estimatedTime": "{min} min",
    "tutorial.difficulty": "Difficulty",
    "tutorial.difficulty.beginner": "Beginner",
    "tutorial.difficulty.intermediate": "Intermediate",
    "tutorial.difficulty.advanced": "Advanced",
    "tutorial.copyCode": "Copy Code",
    "tutorial.warning": "Warning",
    "tutorial.tip": "Tip",
    "tutorial.requirement": "Prerequisite",

    // ===== Workshop =====
    "workshop.title": "Creative Workshop",
    "workshop.subtitle": "Expand a one-liner into a pro video prompt with local Ollama",
    "workshop.ideaLabel": "Your Creative Idea",
    "workshop.ideaPlaceholder": "e.g. A Shiba Inu chasing butterflies on a sunny meadow",
    "workshop.examples": "Example ideas",
    "workshop.example1": "City skyline at sunset, traffic flowing like a river",
    "workshop.example2": "An old man fishing by the sea, waves lapping against rocks",
    "workshop.example3": "Cyberpunk street under neon lights, rain reflecting colors",
    "workshop.example4": "Ink-wash landscape painting, clouds drifting through mountains",

    "workshop.advanced": "Advanced Settings",
    "workshop.camera": "Camera Movement",
    "workshop.camera.push": "Push - Slow push-in",
    "workshop.camera.pull": "Pull - Gradual pull-back",
    "workshop.camera.pan": "Pan - Horizontal pan",
    "workshop.camera.tilt": "Tilt - Vertical movement",
    "workshop.camera.random": "Random - Mixed camera",
    "workshop.duration": "Duration",
    "workshop.durationUnit": "s",
    "workshop.style": "Style",
    "workshop.style.cinematic": "Cinematic",
    "workshop.style.cyberpunk": "Cyberpunk",
    "workshop.style.ink": "Ink Wash",
    "workshop.style.anime": "Anime",
    "workshop.style.realistic": "Realistic",
    "workshop.style.fantasy": "Fantasy",
    "workshop.style.watercolor": "Watercolor",

    "workshop.ollamaStatus": "Ollama Status",
    "workshop.ollamaOnline": "Connected",
    "workshop.ollamaOffline": "Not Connected",
    "workshop.ollamaChecking": "Checking…",
    "workshop.ollamaUrl": "Ollama URL",
    "workshop.ollamaUrlHint": "Default http://localhost:11434",
    "workshop.ollamaModel": "Select Model",
    "workshop.ollamaNoModels": "No models found. Pull one in Ollama first, e.g.: ollama pull llama3.2",
    "workshop.ollamaRefresh": "Refresh model list",
    "workshop.ollamaHelp": "How to install Ollama?",
    "workshop.ollamaHelpDesc": "Download from ollama.com, then run ollama pull llama3.2 to pull a model. Keep the terminal window open after starting.",

    "workshop.enhance": "Enhance Prompt with Ollama",
    "workshop.enhancing": "Ollama is thinking…",
    "workshop.fallback": "Use built-in rule enhancer (no Ollama needed)",
    "workshop.fallbackHint": "Ollama not connected — generated a basic work order using built-in rules. Copy and edit manually.",

    "workshop.result.title": "Enhanced Result",
    "workshop.result.copyPrompt": "Copy Full Prompt",
    "workshop.result.copyWorkOrder": "Copy Structured Work Order",
    "workshop.result.fullPrompt": "Full Prompt",
    "workshop.result.workOrder": "Structured Work Order (Sora 2 style)",
    "workshop.result.subject": "Subject",
    "workshop.result.scene": "Scene",
    "workshop.result.action": "Action",
    "workshop.result.camera": "Camera",
    "workshop.result.style": "Style",
    "workshop.result.constraints": "Constraints",
    "workshop.result.empty": "Click the button above to generate your pro prompt",

    // ===== Gallery =====
    "gallery.title": "My Gallery",
    "gallery.subtitle": "Upload and manage videos you generated locally",
    "gallery.uploadBtn": "Upload Video",
    "gallery.uploadHint": "Click or drag a video file here",
    "gallery.uploadFormats": "Supports MP4 / WebM / MOV, max 200MB per file",
    "gallery.uploading": "Uploading…",
    "gallery.uploadSuccess": "Uploaded",
    "gallery.uploadFailed": "Upload failed",
    "gallery.fileTooLarge": "File too large, max 200MB supported",
    "gallery.invalidFormat": "Please upload MP4 / WebM / MOV video",

    "gallery.statTotal": "Total Videos",
    "gallery.statDuration": "Total Duration",
    "gallery.statStorage": "Storage Used",
    "gallery.statStyles": "Style Count",

    "gallery.filter": "Filter",
    "gallery.filterAll": "All styles",
    "gallery.sortNewest": "Newest first",
    "gallery.sortOldest": "Oldest first",
    "gallery.searchPlaceholder": "Search title or description…",

    "gallery.empty.title": "Gallery is empty",
    "gallery.empty.desc": "After generating videos locally with ComfyUI + LTX, click \"Upload Video\" in the top-right to save your works here. All videos persist in your browser's IndexedDB and are never uploaded to any server.",
    "gallery.empty.cta": "View tutorials to start generating",

    "gallery.card.title": "Untitled Work",
    "gallery.card.untitled": "Untitled",
    "gallery.card.edit": "Edit info",
    "gallery.card.delete": "Delete",
    "gallery.card.download": "Download",
    "gallery.card.duration": "Duration",
    "gallery.card.size": "Size",
    "gallery.card.createdAt": "Created",
    "gallery.card.confirmDelete": "Delete this work? This action cannot be undone.",

    "gallery.editModal.title": "Edit Work Info",
    "gallery.editModal.videoTitle": "Title",
    "gallery.editModal.description": "Description",
    "gallery.editModal.style": "Style Tag",
    "gallery.editModal.prompt": "Original Prompt",
    "gallery.editModal.save": "Save",

    // ===== Settings =====
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and preferences",
    "settings.profile": "Profile",
    "settings.profile.title": "Profile",
    "settings.profile.desc": "View your account information",
    "settings.profile.joinedAt": "Joined",
    "settings.accountType": "Account Type",
    "settings.accountTypeGuest": "Guest",
    "settings.accountTypeUser": "Registered User",
    "settings.username": "Username",
    "settings.email": "Email",

    "settings.stats": "Learning & Creation Stats",
    "settings.stats.tutorialProgress": "Tutorial Progress",
    "settings.stats.galleryCount": "Gallery Works",
    "settings.stats.workshopCount": "Workshop Calls",

    "settings.preferences.title": "Preferences",
    "settings.preferences.desc": "Personalize your experience",
    "settings.preferences.language": "Interface language",
    "settings.preferences.languageDesc": "Switch between Chinese and English",
    "settings.preferences.darkMode": "Dark mode",
    "settings.preferences.darkModeDesc": "Enabled, eye-friendly",
    "settings.preferences.ollamaUrl": "Default Ollama URL",
    "settings.preferences.ollamaUrlDesc": "Local Ollama service URL that the Workshop connects to by default",

    "settings.dataManagement": "Data Management",
    "settings.exportGallery": "Export Gallery Metadata",
    "settings.exportGalleryDesc": "Export all gallery work titles, descriptions and styles as JSON (video files not included)",
    "settings.clearLocal": "Clear Local Data",
    "settings.clearLocalDesc": "Delete all locally stored gallery videos, tutorial progress and guest sessions",
    "settings.clearLocalBtn": "Clear Data",
    "settings.clearLocalConfirm": "Are you sure you want to clear all local data? This will delete your gallery videos and tutorial progress. This cannot be undone.",

    // ===== Auth =====
    "auth.loginTitle": "Login to vzong",
    "auth.loginSubtitle": "Sync your tutorial progress and work metadata to the cloud after login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.username": "Username",
    "auth.loginBtn": "Login",
    "auth.signupBtn": "Sign Up",
    "auth.google": "Continue with Google",
    "auth.github": "Continue with GitHub",
    "auth.guest": "Continue as Guest",
    "auth.guestHint": "Data is saved locally only, login to sync to cloud",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signup": "Sign Up",
    "auth.login": "Login",
    "auth.welcomeBack": "Welcome back",
    "auth.logoutSuccess": "Logged out",
    "auth.guestMode": "Entered guest mode",

    // ===== Errors =====
    "error.generic": "Operation failed, please retry",
    "error.network": "Network error, check your connection",
    "error.auth": "Authentication failed",
    "error.ollamaConnection": "Cannot connect to Ollama service, please confirm it's running",
    "error.ollamaGenerate": "Ollama generation failed, please retry",
    "error.dbQuota": "Storage quota exceeded, please delete some old works and retry",
  },
};

// === i18n state ===
let currentLang = localStorage.getItem('vzong-lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('vzong-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  window.dispatchEvent(new CustomEvent('lang-change', { detail: lang }));
}

function getLang() {
  return currentLang;
}

function t(key, vars) {
  const dict = translations[currentLang] || translations.zh;
  let str = dict[key] || translations.zh[key] || key;
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
  }
  return str;
}

function tArray(key) {
  const dict = translations[currentLang] || translations.zh;
  return dict[key] || translations.zh[key] || [];
}

function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
}

function applyTranslations(root = document) {
  const elements = root.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

window.i18n = { t, tArray, setLang, getLang, toggleLang, applyTranslations, translations };
