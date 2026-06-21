// vzong · AI视频工坊 - 主应用逻辑（vanilla JS）
// 包含：状态管理、认证、视频生成、画廊、设置、UI 渲染

(function () {
  'use strict';

  // ===== 全局状态 =====
  const state = {
    view: 'landing',           // landing | dashboard | gallery | settings
    lang: window.i18n.getLang(),
    user: null,                // { uid, email, displayName, photoURL, isGuest }
    credits: 0,
    totalGenerated: 0,
    tasks: [],                 // [{ id, params, status, progress, thumbnailDataUrl, videoUrl, createdAt, workOrder }]
    activeTab: 'image-to-video', // 'text-to-video' | 'image-to-video'
    // 表单状态
    ttvPrompt: '',
    itvPrompt: '',
    itvImage: null,            // dataURL
    cameraMovement: 'push',
    duration: 8,
    styles: ['cinematic'],
    advancedOpen: false,
    currentWorkOrder: null,    // 当前显示的工单
    authMode: 'login',         // 'login' | 'signup'
    showLoginDialog: false,
    showCreditsDialog: false,
  };

  // 从 localStorage 恢复
  function loadState() {
    try {
      const saved = localStorage.getItem('vzong-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      }
      const guest = localStorage.getItem('vzong-guest');
      if (guest) state.user = JSON.parse(guest);
    } catch (e) {
      console.warn('[State] 恢复失败：', e);
    }
    // 默认值
    if (!state.tasks) state.tasks = [];
    if (!state.styles.length) state.styles = ['cinematic'];
  }

  function saveState() {
    try {
      const toSave = {
        view: state.view,
        tasks: state.tasks,
        activeTab: state.activeTab,
        cameraMovement: state.cameraMovement,
        duration: state.duration,
        styles: state.styles,
        totalGenerated: state.totalGenerated,
      };
      localStorage.setItem('vzong-state', JSON.stringify(toSave));
    } catch (e) {
      console.warn('[State] 保存失败：', e);
    }
  }

  // ===== Toast 通知 =====
  function toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type} slide-in-right`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s, transform 0.3s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ===== 积分管理 =====
  async function fetchCredits(uid) {
    if (!window.fbConfig.isConfigured || !window.fbConfig.db) {
      // 本地模式
      const raw = localStorage.getItem(`vzong-credits-${uid}`);
      if (raw) return JSON.parse(raw);
      const initial = { credits: 20, totalGenerated: 0, updatedAt: Date.now() };
      localStorage.setItem(`vzong-credits-${uid}`, JSON.stringify(initial));
      return initial;
    }
    try {
      const doc = await window.fbConfig.db.collection('userCredits').doc(uid).get();
      if (doc.exists) return doc.data();
      const initial = { credits: 20, totalGenerated: 0, updatedAt: Date.now() };
      await window.fbConfig.db.collection('userCredits').doc(uid).set(initial);
      return initial;
    } catch (e) {
      console.warn('[Credits] 读取失败：', e);
      return { credits: 20, totalGenerated: 0 };
    }
  }

  async function updateCredits(uid, updates) {
    if (!window.fbConfig.isConfigured || !window.fbConfig.db) {
      const raw = localStorage.getItem(`vzong-credits-${uid}`);
      const current = raw ? JSON.parse(raw) : { credits: 20, totalGenerated: 0 };
      const next = { ...current, ...updates, updatedAt: Date.now() };
      localStorage.setItem(`vzong-credits-${uid}`, JSON.stringify(next));
      return next;
    }
    try {
      const ref = window.fbConfig.db.collection('userCredits').doc(uid);
      const doc = await ref.get();
      if (!doc.exists) {
        await ref.set({ credits: 20, totalGenerated: 0, updatedAt: Date.now(), ...updates });
      } else {
        await ref.update({ ...updates, updatedAt: Date.now() });
      }
    } catch (e) {
      console.warn('[Credits] 更新失败：', e);
    }
  }

  async function loadUserCredits() {
    if (!state.user) {
      state.credits = 0;
      state.totalGenerated = 0;
      return;
    }
    const data = await fetchCredits(state.user.uid);
    state.credits = data.credits;
    state.totalGenerated = data.totalGenerated;
    render();
  }

  function deductCredit() {
    if (state.credits <= 0) {
      state.showCreditsDialog = true;
      render();
      return false;
    }
    state.credits -= 1;
    if (state.user) updateCredits(state.user.uid, { credits: state.credits });
    return true;
  }

  function addCredits(amount) {
    state.credits += amount;
    if (state.user) updateCredits(state.user.uid, { credits: state.credits });
    toast(`+${amount} ${window.i18n.t('common.creditsUnit')}`, 'success');
  }

  // ===== 认证 =====
  function createGuestUser() {
    return {
      uid: `guest-${Date.now()}`,
      email: null,
      displayName: window.i18n.t('settings.accountTypeGuest'),
      photoURL: null,
      isGuest: true,
    };
  }

  function loginAsGuest() {
    const guest = createGuestUser();
    state.user = guest;
    localStorage.setItem('vzong-guest', JSON.stringify(guest));
    toast(window.i18n.t('auth.guestMode'), 'success');
    loadUserCredits();
    state.view = 'dashboard';
    state.showLoginDialog = false;
    render();
  }

  async function loginWithEmail(email, password) {
    if (!window.fbConfig.isConfigured || !window.fbConfig.auth) {
      throw new Error('Firebase 未配置，请使用访客模式');
    }
    await window.fbConfig.auth.signInWithEmailAndPassword(email, password);
  }

  async function signupWithEmail(email, password, username) {
    if (!window.fbConfig.isConfigured || !window.fbConfig.auth) {
      throw new Error('Firebase 未配置，请使用访客模式');
    }
    const cred = await window.fbConfig.auth.createUserWithEmailAndPassword(email, password);
    if (cred.user) {
      await cred.user.updateProfile({ displayName: username });
    }
    toast(`${window.i18n.t('auth.welcomeBack')}，${username}！`, 'success');
  }

  async function loginWithGoogle() {
    if (!window.fbConfig.isConfigured || !window.fbConfig.auth) {
      throw new Error('Firebase 未配置，请使用访客模式');
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    await window.fbConfig.auth.signInWithPopup(provider);
  }

  async function loginWithGithub() {
    if (!window.fbConfig.isConfigured || !window.fbConfig.auth) {
      throw new Error('Firebase 未配置，请使用访客模式');
    }
    const provider = new firebase.auth.GithubAuthProvider();
    await window.fbConfig.auth.signInWithPopup(provider);
  }

  async function logout() {
    if (window.fbConfig.isConfigured && window.fbConfig.auth) {
      await window.fbConfig.auth.signOut();
    }
    localStorage.removeItem('vzong-guest');
    state.user = null;
    state.credits = 0;
    state.totalGenerated = 0;
    state.view = 'landing';
    toast(window.i18n.t('auth.logoutSuccess'), 'success');
    render();
  }

  function setupAuthListener() {
    if (!window.fbConfig.isConfigured || !window.fbConfig.auth) {
      // 未配置 Firebase：尝试恢复访客
      const guest = localStorage.getItem('vzong-guest');
      if (guest) {
        try { state.user = JSON.parse(guest); } catch {}
      }
      return;
    }
    window.fbConfig.auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        state.user = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Creator'),
          photoURL: fbUser.photoURL,
          isGuest: false,
        };
        await loadUserCredits();
      } else {
        // 退出后保持访客身份继续使用
        const guest = localStorage.getItem('vzong-guest');
        if (guest) {
          try { state.user = JSON.parse(guest); } catch {}
        } else {
          state.user = null;
        }
        state.credits = 0;
        state.totalGenerated = 0;
      }
      render();
    });
  }

  // ===== 图片上传 =====
  function handleImageUpload(file) {
    if (!file) return;
    if (!/^image\/(jpe?g|png)$/i.test(file.type)) {
      toast(window.i18n.t('error.invalidImage'), 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast(window.i18n.t('error.fileTooLarge'), 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      state.itvImage = e.target.result;
      updateWorkOrder();
      render();
    };
    reader.readAsDataURL(file);
  }

  // ===== Sora 2 工单生成 =====
  function updateWorkOrder() {
    const mode = state.activeTab;
    const prompt = mode === 'text-to-video' ? state.ttvPrompt : state.itvPrompt;
    state.currentWorkOrder = window.WorkOrder.generateWorkOrder({
      prompt,
      mode,
      cameraMovement: state.cameraMovement,
      duration: state.duration,
      styles: state.styles,
      hasImage: mode === 'image-to-video' && !!state.itvImage,
    }, state.lang);
  }

  // ===== 视频生成（纯前端模拟） =====
  const STYLE_PALETTES = {
    cyberpunk: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080'],
    cinematic: ['#FFD700', '#FF6B35', '#C9302C', '#2C3E50'],
    ink: ['#1A1A1A', '#4A4A4A', '#888888', '#E8E8E8'],
    anime: ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'],
    realistic: ['#8B7355', '#5D4E37', '#A0826D', '#3E2723'],
    fantasy: ['#9370DB', '#FFB6C1', '#FFD700', '#00CED1'],
    watercolor: ['#FFB6C1', '#B6E3F0', '#FFE4B5', '#C8A2C8'],
  };

  function generateThumbnail(params) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(''); return; }

      const style = params.styles[0] || 'cyberpunk';
      const palette = STYLE_PALETTES[style] || STYLE_PALETTES.cinematic;
      const time = (params.duration - 5) / 10;
      const camera = params.cameraMovement;

      // 背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0A1128');
      gradient.addColorStop(0.5, palette[0] + '33');
      gradient.addColorStop(1, '#0A1128');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let cx = canvas.width / 2;
      let cy = canvas.height / 2;
      if (camera === 'pan') cx -= 50;
      else if (camera === 'tilt') cy -= 30;

      // 圆环
      for (let i = 0; i < 5; i++) {
        const radius = Math.max(1, 60 + i * 30 + time * 40);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = palette[i % palette.length] + 'AA';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 中心发光体
      const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      centerGradient.addColorStop(0, palette[0]);
      centerGradient.addColorStop(0.5, palette[1] + 'AA');
      centerGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fill();

      // 粒子
      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const dist = 120 + Math.sin(i) * 30;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        ctx.fillStyle = palette[i % palette.length] + 'CC';
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }

      // 叠加原图
      const drawFinal = () => {
        // 底部信息条
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 14px sans-serif';
        const styleText = params.styles.join(' · ') || '默认';
        const modeLabel = params.mode === 'text-to-video' ? '文生视频' : '图生视频';
        ctx.fillText(`${modeLabel} · ${params.duration}s · ${styleText}`, 16, canvas.height - 14);

        // 播放按钮
        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(canvas.width - 30, 30, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0A1128';
        ctx.beginPath();
        ctx.moveTo(canvas.width - 35, 22);
        ctx.lineTo(canvas.width - 35, 38);
        ctx.lineTo(canvas.width - 22, 30);
        ctx.closePath();
        ctx.fill();

        resolve(canvas.toDataURL('image/png'));
      };

      if (params.imageDataUrl && params.imageDataUrl.startsWith('data:image')) {
        const img = new Image();
        img.onload = () => {
          ctx.globalAlpha = 0.6;
          ctx.drawImage(img, 20, 60, 180, 240);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = palette[0];
          ctx.lineWidth = 2;
          ctx.strokeRect(20, 60, 180, 240);
          drawFinal();
        };
        img.onerror = drawFinal;
        img.src = params.imageDataUrl;
      } else {
        drawFinal();
      }
    });
  }

  async function startVideoGeneration(taskId, params) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    task.status = 'processing';
    task.progress = 0;
    render();

    try {
      // 模拟进度
      const totalDuration = Math.min(8000, 3000 + params.duration * 500);
      const startTime = Date.now();
      let lastProgress = 0;

      await new Promise((resolve) => {
        const tick = () => {
          const elapsed = Date.now() - startTime;
          const ratio = Math.min(1, elapsed / totalDuration);
          const progress = Math.round((1 - Math.pow(1 - ratio, 2)) * 100);
          if (progress !== lastProgress) {
            lastProgress = progress;
            task.progress = Math.min(99, progress);
            render();
          }
          if (ratio < 1) {
            setTimeout(tick, 200);
          } else {
            resolve();
          }
        };
        setTimeout(tick, 500);
      });

      // 生成缩略图
      task.progress = 100;
      task.thumbnailDataUrl = await generateThumbnail(params);
      task.status = 'completed';
      state.totalGenerated += 1;
      if (state.user) updateCredits(state.user.uid, { totalGenerated: state.totalGenerated });
      saveState();
      render();
      toast(window.i18n.t('task.completed'), 'success');
    } catch (err) {
      console.error('[Generation] 失败：', err);
      task.status = 'failed';
      task.error = err.message || 'Unknown error';
      // 退回积分
      state.credits += 1;
      if (state.user) updateCredits(state.user.uid, { credits: state.credits });
      saveState();
      render();
      toast(window.i18n.t('error.generic'), 'error');
    }
  }

  function handleGenerate() {
    const mode = state.activeTab;
    const prompt = mode === 'text-to-video' ? state.ttvPrompt : state.itvPrompt;
    if (!prompt || !prompt.trim()) {
      toast(mode === 'text-to-video' ? window.i18n.t('ttv.promptPlaceholder') : window.i18n.t('itv.promptPlaceholder'), 'error');
      return;
    }
    if (mode === 'image-to-video' && !state.itvImage) {
      toast(window.i18n.t('itv.uploadHint'), 'error');
      return;
    }
    if (!deductCredit()) return;

    updateWorkOrder();
    const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const params = {
      mode,
      prompt,
      imageDataUrl: mode === 'image-to-video' ? state.itvImage : null,
      cameraMovement: state.cameraMovement,
      duration: state.duration,
      styles: [...state.styles],
    };
    const task = {
      id: taskId,
      params,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
      workOrder: state.currentWorkOrder,
    };
    state.tasks.unshift(task);
    saveState();
    render();
    startVideoGeneration(taskId, params);
  }

  function downloadTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task || !task.thumbnailDataUrl) return;
    const link = document.createElement('a');
    link.href = task.thumbnailDataUrl;
    link.download = `vzong-${taskId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function deleteTask(taskId) {
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    saveState();
    render();
  }

  // ===== 渲染：导航栏 =====
  function renderNav() {
    const t = window.i18n.t;
    const user = state.user;
    return `
      <nav class="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[#0A1128]/80 border-b border-[rgba(0,240,255,0.1)]">
        <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="#" onclick="window.vzongApp.navigate('landing'); return false;" class="flex items-center gap-2 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#0080FF] flex items-center justify-center font-bold text-[#0A1128] text-lg group-hover:scale-110 transition-transform">V</div>
            <div class="flex items-baseline">
              <span class="text-xl font-bold gradient-text">${t('brand.name')}</span>
              <span class="text-xs text-white/40 ml-1 hidden sm:inline">${t('brand.suffix')}</span>
            </div>
          </a>

          <div class="hidden md:flex items-center gap-1">
            ${state.view !== 'landing' ? `
              <button onclick="window.vzongApp.navigate('dashboard')" class="px-4 py-2 rounded-lg text-sm ${state.view==='dashboard'?'text-[#00F0FF] bg-[rgba(0,240,255,0.1)]':'text-white/60 hover:text-white hover:bg-white/5'} transition-all">${t('nav.studio')}</button>
              <button onclick="window.vzongApp.navigate('gallery')" class="px-4 py-2 rounded-lg text-sm ${state.view==='gallery'?'text-[#00F0FF] bg-[rgba(0,240,255,0.1)]':'text-white/60 hover:text-white hover:bg-white/5'} transition-all">${t('nav.gallery')}</button>
              <button onclick="window.vzongApp.navigate('settings')" class="px-4 py-2 rounded-lg text-sm ${state.view==='settings'?'text-[#00F0FF] bg-[rgba(0,240,255,0.1)]':'text-white/60 hover:text-white hover:bg-white/5'} transition-all">${t('nav.settings')}</button>
            ` : ''}
          </div>

          <div class="flex items-center gap-3">
            <div class="lang-toggle">
              <button onclick="window.vzongApp.setLang('zh')" class="${state.lang==='zh'?'active':''}">中</button>
              <button onclick="window.vzongApp.setLang('en')" class="${state.lang==='en'?'active':''}">EN</button>
            </div>
            ${user ? `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]">
                <span class="text-xs text-white/60">${t('common.credits')}:</span>
                <span class="text-sm font-bold text-[#00F0FF]">${state.credits}</span>
              </div>
              <button onclick="window.vzongApp.openCreditsDialog()" class="btn-ghost text-sm">${t('common.recharge')}</button>
              <button onclick="window.vzongApp.logout()" class="btn-ghost text-sm hidden sm:block">${t('nav.logout')}</button>
            ` : `
              <button onclick="window.vzongApp.openLoginDialog()" class="btn-primary text-sm">${t('nav.login')}</button>
            `}
          </div>
        </div>
      </nav>
    `;
  }

  // ===== 渲染：Landing 页 =====
  function renderLanding() {
    const t = window.i18n.t;
    return `
      <div class="relative min-h-screen pt-20 overflow-hidden">
        <div class="hero-bg"></div>
        <div class="hero-glow" style="top: -200px; left: 50%; transform: translateX(-50%);"></div>

        <div class="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] mb-8 float-up">
            <span class="text-xs font-bold text-[#00F0FF]">${t('landing.badgeNew')}</span>
            <span class="text-sm text-white/80">${t('landing.badge')}</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight float-up" style="animation-delay: 0.1s">
            <span class="block">${t('landing.titleLine1')}</span>
            <span class="block gradient-text">${t('landing.titleLine2')}</span>
          </h1>

          <p class="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10 float-up" style="animation-delay: 0.2s">
            ${t('landing.subtitle')}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 float-up" style="animation-delay: 0.3s">
            <button onclick="window.vzongApp.startCreating()" class="btn-primary text-base px-8 py-4 pulse-glow">
              ${t('landing.ctaPrimary')} →
            </button>
            <button onclick="window.vzongApp.navigate('gallery')" class="btn-secondary text-base px-8 py-4">
              ${t('landing.ctaSecondary')}
            </button>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20 float-up" style="animation-delay: 0.4s">
            ${[
              { label: t('landing.statsVideos'), value: '12,847' },
              { label: t('landing.statsUsers'), value: '3,521' },
              { label: t('landing.statsStyles'), value: '7' },
              { label: t('landing.statsSatisfaction'), value: '98%' },
            ].map(s => `
              <div class="glass-card p-6">
                <div class="text-3xl font-bold gradient-text mb-1">${s.value}</div>
                <div class="text-sm text-white/60">${s.label}</div>
              </div>
            `).join('')}
          </div>

          <!-- 功能卡片 -->
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            ${[
              { icon: '✍️', title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
              { icon: '🖼️', title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
              { icon: '📋', title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
              { icon: '🎨', title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
            ].map((f, i) => `
              <div class="glass-card glass-card-hover p-6 text-left float-up" style="animation-delay: ${0.1 * i}s">
                <div class="text-4xl mb-4">${f.icon}</div>
                <h3 class="text-lg font-bold mb-2">${f.title}</h3>
                <p class="text-sm text-white/60 leading-relaxed">${f.desc}</p>
              </div>
            `).join('')}
          </div>

          <!-- 示例画廊 -->
          <div class="mb-20">
            <h2 class="text-3xl font-bold mb-2">${t('landing.exampleTitle')}</h2>
            <p class="text-white/60 mb-8">${t('landing.exampleDesc')}</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${[1,2,3,4].map(i => `
                <div class="task-card aspect-video relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 via-[#0A1128] to-[#FF00FF]/20"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 rounded-full bg-[#00F0FF]/90 flex items-center justify-center">
                      <div class="w-0 h-0 border-l-[12px] border-l-[#0A1128] border-y-[8px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div class="text-xs text-white/80">${i === 1 ? '赛博朋克' : i === 2 ? '电影感' : i === 3 ? '水墨风' : '动漫'} · ${5 + i * 2}s</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CTA -->
          <div class="glass-card p-10 md:p-16 text-center pulse-glow">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">${t('landing.titleLine2')}</h2>
            <p class="text-white/60 mb-8">${t('landing.subtitle')}</p>
            <button onclick="window.vzongApp.startCreating()" class="btn-primary text-base px-8 py-4">
              ${t('landing.ctaPrimary')} →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ===== 渲染：Dashboard =====
  function renderDashboard() {
    const t = window.i18n.t;
    return `
      <div class="pt-20 min-h-screen max-w-7xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">
            ${t('dashboard.welcome')}${state.user ? '，' + (state.user.displayName || 'Creator') : ''}
          </h1>
          <div class="flex items-center gap-4 text-sm text-white/60">
            <span>${t('dashboard.creditsBalance')}: <span class="text-[#00F0FF] font-bold">${state.credits}</span> ${t('common.creditsUnit')}</span>
            <span>·</span>
            <span>${t('dashboard.creditsHint')}</span>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="flex gap-2 mb-6 p-1 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(0,240,255,0.1)] w-fit">
          <button onclick="window.vzongApp.setTab('text-to-video')" class="px-6 py-2 rounded-lg text-sm font-semibold transition-all ${state.activeTab==='text-to-video'?'bg-[#00F0FF] text-[#0A1128]':'text-white/60 hover:text-white'}">
            ${t('dashboard.tab.textToVideo')}
          </button>
          <button onclick="window.vzongApp.setTab('image-to-video')" class="px-6 py-2 rounded-lg text-sm font-semibold transition-all ${state.activeTab==='image-to-video'?'bg-[#00F0FF] text-[#0A1128]':'text-white/60 hover:text-white'}">
            ${t('dashboard.tab.imageToVideo')}
          </button>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <!-- 输入区 -->
          <div class="lg:col-span-2 glass-card p-6">
            ${state.activeTab === 'text-to-video' ? renderTextToVideo() : renderImageToVideo()}
          </div>

          <!-- 工单区 -->
          <div class="glass-card p-6">
            ${renderWorkOrder()}
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="glass-card mt-6 overflow-hidden">
          <button onclick="window.vzongApp.toggleAdvanced()" class="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-xl">⚙️</span>
              <span class="font-semibold">${t('advanced.title')}</span>
            </div>
            <span class="text-white/60 transition-transform ${state.advancedOpen?'rotate-180':''}">▼</span>
          </button>
          <div class="collapsible-content ${state.advancedOpen?'open':''}">
            <div class="p-5 pt-0 grid md:grid-cols-3 gap-6 border-t border-[rgba(0,240,255,0.1)]">
              <!-- 运镜 -->
              <div>
                <label class="text-sm text-white/60 mb-2 block">${t('advanced.camera')}</label>
                <select class="input-field" onchange="window.vzongApp.setCamera(this.value)">
                  <option value="push" ${state.cameraMovement==='push'?'selected':''}>${t('advanced.camera.push')}</option>
                  <option value="pull" ${state.cameraMovement==='pull'?'selected':''}>${t('advanced.camera.pull')}</option>
                  <option value="pan" ${state.cameraMovement==='pan'?'selected':''}>${t('advanced.camera.pan')}</option>
                  <option value="tilt" ${state.cameraMovement==='tilt'?'selected':''}>${t('advanced.camera.tilt')}</option>
                  <option value="random" ${state.cameraMovement==='random'?'selected':''}>${t('advanced.camera.random')}</option>
                </select>
              </div>
              <!-- 时长 -->
              <div>
                <label class="text-sm text-white/60 mb-2 block flex justify-between">
                  <span>${t('advanced.duration')}</span>
                  <span class="text-[#00F0FF] font-bold">${state.duration}${t('advanced.durationValue')}</span>
                </label>
                <input type="range" min="5" max="15" value="${state.duration}" oninput="window.vzongApp.setDuration(parseInt(this.value))" />
                <div class="flex justify-between text-xs text-white/40 mt-1">
                  <span>5s</span><span>10s</span><span>15s</span>
                </div>
              </div>
              <!-- 风格 -->
              <div>
                <label class="text-sm text-white/60 mb-2 block">${t('advanced.style')}</label>
                <div class="flex flex-wrap gap-2">
                  ${['cinematic','cyberpunk','ink','anime','realistic','fantasy','watercolor'].map(s => `
                    <button onclick="window.vzongApp.toggleStyle('${s}')" class="capsule-btn ${state.styles.includes(s)?'active':''}">
                      ${t('advanced.style.'+s)}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近任务 -->
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">${t('dashboard.recentTasks')}</h2>
          ${state.tasks.length === 0
            ? `<div class="glass-card p-12 text-center text-white/40">${t('dashboard.noTasks')}</div>`
            : `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${state.tasks.slice(0, 6).map(renderTaskCard).join('')}</div>`
          }
        </div>
      </div>
    `;
  }

  function renderTextToVideo() {
    const t = window.i18n.t;
    return `
      <div>
        <label class="block text-sm text-white/60 mb-2">${t('ttv.promptLabel')}</label>
        <textarea
          class="input-field"
          placeholder="${t('ttv.promptPlaceholder')}"
          oninput="window.vzongApp.setTTVPrompt(this.value)"
        >${state.ttvPrompt}</textarea>
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs text-white/40">${t('ttv.generateHint')}</span>
          <button onclick="window.vzongApp.generate()" class="btn-primary">
            ${t('ttv.generate')} ✨
          </button>
        </div>
      </div>
    `;
  }

  function renderImageToVideo() {
    const t = window.i18n.t;
    return `
      <div class="grid md:grid-cols-2 gap-4">
        <!-- 图片上传 -->
        <div>
          <label class="block text-sm text-white/60 mb-2">${t('itv.uploadTitle')}</label>
          <div
            class="upload-zone ${state.itvImage?'has-image':''}"
            onclick="document.getElementById('image-input').click()"
            ondragover="event.preventDefault(); this.classList.add('dragover')"
            ondragleave="this.classList.remove('dragover')"
            ondrop="event.preventDefault(); this.classList.remove('dragover'); if(event.dataTransfer.files[0]) window.vzongApp.uploadImage(event.dataTransfer.files[0])"
          >
            ${state.itvImage
              ? `<img src="${state.itvImage}" alt="uploaded" />
                 <button onclick="event.stopPropagation(); document.getElementById('image-input').click()" class="btn-ghost text-xs mt-2">${t('itv.changeImage')}</button>`
              : `<div>
                   <div class="text-4xl mb-2">📷</div>
                   <div class="text-sm text-white/60 mb-1">${t('itv.uploadHint')}</div>
                   <div class="text-xs text-white/40">${t('itv.uploadFormats')}</div>
                 </div>`
            }
          </div>
          <input id="image-input" type="file" accept="image/jpeg,image/png" class="hidden" onchange="if(this.files[0]) window.vzongApp.uploadImage(this.files[0])" />
        </div>

        <!-- 文字指令 -->
        <div>
          <label class="block text-sm text-white/60 mb-2">${t('itv.promptLabel')}</label>
          <textarea
            class="input-field"
            placeholder="${t('itv.promptPlaceholder')}"
            oninput="window.vzongApp.setITVPrompt(this.value)"
          >${state.itvPrompt}</textarea>

          <!-- 示例 -->
          <div class="mt-3">
            <div class="text-xs text-white/40 mb-2">${t('itv.examples')}:</div>
            <div class="flex flex-wrap gap-2">
              <button onclick="window.vzongApp.setITVPrompt('${t('itv.example1')}')" class="capsule-btn text-xs">
                💃 ${t('itv.example1')}
              </button>
              <button onclick="window.vzongApp.setITVPrompt('${t('itv.example2')}')" class="capsule-btn text-xs">
                🦋 ${t('itv.example2')}
              </button>
              <button onclick="window.vzongApp.setITVPrompt('${t('itv.example3')}')" class="capsule-btn text-xs">
                🎤 ${t('itv.example3')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(0,240,255,0.1)]">
        <span class="text-xs text-white/40">${t('ttv.generateHint')}</span>
        <button onclick="window.vzongApp.generate()" class="btn-primary">
          ${t('itv.generate')} ✨
        </button>
      </div>
    `;
  }

  function renderWorkOrder() {
    const t = window.i18n.t;
    const wo = state.currentWorkOrder;
    if (!wo) {
      return `
        <div class="text-center py-8">
          <div class="text-4xl mb-3 opacity-50">📋</div>
          <div class="text-sm text-white/40">${t('workorder.desc')}</div>
        </div>
      `;
    }
    return `
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold flex items-center gap-2">
            <span>📋</span>
            <span>${t('workorder.title')}</span>
          </h3>
          <button onclick="window.vzongApp.copyWorkOrder()" class="btn-ghost text-xs">
            📋 ${t('workorder.copyAll')}
          </button>
        </div>
        <p class="text-xs text-white/40 mb-4">${t('workorder.desc')}</p>
        <div class="space-y-3">
          ${[
            { key: 'subject', icon: '👤', label: t('workorder.subject') },
            { key: 'scene', icon: '🏞️', label: t('workorder.scene') },
            { key: 'action', icon: '🏃', label: t('workorder.action') },
            { key: 'camera', icon: '🎥', label: t('workorder.camera') },
            { key: 'style', icon: '🎨', label: t('workorder.style') },
            { key: 'constraints', icon: '✅', label: t('workorder.constraints') },
          ].map(item => `
            <div class="bg-[rgba(0,0,0,0.3)] rounded-lg p-3 border border-[rgba(0,240,255,0.1)]">
              <div class="flex items-center gap-2 text-xs text-[#00F0FF] mb-1">
                <span>${item.icon}</span>
                <span class="font-semibold">${item.label}</span>
              </div>
              <div class="text-sm text-white/80 leading-relaxed">${wo[item.key]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTaskCard(task) {
    const t = window.i18n.t;
    const statusColors = {
      queued: 'text-yellow-400 bg-yellow-400/10',
      processing: 'text-[#00F0FF] bg-[#00F0FF]/10',
      completed: 'text-green-400 bg-green-400/10',
      failed: 'text-red-400 bg-red-400/10',
    };
    const statusLabels = {
      queued: t('task.queued'),
      processing: t('task.processing'),
      completed: t('task.completed'),
      failed: t('task.failed'),
    };
    return `
      <div class="task-card fade-in">
        <div class="aspect-video bg-[#0A1128] relative overflow-hidden">
          ${task.thumbnailDataUrl
            ? `<img src="${task.thumbnailDataUrl}" alt="thumbnail" class="w-full h-full object-cover" />`
            : `<div class="w-full h-full flex items-center justify-center">
                 <div class="w-10 h-10 rounded-full border-4 border-[#00F0FF]/20 border-t-[#00F0FF] animate-spin"></div>
               </div>`
          }
          <div class="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold ${statusColors[task.status]}">
            ${statusLabels[task.status]}${task.status==='processing'?' '+task.progress+'%':''}
          </div>
        </div>
        <div class="p-4">
          <div class="text-sm text-white/80 mb-2 line-clamp-2">${task.params.prompt || '(no prompt)'}</div>
          <div class="flex items-center justify-between text-xs text-white/40 mb-3">
            <span>${task.params.duration}s · ${(task.params.styles||[]).join(', ')||'default'}</span>
            <span>${new Date(task.createdAt).toLocaleTimeString()}</span>
          </div>
          ${task.status==='processing'
            ? `<div class="progress-bar"><div class="progress-bar-fill" style="width:${task.progress}%"></div></div>`
            : `<div class="flex gap-2">
                 ${task.status==='completed' ? `<button onclick="window.vzongApp.downloadTask('${task.id}')" class="btn-ghost text-xs flex-1">⬇️ ${t('task.download')}</button>` : ''}
                 ${task.status==='failed' ? `<button onclick="window.vzongApp.retryTask('${task.id}')" class="btn-ghost text-xs flex-1">🔄 ${t('task.retry')}</button>` : ''}
                 <button onclick="window.vzongApp.deleteTask('${task.id}')" class="btn-ghost text-xs">🗑️</button>
               </div>`
          }
        </div>
      </div>
    `;
  }

  // ===== 渲染：Gallery =====
  function renderGallery() {
    const t = window.i18n.t;
    return `
      <div class="pt-20 min-h-screen max-w-7xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">${t('nav.gallery')}</h1>
          <button onclick="window.vzongApp.navigate('dashboard')" class="btn-secondary text-sm">+ ${t('dashboard.tab.textToVideo')}</button>
        </div>
        ${state.tasks.length === 0
          ? `<div class="glass-card p-16 text-center">
               <div class="text-6xl mb-4 opacity-30">🎬</div>
               <div class="text-white/40">${t('task.empty')}</div>
             </div>`
          : `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${state.tasks.map(renderTaskCard).join('')}</div>`
        }
      </div>
    `;
  }

  // ===== 渲染：Settings =====
  function renderSettings() {
    const t = window.i18n.t;
    const user = state.user || {};
    return `
      <div class="pt-20 min-h-screen max-w-4xl mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold mb-6">${t('settings.title')}</h1>

        <div class="glass-card p-6 mb-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span>👤</span><span>${t('settings.profile')}</span>
          </h2>
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-white/40 mb-1">${t('settings.username')}</div>
              <div class="font-semibold">${user.displayName || '-'}</div>
            </div>
            <div>
              <div class="text-white/40 mb-1">${t('settings.email')}</div>
              <div class="font-semibold">${user.email || '-'}</div>
            </div>
            <div>
              <div class="text-white/40 mb-1">${t('settings.accountType')}</div>
              <div class="font-semibold">${user.isGuest ? t('settings.accountTypeGuest') : t('settings.accountTypeUser')}</div>
            </div>
            <div>
              <div class="text-white/40 mb-1">${t('common.credits')}</div>
              <div class="font-semibold text-[#00F0FF]">${state.credits}</div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 mb-6">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📊</span><span>${t('settings.stats')}</span>
          </h2>
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-white/40 mb-1">${t('settings.totalGenerated')}</div>
              <div class="text-3xl font-bold gradient-text">${state.totalGenerated}</div>
            </div>
            <div>
              <div class="text-white/40 mb-1">${t('settings.joinedAt')}</div>
              <div class="font-semibold">${user.uid && user.uid.startsWith('guest-') ? new Date(parseInt(user.uid.replace('guest-',''))).toLocaleDateString() : '-'}</div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 border border-red-500/20">
          <h2 class="text-lg font-bold mb-2 text-red-400 flex items-center gap-2">
            <span>⚠️</span><span>${t('settings.dangerZone')}</span>
          </h2>
          <p class="text-sm text-white/60 mb-4">${t('settings.clearLocalDesc')}</p>
          <button onclick="window.vzongApp.clearLocal()" class="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all text-sm">
            ${t('settings.clearLocalBtn')}
          </button>
        </div>
      </div>
    `;
  }

  // ===== 渲染：登录弹窗 =====
  function renderLoginDialog() {
    const t = window.i18n.t;
    const isLogin = state.authMode === 'login';
    return `
      <div class="modal-overlay" onclick="if(event.target===this) window.vzongApp.closeLoginDialog()">
        <div class="modal-content">
          <button onclick="window.vzongApp.closeLoginDialog()" class="absolute top-4 right-4 text-white/40 hover:text-white text-2xl leading-none">×</button>

          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#0080FF] flex items-center justify-center font-bold text-[#0A1128] text-2xl mb-3">V</div>
            <h2 class="text-2xl font-bold">${t('auth.loginTitle')}</h2>
            <p class="text-sm text-white/60 mt-1">${t('auth.loginSubtitle')}</p>
          </div>

          <div class="space-y-3">
            ${!isLogin ? `
              <div>
                <label class="text-xs text-white/60 mb-1 block">${t('auth.username')}</label>
                <input id="auth-username" type="text" class="input-field" placeholder="vzong creator" />
              </div>
            ` : ''}
            <div>
              <label class="text-xs text-white/60 mb-1 block">${t('auth.email')}</label>
              <input id="auth-email" type="email" class="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label class="text-xs text-white/60 mb-1 block">${t('auth.password')}</label>
              <input id="auth-password" type="password" class="input-field" placeholder="••••••••" />
            </div>
          </div>

          <button onclick="window.vzongApp.handleAuth()" class="btn-primary w-full mt-5">
            ${isLogin ? t('auth.loginBtn') : t('auth.signupBtn')}
          </button>

          <div class="text-center text-xs text-white/40 my-4">— or —</div>

          <div class="grid grid-cols-2 gap-3">
            <button onclick="window.vzongApp.handleGoogle()" class="btn-secondary text-sm flex items-center justify-center gap-2">
              <span>🔵</span><span>Google</span>
            </button>
            <button onclick="window.vzongApp.handleGithub()" class="btn-secondary text-sm flex items-center justify-center gap-2">
              <span>⚫</span><span>GitHub</span>
            </button>
          </div>

          <button onclick="window.vzongApp.loginAsGuest()" class="w-full text-center text-sm text-white/60 hover:text-white mt-4">
            ${t('auth.guest')} →
          </button>
          <p class="text-center text-xs text-white/40 mt-2">${t('auth.guestHint')}</p>

          <div class="text-center text-sm text-white/60 mt-4">
            ${isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            <button onclick="window.vzongApp.setAuthMode('${isLogin?'signup':'login'}')" class="text-[#00F0FF] hover:underline ml-1">
              ${isLogin ? t('auth.signup') : t('auth.login')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ===== 渲染：积分购买弹窗 =====
  function renderCreditsDialog() {
    const t = window.i18n.t;
    return `
      <div class="modal-overlay" onclick="if(event.target===this) window.vzongApp.closeCreditsDialog()">
        <div class="modal-content">
          <button onclick="window.vzongApp.closeCreditsDialog()" class="absolute top-4 right-4 text-white/40 hover:text-white text-2xl leading-none">×</button>
          <h2 class="text-2xl font-bold mb-2">${t('credits.title')}</h2>
          <p class="text-sm text-white/60 mb-6">${t('credits.subtitle')}</p>
          <div class="space-y-3">
            ${[
              { name: t('credits.pack1'), desc: t('credits.pack1Desc'), price: '¥9', amount: 20 },
              { name: t('credits.pack2'), desc: t('credits.pack2Desc'), price: '¥39', amount: 110, popular: true },
              { name: t('credits.pack3'), desc: t('credits.pack3Desc'), price: '¥169', amount: 580 },
            ].map(p => `
              <div class="glass-card p-4 flex items-center justify-between ${p.popular?'border-[#00F0FF] pulse-glow':''}">
                <div>
                  <div class="font-bold flex items-center gap-2">
                    ${p.popular ? '<span class="text-xs px-2 py-0.5 rounded bg-[#00F0FF] text-[#0A1128]">HOT</span>' : ''}
                    ${p.name}
                  </div>
                  <div class="text-sm text-white/60 mt-1">${p.desc}</div>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold gradient-text mb-1">${p.price}</div>
                  <button onclick="window.vzongApp.buyCredits(${p.amount})" class="btn-primary text-xs px-4 py-1.5">${t('credits.buy')}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ===== 主渲染 =====
  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    let content = '';
    switch (state.view) {
      case 'landing': content = renderLanding(); break;
      case 'dashboard': content = renderDashboard(); break;
      case 'gallery': content = renderGallery(); break;
      case 'settings': content = renderSettings(); break;
      default: content = renderLanding();
    }

    app.innerHTML = `
      ${renderNav()}
      <main class="fade-in">${content}</main>
      ${state.showLoginDialog ? renderLoginDialog() : ''}
      ${state.showCreditsDialog ? renderCreditsDialog() : ''}
    `;

    // 应用翻译（针对 data-i18n 元素）
    window.i18n.applyTranslations(app);

    // 同步语言
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  }

  // ===== 局部刷新工单面板（避免输入时失去焦点） =====
  function refreshWorkOrderPanel() {
    if (state.view !== 'dashboard') return;
    // 找到工单所在的 glass-card（第二个，在 lg:col-span-2 之后）
    const cards = document.querySelectorAll('#app .glass-card');
    if (cards.length < 2) return;
    // Dashboard 中第 2 个 glass-card 是工单区（lg:col-span-1）
    const workOrderCard = cards[1];
    workOrderCard.innerHTML = renderWorkOrder();
  }

  // ===== 公共 API =====
  window.vzongApp = {
    navigate(view) { state.view = view; window.scrollTo(0, 0); render(); },
    setLang(lang) { window.i18n.setLang(lang); state.lang = lang; render(); },
    startCreating() {
      if (!state.user) {
        state.showLoginDialog = true;
        render();
        return;
      }
      state.view = 'dashboard';
      render();
    },
    setTab(tab) { state.activeTab = tab; updateWorkOrder(); render(); },
    setTTVPrompt(v) {
      state.ttvPrompt = v;
      updateWorkOrder();
      refreshWorkOrderPanel();
    },
    setITVPrompt(v) {
      state.itvPrompt = v;
      // 同步到 textarea（仅在值不一致时更新，避免光标跳动）
      const ta = document.querySelector('textarea[oninput*="setITVPrompt"]');
      if (ta && ta.value !== v) ta.value = v;
      updateWorkOrder();
      refreshWorkOrderPanel();
    },
    uploadImage(file) { handleImageUpload(file); },
    setCamera(v) { state.cameraMovement = v; updateWorkOrder(); render(); },
    setDuration(v) { state.duration = v; updateWorkOrder(); render(); },
    toggleStyle(s) {
      const i = state.styles.indexOf(s);
      if (i >= 0) {
        if (state.styles.length > 1) state.styles.splice(i, 1);
      } else {
        state.styles.push(s);
      }
      updateWorkOrder();
      render();
    },
    toggleAdvanced() { state.advancedOpen = !state.advancedOpen; render(); },
    generate() { handleGenerate(); },
    downloadTask(id) { downloadTask(id); },
    deleteTask(id) { deleteTask(id); },
    retryTask(id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.status = 'queued';
        task.progress = 0;
        task.error = null;
        render();
        startVideoGeneration(id, task.params);
      }
    },
    copyWorkOrder() {
      if (!state.currentWorkOrder) return;
      const text = window.WorkOrder.workOrderToText(state.currentWorkOrder, state.lang);
      navigator.clipboard.writeText(text).then(() => {
        toast(window.i18n.t('common.copied'), 'success');
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        toast(window.i18n.t('common.copied'), 'success');
      });
    },
    openLoginDialog() { state.showLoginDialog = true; render(); },
    closeLoginDialog() { state.showLoginDialog = false; render(); },
    setAuthMode(m) { state.authMode = m; render(); },
    async handleAuth() {
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      if (!email || !password) {
        toast('请填写邮箱和密码', 'error');
        return;
      }
      try {
        if (state.authMode === 'signup') {
          const username = document.getElementById('auth-username').value.trim() || email.split('@')[0];
          await signupWithEmail(email, password, username);
        } else {
          await loginWithEmail(email, password);
        }
        state.showLoginDialog = false;
        // 等待 onAuthStateChanged 触发 render
      } catch (e) {
        toast(e.message || window.i18n.t('error.auth'), 'error');
      }
    },
    async handleGoogle() {
      try { await loginWithGoogle(); state.showLoginDialog = false; }
      catch (e) { toast(e.message || window.i18n.t('error.auth'), 'error'); }
    },
    async handleGithub() {
      try { await loginWithGithub(); state.showLoginDialog = false; }
      catch (e) { toast(e.message || window.i18n.t('error.auth'), 'error'); }
    },
    loginAsGuest() { loginAsGuest(); },
    logout() { logout(); },
    openCreditsDialog() { state.showCreditsDialog = true; render(); },
    closeCreditsDialog() { state.showCreditsDialog = false; render(); },
    buyCredits(amount) {
      addCredits(amount);
      state.showCreditsDialog = false;
      render();
    },
    clearLocal() {
      if (!confirm('确认清除所有本地数据？此操作不可撤销。')) return;
      localStorage.removeItem('vzong-state');
      localStorage.removeItem('vzong-guest');
      Object.keys(localStorage).filter(k => k.startsWith('vzong-credits-')).forEach(k => localStorage.removeItem(k));
      state.tasks = [];
      state.user = null;
      state.credits = 0;
      state.totalGenerated = 0;
      state.view = 'landing';
      toast('已清除本地数据', 'success');
      render();
    },
  };

  // ===== 监听语言变化 =====
  window.addEventListener('lang-change', () => {
    state.lang = window.i18n.getLang();
    render();
  });

  // ===== 启动 =====
  function boot() {
    loadState();
    setupAuthListener();
    // 初次渲染
    render();
    // 如果已配置 Firebase，等待 onAuthStateChanged
    // 如果未配置，立即加载访客积分
    if (!window.fbConfig.isConfigured) {
      if (state.user) loadUserCredits();
    } else if (state.user && state.user.isGuest) {
      loadUserCredits();
    }
    // 尝试再次初始化 Firebase（防止 SDK 异步加载）
    setTimeout(() => {
      if (!window.fbConfig.isConfigured) {
        window.fbConfig.init();
        setupAuthListener();
        if (state.user) loadUserCredits();
      }
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
