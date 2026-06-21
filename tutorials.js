// vzong · AI视频导航 - 教程内容数据
// 6章完整 ComfyUI + LTX 安装与使用教程
// 每个章节包含 steps，每个 step 可包含 text / code / warning / tip / requirement

const TUTORIALS = [
  {
    id: 'ch1-prep',
    difficulty: 'beginner',
    estimatedMin: 15,
    zh: {
      title: '第 1 章 · 准备工作',
      summary: '确认你的电脑硬件与系统，安装 Python 和 Git 这两个核心依赖。',
      steps: [
        {
          type: 'text',
          content: '欢迎来到 vzong 教程第一章。在本章中，我们会确认你的电脑是否满足运行 ComfyUI + LTX 的最低要求，并安装两个核心依赖：Python 与 Git。整个过程不需要任何编程基础，跟着步骤操作即可。',
        },
        {
          type: 'text',
          heading: '1.1 硬件要求',
          content: 'LTX 是 Lightricks 开源的视频生成模型，对显存相对友好，但仍需要一张独立显卡。最低配置：NVIDIA GPU 显存 6GB（如 RTX 2060 / 3060 / 4060）；推荐配置：显存 12GB 及以上（如 RTX 3060 12G / 4070 / 4080）。AMD 显卡和 Apple Silicon（M1/M2/M3）虽然可以运行，但配置较复杂，建议新手优先使用 NVIDIA。',
        },
        {
          type: 'warning',
          content: 'CPU 模式理论可行但每帧需要数分钟，不推荐用于实际创作。如果你的电脑没有独立显卡，建议先在云端（如 AutoDL、RunPod）租用 GPU 实例学习。',
        },
        {
          type: 'text',
          heading: '1.2 系统要求',
          content: '支持 Windows 10/11、macOS 12+、Ubuntu 20.04+。本教程以 Windows 11 为主，Mac/Linux 用户需自行调整路径（如把 C:\\ 替换为 /Users/你）。建议预留至少 50GB 可用磁盘空间用于模型与缓存。',
        },
        {
          type: 'text',
          heading: '1.3 安装 Python 3.11',
          content: '前往 python.org 下载 Python 3.11.x 安装包。**重要：安装时务必勾选 \"Add Python to PATH\"**，否则后续命令行无法识别 python 命令。安装完成后打开命令提示符（Win+R 输入 cmd），输入下面命令验证：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'python --version\n# 应输出: Python 3.11.x',
        },
        {
          type: 'tip',
          content: '不要使用 Python 3.13+，部分依赖库尚未完全适配。3.11 是当前最稳定的版本。',
        },
        {
          type: 'text',
          heading: '1.4 安装 Git',
          content: '前往 git-scm.com 下载 Git for Windows，一路下一步默认安装即可。安装后验证：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'git --version\n# 应输出: git version 2.x.x',
        },
        {
          type: 'text',
          heading: '1.5 安装 NVIDIA 驱动与 CUDA',
          content: '前往 NVIDIA 官网下载最新的 Game Ready 或 Studio 驱动并安装。CUDA Toolkit 通常不需要单独安装，ComfyUI 自带的 torch 已经包含 CUDA 运行时。验证显卡是否被识别：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'nvidia-smi\n# 应显示你的显卡型号、驱动版本和 CUDA 版本',
        },
        {
          type: 'text',
          heading: '1.6 创建工作目录',
          content: '建议在 D 盘根目录创建一个 ai-video 文件夹用于存放所有相关文件。后续教程都会以这个目录为基准：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'mkdir D:\\ai-video\ncd D:\\ai-video',
        },
        {
          type: 'tip',
          content: '路径中不要包含中文和空格，否则部分工具会出错。例如不要用 D:\\我的视频 工坊。',
        },
      ],
    },
    en: {
      title: 'Chapter 1 · Preparation',
      summary: 'Verify your hardware and OS, install Python and Git as core dependencies.',
      steps: [
        {
          type: 'text',
          content: 'Welcome to Chapter 1 of the vzong tutorial. In this chapter we verify that your machine meets the minimum requirements for running ComfyUI + LTX, and install two core dependencies: Python and Git. No programming background needed — just follow the steps.',
        },
        {
          type: 'text',
          heading: '1.1 Hardware Requirements',
          content: 'LTX is an open-source video generation model from Lightricks. It is relatively VRAM-friendly but still requires a discrete GPU. Minimum: NVIDIA GPU with 6GB VRAM (e.g. RTX 2060 / 3060 / 4060). Recommended: 12GB+ VRAM (e.g. RTX 3060 12G / 4070 / 4080). AMD GPUs and Apple Silicon (M1/M2/M3) can work but setup is more complex — NVIDIA is recommended for beginners.',
        },
        {
          type: 'warning',
          content: 'CPU mode is technically possible but takes minutes per frame — not suitable for real creation. If you have no discrete GPU, consider renting a cloud GPU instance (AutoDL, RunPod) for learning.',
        },
        {
          type: 'text',
          heading: '1.2 OS Requirements',
          content: 'Supports Windows 10/11, macOS 12+, Ubuntu 20.04+. This tutorial uses Windows 11 as the primary example. Mac/Linux users need to adjust paths (e.g. replace C:\\ with /Users/you). Reserve at least 50GB free disk space for models and cache.',
        },
        {
          type: 'text',
          heading: '1.3 Install Python 3.11',
          content: 'Download Python 3.11.x from python.org. **Important: check \"Add Python to PATH\" during installation**, otherwise the python command won\'t be recognized. After installation, open Command Prompt (Win+R, type cmd) and verify:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'python --version\n# Should output: Python 3.11.x',
        },
        {
          type: 'tip',
          content: 'Do not use Python 3.13+ — some dependencies are not yet fully compatible. 3.11 is currently the most stable version.',
        },
        {
          type: 'text',
          heading: '1.4 Install Git',
          content: 'Download Git for Windows from git-scm.com, install with default options. Verify after install:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'git --version\n# Should output: git version 2.x.x',
        },
        {
          type: 'text',
          heading: '1.5 Install NVIDIA Driver & CUDA',
          content: 'Download the latest Game Ready or Studio driver from NVIDIA\'s website. CUDA Toolkit usually doesn\'t need separate installation — the torch bundled with ComfyUI includes the CUDA runtime. Verify your GPU is detected:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'nvidia-smi\n# Should show your GPU model, driver version and CUDA version',
        },
        {
          type: 'text',
          heading: '1.6 Create Working Directory',
          content: 'Create an ai-video folder on your D: drive to hold all related files. Subsequent chapters will use this as the base directory:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'mkdir D:\\ai-video\ncd D:\\ai-video',
        },
        {
          type: 'tip',
          content: 'Avoid Chinese characters and spaces in paths — some tools break otherwise. For example, do NOT use D:\\My Video Workshop.',
        },
      ],
    },
  },

  {
    id: 'ch2-comfyui',
    difficulty: 'beginner',
    estimatedMin: 20,
    zh: {
      title: '第 2 章 · 安装 ComfyUI',
      summary: '下载 ComfyUI 便携版，配置 Python 虚拟环境，启动并访问 Web 界面。',
      steps: [
        {
          type: 'text',
          content: '本章我们安装 ComfyUI —— 一个基于节点图的开源 AI 图像/视频生成工作流引擎。ComfyUI 的优势在于可视化、可组合、社区生态丰富，是 LTX 模型的首选运行环境。',
        },
        {
          type: 'text',
          heading: '2.1 下载 ComfyUI 便携版',
          content: 'Windows 用户推荐直接下载官方便携版（已包含 Python 环境和 PyTorch）。访问 github.com/comfyanonymous/ComfyUI/releases，下载最新的 ComfyUI_windows_portable_nvidia_cu121_sized.zip 文件（约 2GB）。解压到 D:\\ai-video\\ComfyUI_windows_portable。',
        },
        {
          type: 'tip',
          content: '如果下载速度慢，可以使用 ghproxy.com 等镜像加速，或者用迅雷等多线程下载工具。',
        },
        {
          type: 'text',
          heading: '2.2 目录结构说明',
          content: '解压后目录结构如下，了解每个文件夹的作用对后续操作很重要：',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'ComfyUI_windows_portable/\n├── ComfyUI/\n│   ├── models/        # 模型文件存放处\n│   │   ├── checkpoints/  # 大模型\n│   │   ├── loras/         # LoRA 微调\n│   │   ├── vae/           # VAE\n│   │   └── diffusion_models/  # 扩散模型\n│   ├── custom_nodes/  # 自定义节点\n│   ├── output/        # 生成结果\n│   ├── workflows/     # 工作流 JSON\n│   └── web/           # 前端界面\n├── update/            # 更新脚本\n├── python_embeded/    # 内置 Python 环境\n└── run_nvidia_gpu.bat  # 启动脚本',
        },
        {
          type: 'text',
          heading: '2.3 首次启动',
          content: '双击 run_nvidia_gpu.bat 启动 ComfyUI。第一次启动会初始化环境，可能需要 1-2 分钟。当命令行出现 \"To see the GUI go to: http://127.0.0.1:8188\" 时，说明启动成功。',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'To see the GUI go to: http://127.0.0.1:8188',
        },
        {
          type: 'text',
          heading: '2.4 访问 Web 界面',
          content: '在浏览器中打开 http://127.0.0.1:8188，即可看到 ComfyUI 的节点编辑界面。默认会加载一个基础的文生图工作流。如果你看到的是空画布，点击右上角的 \"Load Default\" 按钮加载默认工作流。',
        },
        {
          type: 'warning',
          content: '启动后请勿关闭命令行窗口，否则 ComfyUI 会停止运行。如果意外关闭，重新双击 run_nvidia_gpu.bat 即可。',
        },
        {
          type: 'text',
          heading: '2.5 安装 ComfyUI Manager（强烈推荐）',
          content: 'ComfyUI Manager 是社区开发的管理插件，可以一键安装其他自定义节点和下载模型。安装方法：在 D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\custom_nodes 目录下打开命令行，执行：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'cd D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\custom_nodes\ngit clone https://github.com/ltdrdata/ComfyUI-Manager.git',
        },
        {
          type: 'text',
          content: '安装后重启 ComfyUI（关闭命令行窗口再重新启动），刷新浏览器，会在右侧面板看到新增的 \"Manager\" 按钮。',
        },
        {
          type: 'tip',
          content: '通过 Manager → Model Manager，可以直接搜索并下载社区共享的模型，无需手动找下载链接。',
        },
      ],
    },
    en: {
      title: 'Chapter 2 · Install ComfyUI',
      summary: 'Download ComfyUI portable, configure Python env, launch and access the web UI.',
      steps: [
        {
          type: 'text',
          content: 'In this chapter we install ComfyUI — an open-source node-based AI image/video generation workflow engine. ComfyUI\'s strengths are its visual, composable design and rich community ecosystem — it is the preferred runtime for LTX.',
        },
        {
          type: 'text',
          heading: '2.1 Download ComfyUI Portable',
          content: 'Windows users should download the official portable build (includes Python env and PyTorch). Visit github.com/comfyanonymous/ComfyUI/releases and download the latest ComfyUI_windows_portable_nvidia_cu121_sized.zip (~2GB). Extract to D:\\ai-video\\ComfyUI_windows_portable.',
        },
        {
          type: 'tip',
          content: 'If download is slow, use a mirror like ghproxy.com or a multi-threaded download tool.',
        },
        {
          type: 'text',
          heading: '2.2 Directory Structure',
          content: 'After extraction, the structure looks like this. Understanding each folder is important for subsequent steps:',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'ComfyUI_windows_portable/\n├── ComfyUI/\n│   ├── models/        # Model files\n│   │   ├── checkpoints/  # Main models\n│   │   ├── loras/         # LoRA fine-tunes\n│   │   ├── vae/           # VAE\n│   │   └── diffusion_models/  # Diffusion models\n│   ├── custom_nodes/  # Custom nodes\n│   ├── output/        # Generated results\n│   ├── workflows/     # Workflow JSON\n│   └── web/           # Frontend UI\n├── update/            # Update scripts\n├── python_embeded/    # Embedded Python env\n└── run_nvidia_gpu.bat  # Launch script',
        },
        {
          type: 'text',
          heading: '2.3 First Launch',
          content: 'Double-click run_nvidia_gpu.bat to launch ComfyUI. The first launch initializes the environment and may take 1-2 minutes. When the console shows "To see the GUI go to: http://127.0.0.1:8188", launch was successful.',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'To see the GUI go to: http://127.0.0.1:8188',
        },
        {
          type: 'text',
          heading: '2.4 Access the Web UI',
          content: 'Open http://127.0.0.1:8188 in your browser to see ComfyUI\'s node editor. A basic text-to-image workflow loads by default. If you see a blank canvas, click the "Load Default" button in the top-right.',
        },
        {
          type: 'warning',
          content: 'Do not close the console window after launch — ComfyUI will stop running. If accidentally closed, just double-click run_nvidia_gpu.bat again.',
        },
        {
          type: 'text',
          heading: '2.5 Install ComfyUI Manager (strongly recommended)',
          content: 'ComfyUI Manager is a community-developed management plugin that lets you install other custom nodes and download models with one click. To install, open a terminal in D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\custom_nodes and run:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'cd D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\custom_nodes\ngit clone https://github.com/ltdrdata/ComfyUI-Manager.git',
        },
        {
          type: 'text',
          content: 'After installation, restart ComfyUI (close the console and relaunch), refresh the browser, and you\'ll see a new "Manager" button in the right panel.',
        },
        {
          type: 'tip',
          content: 'Via Manager → Model Manager, you can search and download community-shared models directly — no need to find download links manually.',
        },
      ],
    },
  },

  {
    id: 'ch3-ltx-model',
    difficulty: 'intermediate',
    estimatedMin: 15,
    zh: {
      title: '第 3 章 · 下载 LTX 模型',
      summary: '从 Hugging Face 下载 LTX-Video 模型，放置到正确目录。',
      steps: [
        {
          type: 'text',
          content: 'LTX-Video 是 Lightricks 开源的视频生成模型，支持文生视频和图生视频。它在 24GB 显存下可生成 1080p 视频，并通过量化压缩技术降低到 12GB 显存可用，是目前开源视频模型中效率较高的选择。',
        },
        {
          type: 'text',
          heading: '3.1 模型选择',
          content: '我们推荐下载两个版本：ltx-video-2b-v0.9.1.safetensors（主模型，约 5GB，FP8 量化版）和 ltx-video-2b-v0.9.1-dev.safetensors（开发版，质量稍好但更大）。新手只需下载第一个即可。',
        },
        {
          type: 'text',
          heading: '3.2 从 Hugging Face 下载',
          content: '访问 huggingface.co/Lightricks/LTX-Video，找到 Files & versions 标签页。下载 ltx-video-2b-v0.9.1.safetensors 文件。如果访问缓慢，可以使用 hf-mirror.com 镜像站。',
        },
        {
          type: 'tip',
          content: '使用 huggingface-cli 工具可以断点续传，命令：huggingface-cli download Lightricks/LTX-Video ltx-video-2b-v0.9.1.safetensors --local-dir ./models',
        },
        {
          type: 'text',
          heading: '3.3 放置到正确目录',
          content: '将下载的 .safetensors 文件移动到 ComfyUI 的 diffusion_models 目录（注意：不是 checkpoints 目录！）：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\diffusion_models\\\n  └── ltx-video-2b-v0.9.1.safetensors',
        },
        {
          type: 'warning',
          content: 'LTX 模型必须放在 diffusion_models 目录下，因为它是扩散模型而非传统 checkpoint。放错目录会导致 ComfyUI 无法识别。',
        },
        {
          type: 'text',
          heading: '3.4 下载辅助 VAE（可选但推荐）',
          content: 'LTX 模型内置了 VAE，但下载官方独立的 VAE 文件可以提升视频质量。访问 huggingface.co/Lightricks/LTX-Video 下载 vae.safetensors，放置到：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\vae\\\n  └── ltx-vae.safetensors',
        },
        {
          type: 'text',
          heading: '3.5 下载文本编码器',
          content: 'LTX 使用 T5-XXL 作为文本编码器。访问 huggingface.co/Comfyanonymous/t5xxl_GGUF 下载 t5xxl_Q5_K_M.safetensors（约 5GB，Q5 量化版够用），放置到：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\text_encoders\\\n  └── t5xxl_Q5_K_M.safetensors',
        },
        {
          type: 'tip',
          content: '如果 text_encoders 目录不存在，手动创建即可。T5 编码器对中英文提示词都有较好支持。',
        },
        {
          type: 'text',
          heading: '3.6 验证模型加载',
          content: '重启 ComfyUI，在节点图中添加一个 \"Load Diffusion Model\" 节点，点击模型名称下拉框，应能看到 ltx-video-2b-v0.9.1.safetensors。如能看到，说明模型已正确加载。',
        },
      ],
    },
    en: {
      title: 'Chapter 3 · Download LTX Model',
      summary: 'Download LTX-Video model from Hugging Face and place it in the correct directory.',
      steps: [
        {
          type: 'text',
          content: 'LTX-Video is an open-source video generation model from Lightricks supporting text-to-video and image-to-video. It can generate 1080p video on 24GB VRAM, and through quantization compression can run on 12GB VRAM — one of the most efficient open-source video models available.',
        },
        {
          type: 'text',
          heading: '3.1 Model Selection',
          content: 'We recommend downloading two versions: ltx-video-2b-v0.9.1.safetensors (main model, ~5GB, FP8 quantized) and ltx-video-2b-v0.9.1-dev.safetensors (dev version, slightly better quality but larger). Beginners only need the first one.',
        },
        {
          type: 'text',
          heading: '3.2 Download from Hugging Face',
          content: 'Visit huggingface.co/Lightricks/LTX-Video, find the Files & versions tab. Download the ltx-video-2b-v0.9.1.safetensors file. If access is slow, use the hf-mirror.com mirror site.',
        },
        {
          type: 'tip',
          content: 'Use huggingface-cli for resumable downloads: huggingface-cli download Lightricks/LTX-Video ltx-video-2b-v0.9.1.safetensors --local-dir ./models',
        },
        {
          type: 'text',
          heading: '3.3 Place in the Correct Directory',
          content: 'Move the downloaded .safetensors file to ComfyUI\'s diffusion_models directory (NOT checkpoints!):',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\diffusion_models\\\n  └── ltx-video-2b-v0.9.1.safetensors',
        },
        {
          type: 'warning',
          content: 'LTX model MUST be in the diffusion_models directory because it is a diffusion model, not a traditional checkpoint. Wrong directory means ComfyUI cannot detect it.',
        },
        {
          type: 'text',
          heading: '3.4 Download Auxiliary VAE (optional but recommended)',
          content: 'LTX has a built-in VAE, but downloading the standalone VAE file can improve video quality. Visit huggingface.co/Lightricks/LTX-Video to download vae.safetensors, place it in:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\vae\\\n  └── ltx-vae.safetensors',
        },
        {
          type: 'text',
          heading: '3.5 Download Text Encoder',
          content: 'LTX uses T5-XXL as the text encoder. Visit huggingface.co/Comfyanonymous/t5xxl_GGUF to download t5xxl_Q5_K_M.safetensors (~5GB, Q5 quantized is sufficient), place it in:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: 'D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\models\\text_encoders\\\n  └── t5xxl_Q5_K_M.safetensors',
        },
        {
          type: 'tip',
          content: 'If the text_encoders directory doesn\'t exist, create it manually. The T5 encoder has good support for both Chinese and English prompts.',
        },
        {
          type: 'text',
          heading: '3.6 Verify Model Loading',
          content: 'Restart ComfyUI, add a "Load Diffusion Model" node in the workflow, click the model name dropdown — you should see ltx-video-2b-v0.9.1.safetensors. If visible, the model loaded correctly.',
        },
      ],
    },
  },

  {
    id: 'ch4-workflow',
    difficulty: 'intermediate',
    estimatedMin: 25,
    zh: {
      title: '第 4 章 · 配置工作流',
      summary: '导入 LTX 官方工作流，理解节点连接，调整关键参数。',
      steps: [
        {
          type: 'text',
          content: '本章是整个教程的核心。我们会导入 LTX 官方提供的 ComfyUI 工作流，理解每个节点的作用，并学会调整关键参数。完成后你就能用文字描述生成第一段视频了。',
        },
        {
          type: 'text',
          heading: '4.1 下载官方工作流 JSON',
          content: 'Lightricks 在 GitHub 仓库中提供了多个示例工作流。访问 github.com/Lightricks/LTX-Video，找到 comfyui_workflows 目录，下载 ltx-video-t2v.json（文生视频基础工作流）。',
        },
        {
          type: 'code',
          lang: 'bash',
          content: '# 备用下载命令（如果浏览器无法访问）\ncurl -L https://raw.githubusercontent.com/Lightricks/LTX-Video/main/comfyui_workflows/ltx-video-t2v.json \\\n  -o D:/ai-video/ltx-video-t2v.json',
        },
        {
          type: 'text',
          heading: '4.2 导入工作流到 ComfyUI',
          content: '在浏览器中打开 ComfyUI 界面（http://127.0.0.1:8188），点击右上角的 \"Load\" 按钮（或菜单 → Load），选择刚下载的 ltx-video-t2v.json 文件。画布上会出现约 10-12 个连接好的节点。',
        },
        {
          type: 'warning',
          content: '如果节点显示为红色，说明缺少模型或节点。请回到第 3 章确认模型文件已正确放置，并通过 ComfyUI Manager 安装缺失的自定义节点。',
        },
        {
          type: 'text',
          heading: '4.3 节点结构解析',
          content: 'LTX 文生视频工作流的核心节点链路如下，理解这条链路对后续调试非常重要：',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'Load Diffusion Model (LTX)\n        ↓\nLoad Text Encoder (T5-XXL)\n        ↓\nCLIPTextEncode (正/负提示词)\n        ↓\nEmptyLatentImage (设置分辨率和帧数)\n        ↓\nKSampler (核心采样器)\n        ↓\nVAEDecode (解码为视频帧)\n        ↓\nSaveAnimatedWebP / SaveVideo',
        },
        {
          type: 'text',
          heading: '4.4 设置视频分辨率与帧数',
          content: '在 EmptyLatentImage 节点（部分工作流叫 EmptyMochiLatentVideo）中设置视频尺寸。LTX 推荐配置：宽度 768、高度 512、帧数 97（约 4 秒 @ 24fps）。帧数必须是 8 的倍数 + 1（如 25, 33, 41, 49, 97）。',
        },
        {
          type: 'code',
          lang: 'text',
          content: '宽度: 768\n高度: 512\n帧数: 97  # 4秒视频\n# 帧数公式: (秒数 × 24) + 1，并向上取整到 8 的倍数 + 1',
        },
        {
          type: 'tip',
          content: '想要更长视频？可以设置 frame_count=161（约 6.7 秒）或 frame_count=257（约 10.7 秒），但显存占用会线性增加。',
        },
        {
          type: 'text',
          heading: '4.5 设置采样器参数',
          content: '在 KSampler 节点中调整以下参数。LTX 模型的推荐配置：',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'seed: 随机数（点击 \"randomize\" 按钮即可）\nsteps: 30  # 20-40 之间，越多越精细\n_cfg: 3.0  # LTX 推荐较低 CFG（1-3）\nsampler_name: euler\nscheduler: simple\ndenoise: 1.0',
        },
        {
          type: 'warning',
          content: 'CFG 不要设置太高！LTX 在 CFG > 5 时会出现画面爆炸。保持在 1.0-3.0 之间。',
        },
        {
          type: 'text',
          heading: '4.6 编写提示词',
          content: '在正向 CLIPTextEncode 节点中输入你的视频描述。LTX 对英文提示词效果最好，建议用英文。可以使用本网站 \"创意工坊\" 生成的结构化工单。示例提示词：',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'A Shiba Inu running across a sunny green meadow, chasing\nyellow butterflies. The camera follows the dog in a medium shot,\nslow push-in. Cinematic color grading, warm afternoon light,\nshallow depth of field. 4K, high detail, smooth motion.',
        },
        {
          type: 'text',
          heading: '4.7 负向提示词',
          content: '在负向 CLIPTextEncode 节点输入要避免的内容：',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'low quality, blurry, distorted, watermark, text, logo,\njitter, flickering, extra limbs, deformed, ugly',
        },
        {
          type: 'text',
          heading: '4.8 设置输出格式',
          content: '最后一个节点通常是 SaveAnimatedWebP 或 SaveVideo。SaveAnimatedWebP 输出 .webp 动图（兼容性好），SaveVideo 输出 .mp4（需要 ffmpeg）。新手建议先用 WebP。',
        },
        {
          type: 'tip',
          content: '想要 MP4 输出？下载 ffmpeg（ffmpeg.org），把 ffmpeg.exe 放到 ComfyUI 根目录，重启后 SaveVideo 节点就能输出 MP4 了。',
        },
      ],
    },
    en: {
      title: 'Chapter 4 · Configure Workflow',
      summary: 'Import the official LTX workflow, understand node connections, adjust key parameters.',
      steps: [
        {
          type: 'text',
          content: 'This chapter is the core of the tutorial. We\'ll import the official LTX ComfyUI workflow, understand each node\'s role, and learn to tune key parameters. After this you can generate your first video from a text description.',
        },
        {
          type: 'text',
          heading: '4.1 Download Official Workflow JSON',
          content: 'Lightricks provides multiple example workflows in their GitHub repo. Visit github.com/Lightricks/LTX-Video, find the comfyui_workflows directory, download ltx-video-t2v.json (basic text-to-video workflow).',
        },
        {
          type: 'code',
          lang: 'bash',
          content: '# Fallback download command (if browser cannot access)\ncurl -L https://raw.githubusercontent.com/Lightricks/LTX-Video/main/comfyui_workflows/ltx-video-t2v.json \\\n  -o D:/ai-video/ltx-video-t2v.json',
        },
        {
          type: 'text',
          heading: '4.2 Import Workflow into ComfyUI',
          content: 'Open ComfyUI in your browser (http://127.0.0.1:8188), click the "Load" button in the top-right (or menu → Load), select the downloaded ltx-video-t2v.json. About 10-12 connected nodes will appear on the canvas.',
        },
        {
          type: 'warning',
          content: 'If nodes appear red, models or custom nodes are missing. Go back to Chapter 3 to verify model files, and install missing custom nodes via ComfyUI Manager.',
        },
        {
          type: 'text',
          heading: '4.3 Node Structure Overview',
          content: 'The core node chain for LTX text-to-video is below. Understanding this chain is critical for debugging:',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'Load Diffusion Model (LTX)\n        ↓\nLoad Text Encoder (T5-XXL)\n        ↓\nCLIPTextEncode (positive/negative prompts)\n        ↓\nEmptyLatentImage (set resolution & frame count)\n        ↓\nKSampler (core sampler)\n        ↓\nVAEDecode (decode to video frames)\n        ↓\nSaveAnimatedWebP / SaveVideo',
        },
        {
          type: 'text',
          heading: '4.4 Set Video Resolution & Frame Count',
          content: 'In the EmptyLatentImage node (some workflows call it EmptyMochiLatentVideo), set the video dimensions. LTX recommended: width 768, height 512, frames 97 (~4 seconds @ 24fps). Frame count must be a multiple of 8 + 1 (e.g. 25, 33, 41, 49, 97).',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'width: 768\nheight: 512\nframe_count: 97  # 4-second video\n# Frame formula: (seconds × 24) + 1, rounded up to multiple of 8 + 1',
        },
        {
          type: 'tip',
          content: 'Want longer videos? Set frame_count=161 (~6.7s) or frame_count=257 (~10.7s), but VRAM usage scales linearly.',
        },
        {
          type: 'text',
          heading: '4.5 Set Sampler Parameters',
          content: 'Adjust the following in the KSampler node. LTX recommended settings:',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'seed: random (click "randomize")\nsteps: 30  # 20-40, more = more refined\n_cfg: 3.0  # LTX prefers low CFG (1-3)\nsampler_name: euler\nscheduler: simple\ndenoise: 1.0',
        },
        {
          type: 'warning',
          content: 'Do NOT set CFG too high! LTX explodes visually when CFG > 5. Keep it between 1.0 and 3.0.',
        },
        {
          type: 'text',
          heading: '4.6 Write the Prompt',
          content: 'Enter your video description in the positive CLIPTextEncode node. LTX works best with English prompts. You can use structured work orders generated by this site\'s Workshop. Example prompt:',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'A Shiba Inu running across a sunny green meadow, chasing\nyellow butterflies. The camera follows the dog in a medium shot,\nslow push-in. Cinematic color grading, warm afternoon light,\nshallow depth of field. 4K, high detail, smooth motion.',
        },
        {
          type: 'text',
          heading: '4.7 Negative Prompt',
          content: 'Enter content to avoid in the negative CLIPTextEncode node:',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'low quality, blurry, distorted, watermark, text, logo,\njitter, flickering, extra limbs, deformed, ugly',
        },
        {
          type: 'text',
          heading: '4.8 Set Output Format',
          content: 'The last node is usually SaveAnimatedWebP or SaveVideo. SaveAnimatedWebP outputs .webp animations (broad compatibility), SaveVideo outputs .mp4 (requires ffmpeg). Beginners should use WebP first.',
        },
        {
          type: 'tip',
          content: 'Want MP4 output? Download ffmpeg (ffmpeg.org), place ffmpeg.exe in the ComfyUI root directory, restart — the SaveVideo node will then output MP4.',
        },
      ],
    },
  },

  {
    id: 'ch5-generate',
    difficulty: 'beginner',
    estimatedMin: 10,
    zh: {
      title: '第 5 章 · 生成第一个视频',
      summary: '点击生成按钮，等待渲染，导出并查看你的第一个 AI 视频。',
      steps: [
        {
          type: 'text',
          content: '恭喜来到第五章！前面所有准备工作都已完成，现在只需点击一下 \"Queue Prompt\" 按钮，剩下的交给显卡。本章还会介绍如何查看生成结果、调整参数重新生成以及导出到本地。',
        },
        {
          type: 'text',
          heading: '5.1 点击生成',
          content: '确认所有节点参数都已设置好（特别是模型路径、提示词、分辨率、帧数），点击 ComfyUI 右侧面板的 \"Queue Prompt\" 按钮。命令行窗口会开始滚动日志，显示采样进度。',
        },
        {
          type: 'warning',
          content: '首次运行 LTX 会比较慢，因为需要加载约 10GB 的模型到显存。后续生成会快很多。如果显存不足报错，请把分辨率降到 512×320 或帧数减到 41。',
        },
        {
          type: 'text',
          heading: '5.2 观察进度',
          content: 'KSampler 节点上方会显示进度条，从 0% 到 100%。在 RTX 3060 12G 上，4 秒视频（97 帧）大约需要 60-90 秒。在 RTX 4090 上约 15-20 秒。',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'KSampler:  30% |██--------| 9/30 steps\nKSampler:  60% |██████----| 18/30 steps\nKSampler: 100% |██████████| 30/30 steps\nVAEDecode: decoding 97 frames...\nSaveAnimatedWebP: saved to output/ltx_00001_.webp',
        },
        {
          type: 'text',
          heading: '5.3 查看生成结果',
          content: '生成完成后，结果会自动保存到 D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\output\\ 目录。同时 ComfyUI 界面右侧的 \"History\" 面板会显示最近的生成缩略图，点击即可预览。',
        },
        {
          type: 'tip',
          content: '如果不满意结果，可以只改 seed（点击 randomize）重新生成，每次结果都会不同。或者调整提示词，增加更多细节描述。',
        },
        {
          type: 'text',
          heading: '5.4 调整参数重新生成',
          content: '常见的调参方向：画面太模糊 → 增加 steps 到 40-50；动作太僵硬 → 在提示词中加入 \"smooth motion, fluid animation\"；色彩太暗 → 加入 \"bright, vibrant colors, well-lit\"。',
        },
        {
          type: 'text',
          heading: '5.5 导出与上传到画廊',
          content: '生成满意的视频后，你可以从 output 目录直接复制 .webp 文件到任何地方。如果想上传到 vzong 个人画廊展示，回到本网站点击 \"我的画廊\" → \"上传视频\"，选择文件即可。所有视频仅保存在你浏览器的 IndexedDB 中，不会上传到任何服务器。',
        },
        {
          type: 'tip',
          content: '建议为每个生成的视频起一个有意义的名字（如 \"柴犬追蝴蝶-电影感-8秒\"），方便日后查找和分类。',
        },
        {
          type: 'text',
          heading: '5.6 图生视频（可选）',
          content: '如果想用图片作为起始帧生成视频，下载 ltx-video-i2v.json 工作流。流程类似，但需要额外添加 LoadImage 节点加载参考图，并连接到 VAE Encode 节点。LTX 会基于图片内容生成后续动态帧。',
        },
      ],
    },
    en: {
      title: 'Chapter 5 · Generate Your First Video',
      summary: 'Click generate, wait for render, export and view your first AI video.',
      steps: [
        {
          type: 'text',
          content: 'Congratulations on reaching Chapter 5! All preparation is done — now just click "Queue Prompt" and let your GPU do the rest. This chapter also covers viewing results, re-generating with adjusted parameters, and exporting locally.',
        },
        {
          type: 'text',
          heading: '5.1 Click Generate',
          content: 'Confirm all node parameters are set (especially model path, prompt, resolution, frame count). Click the "Queue Prompt" button in ComfyUI\'s right panel. The console will start scrolling logs showing sampling progress.',
        },
        {
          type: 'warning',
          content: 'First LTX run is slow because it needs to load ~10GB of models into VRAM. Subsequent runs are much faster. If you get an OOM error, lower resolution to 512×320 or frame count to 41.',
        },
        {
          type: 'text',
          heading: '5.2 Watch Progress',
          content: 'A progress bar appears above the KSampler node, from 0% to 100%. On an RTX 3060 12G, a 4-second video (97 frames) takes about 60-90 seconds. On an RTX 4090, about 15-20 seconds.',
        },
        {
          type: 'code',
          lang: 'text',
          content: 'KSampler:  30% |██--------| 9/30 steps\nKSampler:  60% |██████----| 18/30 steps\nKSampler: 100% |██████████| 30/30 steps\nVAEDecode: decoding 97 frames...\nSaveAnimatedWebP: saved to output/ltx_00001_.webp',
        },
        {
          type: 'text',
          heading: '5.3 View the Result',
          content: 'After completion, the result is saved to D:\\ai-video\\ComfyUI_windows_portable\\ComfyUI\\output\\. ComfyUI\'s "History" panel on the right shows recent generation thumbnails — click to preview.',
        },
        {
          type: 'tip',
          content: 'Unsatisfied? Just change the seed (click randomize) and re-generate — each result is different. Or refine the prompt with more details.',
        },
        {
          type: 'text',
          heading: '5.4 Adjust Parameters and Re-generate',
          content: 'Common tuning directions: too blurry → increase steps to 40-50; motion too stiff → add "smooth motion, fluid animation" to the prompt; too dark → add "bright, vibrant colors, well-lit".',
        },
        {
          type: 'text',
          heading: '5.5 Export & Upload to Gallery',
          content: 'After generating a video you like, copy the .webp file from the output directory anywhere. To upload to the vzong personal gallery, go to "My Gallery" → "Upload Video" on this site and select the file. All videos persist only in your browser\'s IndexedDB — never uploaded to any server.',
        },
        {
          type: 'tip',
          content: 'Give each generated video a meaningful name (e.g. "Shiba-chasing-butterflies-cinematic-8s") for easier search and categorization later.',
        },
        {
          type: 'text',
          heading: '5.6 Image-to-Video (optional)',
          content: 'To generate video from a starting image, download the ltx-video-i2v.json workflow. The flow is similar but you add a LoadImage node to load a reference image and connect it to the VAE Encode node. LTX generates subsequent motion frames based on the image content.',
        },
      ],
    },
  },

  {
    id: 'ch6-troubleshooting',
    difficulty: 'advanced',
    estimatedMin: 15,
    zh: {
      title: '第 6 章 · 常见问题排查',
      summary: '解决 OOM、模型加载失败、画面异常等高频问题。',
      steps: [
        {
          type: 'text',
          content: '即使前 5 章都按部就班完成，实际使用中仍会遇到各种问题。本章整理了社区反馈频率最高的问题及解决方案，建议遇到时回来查阅，也可以提前浏览建立心理预期。',
        },
        {
          type: 'text',
          heading: '6.1 显存不足（OOM）',
          content: '最常见的问题。报错信息通常为 \"CUDA out of memory\" 或 \"RuntimeError: CUDA error\"。解决方法按优先级排序：',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. 降低分辨率: 768×512 → 512×320 → 320×192\n2. 减少帧数: 97 → 65 → 41\n3. 启用 FP8 量化版模型（默认就是）\n4. 关闭其他占用显存的程序（浏览器、游戏）\n5. 在 ComfyUI 启动参数中添加 --lowvram\n6. 终极方案: 使用 ComfyUI-Manager 安装 ComfyUI-GGUF\n   加载 Q4 量化版 LTX 模型（约 2.5GB）',
        },
        {
          type: 'text',
          heading: '6.2 模型加载失败',
          content: '如果 \"Load Diffusion Model\" 节点下拉框为空或报错 \"model not found\"，按以下步骤检查：',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. 确认文件在 models/diffusion_models/ 目录下（不是 checkpoints/）\n2. 文件名拼写正确，无多余后缀\n3. 文件完整：对比 Hugging Face 上的文件大小\n4. 重启 ComfyUI 让其重新扫描模型目录',
        },
        {
          type: 'warning',
          content: '千万不要把 LTX 模型重命名为 .ckpt 后缀，这会让 ComfyUI 误识别为 checkpoint。',
        },
        {
          type: 'text',
          heading: '6.3 生成画面是噪点或纯色',
          content: '通常意味着采样器参数错误或提示词过长。检查：',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. CFG 值是否在 1.0-3.0 之间（过高会爆炸）\n2. denoise 是否为 1.0（图生视频时为 0.7-1.0）\n3. 提示词长度是否超过 77 token（T5 编码器上限）\n4. 负向提示词是否包含矛盾内容\n5. 尝试切换 sampler: euler → dpmpp_2m',
        },
        {
          type: 'text',
          heading: '6.4 视频画面卡顿/跳帧',
          content: '通常是因为帧率设置不对。LTX 默认输出 24fps，但部分播放器或 WebP 渲染会按 25fps 解读，导致速度异常。解决方法：',
        },
        {
          type: 'code',
          lang: 'bash',
          content: '# 用 ffmpeg 重新封装为标准 24fps MP4\nffmpeg -i input.webp -r 24 -c:v libx264 output.mp4',
        },
        {
          type: 'text',
          heading: '6.5 生成速度极慢',
          content: '如果一段 4 秒视频需要 10 分钟以上，说明没有正确使用 GPU。检查：',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. 运行 nvidia-smi 确认 GPU 在工作（应该看到 python.exe 占用显存）\n2. 检查 PyTorch 是否为 CUDA 版本:\n   python -c "import torch; print(torch.cuda.is_available())"\n   应输出 True\n3. 如果输出 False，需要重装 PyTorch:\n   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121',
        },
        {
          type: 'text',
          heading: '6.6 中文提示词效果差',
          content: 'LTX 使用 T5-XXL 编码器，对英文支持远好于中文。建议使用本网站的 \"创意工坊\" 工具把中文想法翻译扩展为英文专业提示词，再粘贴到 ComfyUI 中。',
        },
        {
          type: 'tip',
          content: '如果一定要用中文，可以在提示词前加 \"In Chinese:\" 让模型意识到语言切换，但效果仍不如英文。',
        },
        {
          type: 'text',
          heading: '6.7 寻求社区帮助',
          content: '如果以上方案都不能解决你的问题，可以到以下社区求助：',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. ComfyUI 官方 Discord: discord.gg/comfyui\n2. LTX-Video GitHub Issues: github.com/Lightricks/LTX-Video/issues\n3. Reddit: r/comfyui, r/StableDiffusion\n4. 中文社区: liblib.art 论坛、秋风AI视频（B站）',
        },
        {
          type: 'text',
          content: '完成全部 6 章学习后，你已经具备了独立使用 ComfyUI + LTX 进行 AI 视频创作的完整能力。现在打开 \"创意工坊\" 生成你的第一个专业提示词，然后开始创作吧！',
        },
      ],
    },
    en: {
      title: 'Chapter 6 · Troubleshooting',
      summary: 'Solve high-frequency issues like OOM, model load failures, visual artifacts.',
      steps: [
        {
          type: 'text',
          content: 'Even after completing the first 5 chapters perfectly, you\'ll still hit various issues in practice. This chapter compiles the most frequently reported issues from the community with solutions. Bookmark this for reference, or skim ahead to build expectations.',
        },
        {
          type: 'text',
          heading: '6.1 Out of Memory (OOM)',
          content: 'The most common issue. Error messages usually say "CUDA out of memory" or "RuntimeError: CUDA error". Solutions in priority order:',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. Lower resolution: 768×512 → 512×320 → 320×192\n2. Reduce frame count: 97 → 65 → 41\n3. Use FP8 quantized model (default)\n4. Close other VRAM-using apps (browsers, games)\n5. Add --lowvram to ComfyUI launch args\n6. Last resort: install ComfyUI-GGUF via Manager\n   and load Q4 quantized LTX (~2.5GB)',
        },
        {
          type: 'text',
          heading: '6.2 Model Load Failure',
          content: 'If the "Load Diffusion Model" dropdown is empty or shows "model not found", check:',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. Confirm file is in models/diffusion_models/ (not checkpoints/)\n2. File name spelled correctly, no extra suffix\n3. File complete: compare size with Hugging Face\n4. Restart ComfyUI to rescan model directory',
        },
        {
          type: 'warning',
          content: 'Never rename LTX model with .ckpt suffix — ComfyUI will misidentify it as a checkpoint.',
        },
        {
          type: 'text',
          heading: '6.3 Generated Video Is Noise or Solid Color',
          content: 'Usually means sampler parameters are wrong or prompt is too long. Check:',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. CFG value between 1.0-3.0 (too high explodes)\n2. denoise = 1.0 (for i2v: 0.7-1.0)\n3. Prompt length under 77 tokens (T5 limit)\n4. Negative prompt has no contradictory content\n5. Try switching sampler: euler → dpmpp_2m',
        },
        {
          type: 'text',
          heading: '6.4 Video Stutters / Frame Drops',
          content: 'Usually a frame rate issue. LTX outputs 24fps by default, but some players or WebP renderers interpret at 25fps, causing speed issues. Solution:',
        },
        {
          type: 'code',
          lang: 'bash',
          content: '# Use ffmpeg to remux as standard 24fps MP4\nffmpeg -i input.webp -r 24 -c:v libx264 output.mp4',
        },
        {
          type: 'text',
          heading: '6.5 Generation Is Extremely Slow',
          content: 'If a 4-second video takes more than 10 minutes, the GPU isn\'t being used correctly. Check:',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. Run nvidia-smi to confirm GPU is working (python.exe should occupy VRAM)\n2. Check if PyTorch is CUDA version:\n   python -c "import torch; print(torch.cuda.is_available())"\n   Should print True\n3. If False, reinstall PyTorch:\n   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121',
        },
        {
          type: 'text',
          heading: '6.6 Chinese Prompts Work Poorly',
          content: 'LTX uses the T5-XXL encoder — English support is far better than Chinese. We recommend using this site\'s Workshop to translate and expand Chinese ideas into professional English prompts, then paste into ComfyUI.',
        },
        {
          type: 'tip',
          content: 'If you must use Chinese, prepend "In Chinese:" to signal language switch, but results are still worse than English.',
        },
        {
          type: 'text',
          heading: '6.7 Seek Community Help',
          content: 'If none of the above solves your issue, ask in these communities:',
        },
        {
          type: 'code',
          lang: 'text',
          content: '1. ComfyUI Discord: discord.gg/comfyui\n2. LTX-Video GitHub Issues: github.com/Lightricks/LTX-Video/issues\n3. Reddit: r/comfyui, r/StableDiffusion\n4. Chinese: liblib.art forums, Bilibili AI video creators',
        },
        {
          type: 'text',
          content: 'After completing all 6 chapters, you now have the full capability to create AI videos independently with ComfyUI + LTX. Open the Workshop to generate your first professional prompt, then start creating!',
        },
      ],
    },
  },
];

window.TUTORIALS = TUTORIALS;
