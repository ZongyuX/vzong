# vzong · AI视频导航

> **本地生成 · 云端引导** —— 一个把生成能力交还给用户、网站只做引导与展示的 AI 视频创作社区。

## 核心理念

vzong 不调用任何付费的 AI 视频 API。我们把"能否生成"的责任和"硬件门槛"交给用户，网站聚焦于提供：

- 📚 **完整的图文教程**：从零开始跑通 ComfyUI + LTX
- ✨ **本地提示词增强**：调用本机 Ollama 服务，把一句话想法扩展为专业工单
- 🎬 **个人作品画廊**：上传、分类、管理你在本地生成的视频

## 三大核心功能

### 1. 教程系统（Tutorials）

6 章完整图文教程，覆盖 ComfyUI + LTX 从安装到出片的全流程：

| 章 | 标题 | 难度 | 预计时长 |
|---|---|---|---|
| 1 | 准备工作（Python / Git / CUDA） | 入门 | 15 min |
| 2 | 安装 ComfyUI（便携版 + Manager） | 入门 | 20 min |
| 3 | 下载 LTX 模型（含 T5 编码器） | 进阶 | 15 min |
| 4 | 配置工作流（节点解析 + 参数调优） | 进阶 | 25 min |
| 5 | 生成第一个视频（含图生视频） | 入门 | 10 min |
| 6 | 常见问题排查（OOM / 模型加载 / 画质） | 高级 | 15 min |

每章支持代码块一键复制、注意事项 / 小贴士高亮、标记完成进度（本地保存）。

### 2. 创意工坊（Workshop）

内置**提示词增强器**：

- 输入一句话想法（如"一只柴犬在草地上追蝴蝶"）
- 选择运镜（推/拉/摇/移/随机）、时长（5-15秒）、风格（7种）
- 点击按钮调用**本机 Ollama 服务**（如 llama3.2、qwen2.5），生成专业英文提示词
- 同时生成 **Sora 2 风格 6 模块结构化工单**（主体/场景/动作/镜头/风格/约束）
- 一键复制完整提示词或工单

**Ollama 未启动时自动降级**到内置规则增强器，仍能生成基础工单。

### 3. 个人画廊（Gallery）

- 上传 MP4 / WebM / MOV 视频（最大 200MB / 单文件）
- 支持拖拽上传
- 视频文件保存在浏览器 **IndexedDB** 中（不上传到任何服务器）
- 按风格筛选、按时间排序、按标题/描述搜索
- 在线播放、下载、编辑元数据（标题/描述/风格/原始提示词）
- 统计：作品总数、总时长、占用空间、风格数量
- 设置页支持导出画廊元数据为 JSON

## 技术栈

- **HTML5 + Vanilla JavaScript**（无 React、无构建步骤）
- **Tailwind CSS v4** via `@tailwindcss/browser@4` CDN
- **Firebase 10.12.0** compat 模式（可选，用于未来云端同步）
- **IndexedDB** 用于视频文件本地持久化
- **Ollama HTTP API** 用于本地 LLM 调用
- 设计：暗色主题 + 玻璃拟态，主色 `#0A1128`，强调色 `#00F0FF`

## 文件结构

```
vzong-app/
├── index.html           (3.0K)  入口 HTML，加载 Tailwind + Firebase + 自定义脚本
├── styles.css           (14K)   暗色主题样式（玻璃拟态、代码块、视频卡片等）
├── firebase-config.js   (1.7K)  Firebase 配置（项目: zongv-65dec）
├── i18n.js              (29K)   中英双语完整字典
├── tutorials.js         (49K)   6 章教程数据（每章中英双语）
├── work-order.js        (10K)   Sora 2 风格结构化工单生成器
├── ollama.js            (6.8K)  Ollama API 客户端
├── gallery-db.js        (5.1K)  IndexedDB 视频存储 CRUD
├── app.js               (63K)   主应用逻辑（5 视图：landing/tutorials/workshop/gallery/settings）
├── README.md            (本文件)
└── .nojekyll                    GitHub Pages 必需
```

## 部署到 GitHub Pages

1. 解压后将 `vzong-app/` 内**所有文件**复制到 GitHub 仓库根目录
2. 推送到 `main` 分支
3. 进入仓库 Settings → Pages → Source: Branch `main`, /root → Save
4. 等 1-2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`

> 因为使用 Tailwind CDN + Firebase CDN，无需任何构建步骤，开箱即用。

## 本地预览

```bash
cd vzong-app
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

## 使用流程

1. **学习教程**：从首页进入"教程"，按章节学习 ComfyUI + LTX 安装
2. **准备 Ollama**（可选）：访问 ollama.com 下载安装，运行 `ollama pull llama3.2`
3. **生成提示词**：进入"创意工坊"，输入想法，点击增强按钮
4. **本地生成视频**：在 ComfyUI 中粘贴提示词，运行工作流出片
5. **上传到画廊**：回到 vzong "我的画廊"，上传你的视频作品

## 设计要点

- **零成本运行**：GitHub Pages 免费托管，无后端服务器
- **隐私优先**：所有视频仅存浏览器本地，永不上传
- **降级友好**：Ollama 离线时仍能用内置规则增强；IndexedDB 不可用时给出明确错误
- **中英双语**：所有界面文案、教程内容、提示词模板都支持中英切换
- **响应式**：桌面/平板/手机自适应，移动端导航横向滚动

## 浏览器要求

- 现代浏览器（Chrome 100+ / Edge 100+ / Firefox 100+ / Safari 15+）
- 启用 JavaScript
- 支持 IndexedDB（用于画廊视频存储）
- 支持 File API（用于视频上传）

## 登录系统

支持四种登录方式（全部连接 Firebase Auth）：

1. **Google 一键登录** —— 弹窗 OAuth，被屏蔽时自动降级到 redirect
2. **GitHub 一键登录** —— 弹窗 OAuth，同上
3. **邮箱 + 密码** —— 支持登录/注册切换，注册时可设置用户名
4. **访客模式** —— 不调用 Firebase，数据仅保存在本地

### Firebase 控制台需要启用的登录方式

进入 Firebase Console → Authentication → Sign-in method，启用以下任一/全部：

- **Email/Password**（邮箱密码登录）
- **Google**（一键登录，需配置项目公开邮箱）
- **GitHub**（需在 GitHub 创建 OAuth App，把 Client ID/Secret 填入 Firebase）

### 域名授权

部署后需要在 Firebase Console → Authentication → Settings → Authorized domains 添加你的域名：

- `localhost`（本地开发）
- `<用户名>.github.io`（GitHub Pages 部署后）

否则会报 `auth/unauthorized-domain` 错误。

### 登录状态自动同步

- 通过 `onAuthStateChanged` 监听全局登录状态
- 用户登录/退出会自动同步到 Firestore `users` 集合
- 退出登录时若是 Firebase 用户会调用 `signOut()`，若是访客只清本地状态

## 许可与致谢

- 教程中提到的所有软件（ComfyUI / LTX-Video / Ollama / Python / Git / ffmpeg）均属其原作者所有
- vzong 仅作为引导与展示工具，不分发上述软件
- 感谢 Lightricks 团队开源 LTX-Video 模型

---

© 2026 vzong · AI视频导航. 本地生成，云端引导。
