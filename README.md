# vzong · AI视频工坊

> 用想象力驱动视频未来 - AI 视频生成 SaaS 工具

## 📦 文件清单

```
vzong-app/
├── index.html          ← 入口 HTML（2.5 KB，加载 CDN 资源）
├── styles.css          ← 自定义样式（10 KB，深邃科技蓝主题）
├── firebase-config.js  ← Firebase 初始化（用户提供的真实配置）
├── i18n.js             ← 中英双语字典（16 KB）
├── work-order.js       ← Sora 2 结构化工单生成器（10 KB）
├── app.js              ← 主应用逻辑（53 KB，vanilla JS）
└── README.md           ← 本文档
```

**总大小**：约 112 KB（不含 CDN 资源）

## 🚀 部署到 GitHub Pages

### 方式 A：直接部署（推荐）

1. 在 GitHub 新建一个仓库，例如 `vzong-app`
2. 将 `vzong-app/` 目录下**所有文件**复制到仓库根目录
3. 推送到 `main` 分支
4. 进入仓库 **Settings → Pages**
5. Source 选择 `Deploy from a branch`
6. Branch 选择 `main`，目录选 `/ (root)`
7. 保存后等待 1-2 分钟
8. 访问 `https://<你的用户名>.github.io/vzong-app/`

### 方式 B：用户根域名部署

1. 新建仓库 `<你的用户名>.github.io`
2. 将所有文件推送到 `main` 分支
3. 同样在 Settings → Pages 启用
4. 访问 `https://<你的用户名>.github.io/`

## ✨ 核心特性

- 🌐 **中英双语切换**：右上角一键切换中/EN，所有界面文案同步
- 🔐 **Firebase 认证**：邮箱密码、Google、GitHub 三种登录方式 + 访客模式
- 💰 **积分系统**：访客模式自动赠送 20 积分，登录后云端同步
- 🎬 **图生视频**：参考阿里万相 Wan2.5 / Google Veo3 设计
  - 并排图片上传（JPG/PNG，最大 5MB）+ 文字指令输入
  - 3 个内置示例提示词
  - 折叠的"高级设置"：运镜控制（推/拉/摇/移/随机）、视频时长（5-15s 滑块）、风格滤镜（7种胶囊按钮）
- 📋 **Sora 2 结构化工单**：自动将用户指令扩展为 6 模块
  - 主体 / 场景 / 动作 / 镜头 / 风格 / 约束
  - 一键复制完整工单
- 🎨 **7 种风格滤镜**：电影感、赛博朋克、水墨风、动漫、写实、奇幻、水彩
- 🖼️ **Canvas 缩略图生成**：纯前端生成动态几何动画快照
- 📊 **任务管理**：实时进度、缩略图、下载、删除、重试
- 💾 **本地持久化**：所有任务、积分、设置保存在 localStorage

## 🎨 设计风格

- 主色：深邃科技蓝 `#0A1128`
- 强调色：亮青色 `#00F0FF`
- 字体：系统默认（支持中英文）
- 暗色模式
- 玻璃拟态（glassmorphism）卡片
- 渐变发光按钮
- 流畅动画过渡

## 🛠️ 技术栈

- **HTML5 + Vanilla JavaScript**（无 React、无构建步骤）
- **Tailwind CSS v4**（通过 CDN 加载）
- **Firebase 10.12.0**（compat 模式，CDN 加载）
  - Authentication
  - Firestore（用户积分云端同步）

## 🧪 本地预览

```bash
# 方式 1：Python 内置服务器
cd vzong-app
python3 -m http.server 3000
# 访问 http://localhost:3000

# 方式 2：Node serve
npx serve vzong-app

# 方式 3：直接打开
# 在文件管理器中双击 index.html 也可工作（但需要联网加载 CDN）
```

## ⚙️ Firebase 配置

已在 `firebase-config.js` 中配置真实 Firebase 项目：

```js
const firebaseConfig = {
  apiKey: "AIzaSyCHh6hHsHo7niP_Rztnb_ZyROgPZxYJ2q8",
  authDomain: "zongv-65dec.firebaseapp.com",
  projectId: "zongv-65dec",
  storageBucket: "zongv-65dec.firebasestorage.app",
  messagingSenderId: "549323863140",
  appId: "1:549323863140:web:1904ffa5d1c003d8da5b71",
  measurementId: "G-LPB2Q0N1L1"
};
```

### 启用 Firebase 服务

1. 访问 [Firebase Console](https://console.firebase.google.com/)，进入 `zongv-65dec` 项目
2. **Authentication** → Sign-in method → 启用：
   - Email/Password
   - Google
   - GitHub
3. **Firestore Database** → Create database → Production mode
4. **添加 Firestore 安全规则**（允许已登录用户读写自己的积分）：
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /userCredits/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 📝 使用流程

1. 打开网站 → 看到 Landing 页面
2. 点击"免费开始创作" → 弹出登录弹窗
3. 选择：邮箱注册 / Google / GitHub / 访客模式
4. 进入 Dashboard → 选择"文生视频"或"图生视频"
5. （图生视频）上传图片 + 输入动作指令
6. 展开"高级设置"调整运镜、时长、风格
7. 查看 Sora 2 结构化工单（自动生成）
8. 点击"生成视频 ✨"
9. 等待生成完成 → 下载或查看作品

## 🔧 二次开发

本项目为纯静态网站，无构建步骤。修改任意文件后刷新浏览器即可看到效果。

### 修改文案

编辑 `i18n.js` 中的 `translations.zh` 和 `translations.en` 对象。

### 修改 Firebase 配置

编辑 `firebase-config.js` 中的 `firebaseConfig` 对象。

### 修改工单生成逻辑

编辑 `work-order.js` 中的关键词映射规则和 `generateWorkOrder()` 函数。

### 接入真实 AI 视频 API

修改 `app.js` 中的 `startVideoGeneration()` 函数，替换 Canvas 模拟为真实 API 调用（如 Sora / Wan / Veo / Kling）。

## 📄 许可证

MIT License
