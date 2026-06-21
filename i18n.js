// vzong · AI视频工坊 - 中英双语国际化
// 用法：t('nav.studio') → 返回当前语言的字符串

const translations = {
  zh: {
    // ===== 通用 =====
    "common.loading": "加载中…",
    "common.credits": "积分",
    "common.creditsUnit": "积分",
    "common.buy": "购买",
    "common.recharge": "充值",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.close": "关闭",
    "common.back": "返回",
    "common.next": "下一步",
    "common.previous": "上一步",
    "common.submit": "提交",
    "common.save": "保存",
    "common.delete": "删除",
    "common.viewAll": "查看全部",
    "common.download": "下载",
    "common.copy": "复制",
    "common.copied": "已复制",
    "common.retry": "重试",

    // ===== 品牌 =====
    "brand.name": "vzong",
    "brand.suffix": "·AI视频工坊",
    "brand.tagline": "用想象力驱动视频未来",

    // ===== 导航 =====
    "nav.studio": "创作中心",
    "nav.gallery": "我的作品",
    "nav.settings": "账户设置",
    "nav.login": "登录",
    "nav.tryFree": "免费试用",
    "nav.logout": "退出登录",
    "nav.backHome": "返回首页",

    // ===== Landing =====
    "landing.badge": "AI 驱动的下一代视频创作平台",
    "landing.badgeNew": "NEW",
    "landing.titleLine1": "用想象力",
    "landing.titleLine2": "驱动视频未来",
    "landing.subtitle": "输入文字或上传图片，AI 自动生成专业级视频。支持文生视频、图生视频、7种风格滤镜，无需任何剪辑技能。",
    "landing.ctaPrimary": "免费开始创作",
    "landing.ctaSecondary": "查看示例",
    "landing.feature1Title": "文生视频",
    "landing.feature1Desc": "输入一句话，AI 自动理解并生成对应的视频内容",
    "landing.feature2Title": "图生视频",
    "landing.feature2Desc": "上传任意图片，让画面中的人物或物体动起来",
    "landing.feature3Title": "Sora 2 工单",
    "landing.feature3Desc": "自动构建6模块结构化工单，生成质量更稳定",
    "landing.feature4Title": "7种风格",
    "landing.feature4Desc": "电影感、赛博朋克、水墨风等风格一键应用",
    "landing.statsVideos": "已生成视频",
    "landing.statsUsers": "活跃用户",
    "landing.statsStyles": "风格滤镜",
    "landing.statsSatisfaction": "用户满意度",
    "landing.exampleTitle": "看看别人在创作什么",
    "landing.exampleDesc": "来自社区的真实作品，激发你的灵感",

    // ===== Dashboard =====
    "dashboard.welcome": "欢迎回来",
    "dashboard.creditsBalance": "积分余额",
    "dashboard.creditsHint": "每次生成消耗 1 积分",
    "dashboard.tab.textToVideo": "文生视频",
    "dashboard.tab.imageToVideo": "图生视频",
    "dashboard.recentTasks": "最近生成",
    "dashboard.noTasks": "还没有任务，开始你的第一次创作吧",

    // ===== Text-to-Video =====
    "ttv.promptLabel": "视频描述",
    "ttv.promptPlaceholder": "描述你想要的视频，例如：一只柴犬在草地上追蝴蝶，阳光明媚，电影感镜头",
    "ttv.generate": "生成视频",
    "ttv.generateHint": "消耗 1 积分 · 约 30 秒",

    // ===== Image-to-Video =====
    "itv.uploadTitle": "上传图片",
    "itv.uploadHint": "点击或拖拽 JPG/PNG 图片到此处",
    "itv.uploadFormats": "支持 JPG / PNG，最大 5MB",
    "itv.uploaded": "已上传",
    "itv.changeImage": "更换图片",
    "itv.promptLabel": "动作指令",
    "itv.promptPlaceholder": "描述图片中的人物或物体应该如何运动",
    "itv.examples": "示例指令",
    "itv.example1": "让图中人物开心地跳舞",
    "itv.example2": "让小狗追逐蝴蝶",
    "itv.example3": "让照片里的人演唱一首歌",
    "itv.generate": "生成视频",

    // ===== Advanced Settings =====
    "advanced.title": "高级设置",
    "advanced.camera": "运镜控制",
    "advanced.camera.push": "推 - 缓慢推进",
    "advanced.camera.pull": "拉 - 逐渐拉远",
    "advanced.camera.pan": "摇 - 水平摇摄",
    "advanced.camera.tilt": "移 - 垂直移动",
    "advanced.camera.random": "随机 - 混合运镜",
    "advanced.duration": "视频时长",
    "advanced.durationValue": "秒",
    "advanced.style": "风格滤镜",
    "advanced.style.cinematic": "电影感",
    "advanced.style.cyberpunk": "赛博朋克",
    "advanced.style.ink": "水墨风",
    "advanced.style.anime": "动漫",
    "advanced.style.realistic": "写实",
    "advanced.style.fantasy": "奇幻",
    "advanced.style.watercolor": "水彩",

    // ===== Work Order (Sora 2) =====
    "workorder.title": "结构化工单（Sora 2 规范）",
    "workorder.desc": "系统已将你的指令扩展为6模块结构化工单，确保生成质量稳定",
    "workorder.subject": "主体",
    "workorder.scene": "场景",
    "workorder.action": "动作",
    "workorder.camera": "镜头",
    "workorder.style": "风格",
    "workorder.constraints": "约束",
    "workorder.copyAll": "复制完整工单",
    "workorder.fullText": "完整工单",

    // ===== Task Status =====
    "task.queued": "排队中",
    "task.processing": "生成中",
    "task.completed": "已完成",
    "task.failed": "生成失败",
    "task.download": "下载",
    "task.delete": "删除",
    "task.retry": "重试",
    "task.empty": "暂无作品",

    // ===== Auth =====
    "auth.loginTitle": "登录 vzong",
    "auth.loginSubtitle": "登录后可同步积分与作品到云端",
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
    "auth.signupSuccess": "注册成功，赠送 20 积分",
    "auth.logoutSuccess": "已退出登录",
    "auth.guestMode": "已进入访客模式",

    // ===== Credits =====
    "credits.title": "购买积分",
    "credits.subtitle": "选择适合你的套餐",
    "credits.pack1": "新手包",
    "credits.pack1Desc": "20 积分",
    "credits.pack2": "创作者包",
    "credits.pack2Desc": "100 积分 + 10 赠送",
    "credits.pack3": "工作室包",
    "credits.pack3Desc": "500 积分 + 80 赠送",
    "credits.insufficient": "积分不足",
    "credits.insufficientDesc": "本次生成需要 1 积分，请充值后继续",
    "credits.buy": "立即购买",

    // ===== Settings =====
    "settings.title": "账户设置",
    "settings.profile": "个人信息",
    "settings.username": "用户名",
    "settings.email": "邮箱",
    "settings.accountType": "账户类型",
    "settings.accountTypeGuest": "访客",
    "settings.accountTypeUser": "注册用户",
    "settings.stats": "创作统计",
    "settings.totalGenerated": "累计生成",
    "settings.joinedAt": "加入时间",
    "settings.dangerZone": "危险操作",
    "settings.clearLocal": "清除本地数据",
    "settings.clearLocalDesc": "将删除本地保存的所有任务和访客会话",
    "settings.clearLocalBtn": "清除数据",

    // ===== Errors =====
    "error.generic": "操作失败，请重试",
    "error.network": "网络错误，请检查连接",
    "error.auth": "认证失败",
    "error.upload": "上传失败，请重试",
    "error.fileTooLarge": "文件过大，最大支持 5MB",
    "error.invalidImage": "请上传 JPG 或 PNG 格式的图片",
  },

  en: {
    // ===== Common =====
    "common.loading": "Loading…",
    "common.credits": "Credits",
    "common.creditsUnit": "credits",
    "common.buy": "Buy",
    "common.recharge": "Recharge",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.viewAll": "View All",
    "common.download": "Download",
    "common.copy": "Copy",
    "common.copied": "Copied",
    "common.retry": "Retry",

    // ===== Brand =====
    "brand.name": "vzong",
    "brand.suffix": "·AI Video Studio",
    "brand.tagline": "Drive the future of video with imagination",

    // ===== Navigation =====
    "nav.studio": "Studio",
    "nav.gallery": "My Works",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.tryFree": "Try Free",
    "nav.logout": "Logout",
    "nav.backHome": "Back Home",

    // ===== Landing =====
    "landing.badge": "AI-powered next-gen video creation platform",
    "landing.badgeNew": "NEW",
    "landing.titleLine1": "Drive the future",
    "landing.titleLine2": "of video with imagination",
    "landing.subtitle": "Type text or upload an image, AI generates professional videos automatically. Supports text-to-video, image-to-video, 7 style filters — no editing skills required.",
    "landing.ctaPrimary": "Start Creating Free",
    "landing.ctaSecondary": "View Examples",
    "landing.feature1Title": "Text to Video",
    "landing.feature1Desc": "Type a sentence, AI understands and generates matching video content",
    "landing.feature2Title": "Image to Video",
    "landing.feature2Desc": "Upload any image, bring characters or objects to life",
    "landing.feature3Title": "Sora 2 Work Order",
    "landing.feature3Desc": "Auto-builds 6-module structured work order for stable quality",
    "landing.feature4Title": "7 Styles",
    "landing.feature4Desc": "Cinematic, cyberpunk, ink wash and more — one click to apply",
    "landing.statsVideos": "Videos Generated",
    "landing.statsUsers": "Active Users",
    "landing.statsStyles": "Style Filters",
    "landing.statsSatisfaction": "User Satisfaction",
    "landing.exampleTitle": "See What Others Are Creating",
    "landing.exampleDesc": "Real works from the community to inspire you",

    // ===== Dashboard =====
    "dashboard.welcome": "Welcome back",
    "dashboard.creditsBalance": "Credits Balance",
    "dashboard.creditsHint": "Each generation costs 1 credit",
    "dashboard.tab.textToVideo": "Text to Video",
    "dashboard.tab.imageToVideo": "Image to Video",
    "dashboard.recentTasks": "Recent Generations",
    "dashboard.noTasks": "No tasks yet, start your first creation",

    // ===== Text-to-Video =====
    "ttv.promptLabel": "Video Description",
    "ttv.promptPlaceholder": "Describe the video you want, e.g. A Shiba Inu chasing butterflies on a sunny meadow, cinematic shot",
    "ttv.generate": "Generate Video",
    "ttv.generateHint": "Costs 1 credit · ~30 seconds",

    // ===== Image-to-Video =====
    "itv.uploadTitle": "Upload Image",
    "itv.uploadHint": "Click or drag a JPG/PNG image here",
    "itv.uploadFormats": "Supports JPG / PNG, max 5MB",
    "itv.uploaded": "Uploaded",
    "itv.changeImage": "Change Image",
    "itv.promptLabel": "Action Instruction",
    "itv.promptPlaceholder": "Describe how characters or objects in the image should move",
    "itv.examples": "Example Instructions",
    "itv.example1": "Make the person in the image dance happily",
    "itv.example2": "Make the puppy chase butterflies",
    "itv.example3": "Make the person in the photo sing a song",
    "itv.generate": "Generate Video",

    // ===== Advanced Settings =====
    "advanced.title": "Advanced Settings",
    "advanced.camera": "Camera Movement",
    "advanced.camera.push": "Push - Slow push-in",
    "advanced.camera.pull": "Pull - Gradual pull-back",
    "advanced.camera.pan": "Pan - Horizontal pan",
    "advanced.camera.tilt": "Tilt - Vertical movement",
    "advanced.camera.random": "Random - Mixed camera",
    "advanced.duration": "Video Duration",
    "advanced.durationValue": "s",
    "advanced.style": "Style Filter",
    "advanced.style.cinematic": "Cinematic",
    "advanced.style.cyberpunk": "Cyberpunk",
    "advanced.style.ink": "Ink Wash",
    "advanced.style.anime": "Anime",
    "advanced.style.realistic": "Realistic",
    "advanced.style.fantasy": "Fantasy",
    "advanced.style.watercolor": "Watercolor",

    // ===== Work Order (Sora 2) =====
    "workorder.title": "Structured Work Order (Sora 2 Spec)",
    "workorder.desc": "The system has expanded your instruction into a 6-module structured work order for stable generation quality",
    "workorder.subject": "Subject",
    "workorder.scene": "Scene",
    "workorder.action": "Action",
    "workorder.camera": "Camera",
    "workorder.style": "Style",
    "workorder.constraints": "Constraints",
    "workorder.copyAll": "Copy Full Work Order",
    "workorder.fullText": "Full Work Order",

    // ===== Task Status =====
    "task.queued": "Queued",
    "task.processing": "Processing",
    "task.completed": "Completed",
    "task.failed": "Failed",
    "task.download": "Download",
    "task.delete": "Delete",
    "task.retry": "Retry",
    "task.empty": "No works yet",

    // ===== Auth =====
    "auth.loginTitle": "Login to vzong",
    "auth.loginSubtitle": "Sync your credits and works to the cloud after login",
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
    "auth.signupSuccess": "Sign up successful, 20 credits granted",
    "auth.logoutSuccess": "Logged out",
    "auth.guestMode": "Entered guest mode",

    // ===== Credits =====
    "credits.title": "Buy Credits",
    "credits.subtitle": "Choose a plan that fits you",
    "credits.pack1": "Starter",
    "credits.pack1Desc": "20 credits",
    "credits.pack2": "Creator",
    "credits.pack2Desc": "100 credits + 10 bonus",
    "credits.pack3": "Studio",
    "credits.pack3Desc": "500 credits + 80 bonus",
    "credits.insufficient": "Insufficient Credits",
    "credits.insufficientDesc": "This generation requires 1 credit, please recharge to continue",
    "credits.buy": "Buy Now",

    // ===== Settings =====
    "settings.title": "Account Settings",
    "settings.profile": "Profile",
    "settings.username": "Username",
    "settings.email": "Email",
    "settings.accountType": "Account Type",
    "settings.accountTypeGuest": "Guest",
    "settings.accountTypeUser": "Registered User",
    "settings.stats": "Creation Stats",
    "settings.totalGenerated": "Total Generated",
    "settings.joinedAt": "Joined At",
    "settings.dangerZone": "Danger Zone",
    "settings.clearLocal": "Clear Local Data",
    "settings.clearLocalDesc": "This will delete all locally saved tasks and guest sessions",
    "settings.clearLocalBtn": "Clear Data",

    // ===== Errors =====
    "error.generic": "Operation failed, please retry",
    "error.network": "Network error, check your connection",
    "error.auth": "Authentication failed",
    "error.upload": "Upload failed, please retry",
    "error.fileTooLarge": "File too large, max 5MB supported",
    "error.invalidImage": "Please upload a JPG or PNG image",
  },
};

// === i18n state ===
let currentLang = localStorage.getItem('vzong-lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('vzong-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  // 触发全局语言变更事件
  window.dispatchEvent(new CustomEvent('lang-change', { detail: lang }));
}

function getLang() {
  return currentLang;
}

function t(key) {
  const dict = translations[currentLang] || translations.zh;
  return dict[key] || translations.zh[key] || key;
}

function toggleLang() {
  setLang(currentLang === 'zh' ? 'en' : 'zh');
}

// 应用所有 data-i18n 属性的元素
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

window.i18n = { t, setLang, getLang, toggleLang, applyTranslations, translations };
