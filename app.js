// vzong · AI视频导航 - 主应用逻辑（vanilla JS）
// 架构：landing | tutorials | workshop | gallery | settings
// 设计理念：网站只做引导与展示，不调用任何付费 AI 视频 API

(function () {
  'use strict';

  // ===== 全局状态 =====
  const state = {
    view: 'landing',
    lang: window.i18n.getLang(),
    user: null,
    // 教程
    tutorialProgress: {},   // { 'ch1-prep': true, ... }
    activeTutorialId: null,
    // 工坊
    workshopIdea: '',
    workshopCamera: 'push',
    workshopDuration: 8,
    workshopStyle: 'cinematic',
    ollamaStatus: 'checking',  // 'checking' | 'online' | 'offline'
    ollamaModels: [],
    ollamaSelectedModel: '',
    ollamaUrl: '',
    workshopEnhancing: false,
    workshopResult: null,     // { fullPrompt, workOrder }
    workshopCalls: 0,
    // 画廊
    galleryItems: [],
    galleryFilter: 'all',
    gallerySort: 'newest',
    gallerySearch: '',
    galleryLoading: false,
    // 设置
    showLoginDialog: false,
    authMode: 'login',
    authError: null,
  };

  // ===== 持久化 =====
  function loadState() {
    try {
      const saved = localStorage.getItem('vzong-state-v2');
      if (saved) {
        const p = JSON.parse(saved);
        state.tutorialProgress = p.tutorialProgress || {};
        state.workshopCalls = p.workshopCalls || 0;
        state.workshopCamera = p.workshopCamera || 'push';
        state.workshopDuration = p.workshopDuration || 8;
        state.workshopStyle = p.workshopStyle || 'cinematic';
      }
      const guest = localStorage.getItem('vzong-guest');
      if (guest) state.user = JSON.parse(guest);
      state.ollamaUrl = window.OllamaClient.getUrl();
    } catch (e) {
      console.warn('[State] load failed:', e);
    }
  }

  function saveState() {
    try {
      const toSave = {
        tutorialProgress: state.tutorialProgress,
        workshopCalls: state.workshopCalls,
        workshopCamera: state.workshopCamera,
        workshopDuration: state.workshopDuration,
        workshopStyle: state.workshopStyle,
      };
      localStorage.setItem('vzong-state-v2', JSON.stringify(toSave));
    } catch (e) {
      console.warn('[State] save failed:', e);
    }
  }

  // ===== Toast =====
  function toast(msg, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type} slide-in-right`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s, transform 0.3s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ===== 路由 =====
  async function navigate(view, params) {
    state.view = view;
    if (params) Object.assign(state, params);
    saveState();
    // 进入 gallery 视图时异步刷新数据
    if (view === 'gallery') {
      render();
      await loadGallery();
      render();
    } else {
      render();
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ===== 认证 =====
  function ensureGuest() {
    if (!state.user) {
      state.user = {
        uid: 'guest_' + Math.random().toString(36).slice(2, 10),
        displayName: '访客',
        email: '',
        isGuest: true,
        joinedAt: Date.now(),
      };
      localStorage.setItem('vzong-guest', JSON.stringify(state.user));
    }
  }

  // ===== 主渲染入口 =====
  function render() {
    const app = document.getElementById('app');
    if (!app) return;
    const html = renderShell();
    app.innerHTML = html;
    window.i18n.applyTranslations(app);
    bindShellEvents();
    renderView();
  }

  function renderShell() {
    const lang = state.lang;
    const user = state.user;
    const navItems = ['home', 'tutorials', 'workshop', 'gallery', 'settings']
      .map((v) => {
        const isActive = (v === 'home' && state.view === 'landing') || state.view === v;
        const label = window.i18n.t(`nav.${v}`);
        return `<button class="nav-link ${isActive ? 'active' : ''}" data-nav="${v === 'home' ? 'landing' : v}">${label}</button>`;
      })
      .join('');

    const rightPart = !user || user.isGuest
      ? `<button class="btn-secondary text-sm" data-action="open-login" data-i18n="nav.login">登录</button>`
      : `<div class="flex items-center gap-3">
          <span class="text-sm text-white/60">${escapeHtml(user.displayName || user.email || '访客')}</span>
          <button class="btn-ghost text-sm" data-action="logout" data-i18n="nav.logout">退出</button>
        </div>`;

    return `
      <div class="min-h-screen flex flex-col">
        <header class="sticky top-0 z-40 backdrop-blur-md bg-[#0A1128]/80 border-b border-white/5">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <button class="flex items-center gap-2 cursor-pointer" data-nav="landing">
              <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#0080FF] flex items-center justify-center text-[#0A1128] font-black text-lg">v</span>
              <span class="text-lg font-bold tracking-tight">vzong<span class="text-[#00F0FF]">·</span><span class="text-sm font-medium text-white/70" data-i18n="brand.suffix">·AI视频导航</span></span>
            </button>
            <nav class="hidden md:flex items-center gap-1">${navItems}</nav>
            <div class="flex items-center gap-3">
              <div class="lang-toggle">
                <button class="${lang === 'zh' ? 'active' : ''}" data-action="set-lang" data-lang="zh">中</button>
                <button class="${lang === 'en' ? 'active' : ''}" data-action="set-lang" data-lang="en">EN</button>
              </div>
              ${rightPart}
            </div>
          </div>
          <nav class="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 border-t border-white/5">
            ${navItems}
          </nav>
        </header>

        <main id="view-root" class="flex-1"></main>

        <footer class="border-t border-white/5 mt-12 py-8 px-4">
          <div class="max-w-7xl mx-auto text-center text-sm text-white/40">
            <p class="mb-2" data-i18n="landing.footer.tagline"></p>
            <p data-i18n="landing.footer.copyright"></p>
          </div>
        </footer>
      </div>
      ${state.showLoginDialog ? renderLoginDialog() : ''}
    `;
  }

  // ===== 登录弹窗 =====
  function renderLoginDialog() {
    const isLogin = state.authMode === 'login';
    const titleKey = isLogin ? 'auth.loginTitle' : 'auth.signupBtn';
    const switchAction = isLogin ? 'switch-to-signup' : 'switch-to-login';
    const switchTextKey = isLogin ? 'auth.noAccount' : 'auth.hasAccount';
    const switchBtnKey = isLogin ? 'auth.signup' : 'auth.login';
    const submitKey = isLogin ? 'auth.loginBtn' : 'auth.signupBtn';
    const fbReady = !!(window.fbConfig && window.fbConfig.isConfigured && window.fbConfig.auth);

    return `
      <div class="modal-overlay" id="login-overlay">
        <div class="modal-content" style="max-width: 440px;">
          <button class="absolute top-3 right-3 text-white/40 hover:text-white text-2xl leading-none" data-action="close-login">×</button>
          <h2 class="text-2xl font-bold mb-1" data-i18n="${titleKey}"></h2>
          <p class="text-sm text-white/60 mb-6" data-i18n="auth.loginSubtitle"></p>

          ${!fbReady ? `
            <div class="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
              ⚠️ Firebase 未就绪，仅支持访客模式登录（云端功能不可用）
            </div>
          ` : ''}

          <!-- 第三方登录 -->
          <div class="space-y-2 mb-5">
            <button class="w-full py-2.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 transition flex items-center justify-center gap-3 text-sm font-medium" data-auth="google">
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 34.6 27 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C40.9 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
              <span data-i18n="auth.google"></span>
            </button>
            <button class="w-full py-2.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 transition flex items-center justify-center gap-3 text-sm font-medium" data-auth="github">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
              <span data-i18n="auth.github"></span>
            </button>
          </div>

          <div class="flex items-center gap-3 mb-5">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-xs text-white/40">OR</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- 邮箱密码表单 -->
          <form id="email-auth-form" class="space-y-3">
            ${!isLogin ? `
              <div>
                <label class="block text-xs text-white/60 mb-1" data-i18n="auth.username"></label>
                <input type="text" id="auth-username" class="input-field text-sm" autocomplete="username" />
              </div>
            ` : ''}
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="auth.email"></label>
              <input type="email" id="auth-email" class="input-field text-sm" autocomplete="email" required />
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="auth.password"></label>
              <input type="password" id="auth-password" class="input-field text-sm" autocomplete="${isLogin ? 'current-password' : 'new-password'}" required minlength="6" />
            </div>
            <button type="submit" class="btn-primary w-full" data-i18n="${submitKey}"></button>
          </form>

          ${state.authError ? `<p class="mt-3 text-xs text-red-400 text-center">${escapeHtml(state.authError)}</p>` : ''}

          <!-- 切换登录/注册 -->
          <div class="mt-4 text-center text-xs text-white/60">
            <span data-i18n="${switchTextKey}"></span>
            <button class="text-[#00F0FF] hover:underline ml-1" data-action="${switchAction}" data-i18n="${switchBtnKey}"></button>
          </div>

          <!-- 访客模式 -->
          <div class="mt-5 pt-4 border-t border-white/10">
            <button class="w-full py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition" data-auth="guest">
              <span data-i18n="auth.guest"></span>
            </button>
            <p class="text-xs text-white/40 text-center mt-2" data-i18n="auth.guestHint"></p>
          </div>
        </div>
      </div>
    `;
  }

  // ===== 第三方登录提供者 =====
  function googleProvider() {
    if (typeof firebase === 'undefined' || !firebase.auth.GoogleAuthProvider) return null;
    return new firebase.auth.GoogleAuthProvider();
  }
  function githubProvider() {
    if (typeof firebase === 'undefined' || !firebase.auth.GithubAuthProvider) return null;
    return new firebase.auth.GithubAuthProvider();
  }

  // ===== 邮箱登录/注册 =====
  async function handleEmailAuth() {
    const email = (document.getElementById('auth-email') || {}).value || '';
    const password = (document.getElementById('auth-password') || {}).value || '';
    const username = (document.getElementById('auth-username') || {}).value || '';
    if (!email || !password) {
      state.authError = 'Email and password are required';
      render();
      return;
    }
    try {
      if (state.authMode === 'signup') {
        const cred = await window.fbConfig.auth.createUserWithEmailAndPassword(email, password);
        if (username) {
          await cred.user.updateProfile({ displayName: username });
        }
        toast(window.i18n.t('auth.signupSuccess'), 'success');
      } else {
        await window.fbConfig.auth.signInWithEmailAndPassword(email, password);
        toast(window.i18n.t('auth.welcomeBack'), 'success');
      }
      state.showLoginDialog = false;
      state.authError = null;
      // onAuthStateChanged 会接管 state 更新
    } catch (e) {
      console.warn('[Auth] email auth failed:', e);
      state.authError = humanizeAuthError(e);
      render();
    }
  }

  // ===== 第三方登录 =====
  async function handleOAuth(providerName) {
    if (!window.fbConfig || !window.fbConfig.isConfigured || !window.fbConfig.auth) {
      toast('Firebase 未就绪，请使用访客模式', 'error');
      return;
    }
    const provider = providerName === 'google' ? googleProvider() : githubProvider();
    if (!provider) {
      toast('当前 Firebase SDK 不支持此登录方式', 'error');
      return;
    }
    try {
      await window.fbConfig.auth.signInWithPopup(provider);
      toast(window.i18n.t('auth.welcomeBack'), 'success');
      state.showLoginDialog = false;
      state.authError = null;
    } catch (e) {
      console.warn('[Auth] OAuth failed:', e);
      // popup-blocked 等可降级到 redirect
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request') {
        try {
          await window.fbConfig.auth.signInWithRedirect(provider);
          return;
        } catch (e2) {
          toast(humanizeAuthError(e2), 'error');
          return;
        }
      }
      state.authError = humanizeAuthError(e);
      render();
    }
  }

  // ===== 访客登录 =====
  function handleGuestLogin() {
    ensureGuest();
    state.showLoginDialog = false;
    state.authError = null;
    toast(window.i18n.t('auth.guestMode'), 'info');
    render();
  }

  // ===== 把 Firebase 错误码转成人话 =====
  function humanizeAuthError(e) {
    const code = e && e.code ? e.code : '';
    const lang = window.i18n ? window.i18n.getLang() : 'zh';
    const map = {
      'auth/invalid-email': lang === 'zh' ? '邮箱格式不正确' : 'Invalid email format',
      'auth/user-disabled': lang === 'zh' ? '账号已被禁用' : 'Account disabled',
      'auth/user-not-found': lang === 'zh' ? '用户不存在，请先注册' : 'User not found, please sign up first',
      'auth/wrong-password': lang === 'zh' ? '密码错误' : 'Wrong password',
      'auth/email-already-in-use': lang === 'zh' ? '邮箱已被注册' : 'Email already registered',
      'auth/weak-password': lang === 'zh' ? '密码强度不足（至少 6 位）' : 'Weak password (min 6 chars)',
      'auth/popup-closed-by-user': lang === 'zh' ? '登录窗口被关闭' : 'Login popup closed',
      'auth/operation-not-allowed': lang === 'zh' ? '此登录方式未在 Firebase 控制台启用' : 'This sign-in method is not enabled in Firebase Console',
      'auth/unauthorized-domain': lang === 'zh' ? '当前域名未在 Firebase 授权列表中' : 'This domain is not authorized in Firebase Console',
      'auth/network-request-failed': lang === 'zh' ? '网络错误，请检查连接' : 'Network error',
    };
    return map[code] || (e && e.message ? e.message : window.i18n.t('error.auth'));
  }

  // ===== 监听 Firebase 登录状态变化 =====
  function setupAuthObserver() {
    if (!window.fbConfig || !window.fbConfig.isConfigured || !window.fbConfig.auth) return;
    if (window._vzongAuthObs) return; // 已注册
    window._vzongAuthObs = true;
    window.fbConfig.auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        state.user = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : '用户'),
          photoURL: fbUser.photoURL || '',
          isGuest: false,
          joinedAt: fbUser.metadata && fbUser.metadata.creationTime ? Date.parse(fbUser.metadata.creationTime) : Date.now(),
        };
        localStorage.setItem('vzong-guest', JSON.stringify(state.user));
        // 同步用户积分到 Firestore（可选）
        try {
          await syncUserDoc(fbUser.uid, state.user);
        } catch (e) {
          console.warn('[Auth] syncUserDoc failed:', e);
        }
      } else {
        // 退出登录 - 但不要在用户是 guest 时清掉
        if (state.user && !state.user.isGuest) {
          state.user = null;
          localStorage.removeItem('vzong-guest');
          ensureGuest();
        }
      }
      render();
    });
  }

  // 同步用户文档到 Firestore
  async function syncUserDoc(uid, userInfo) {
    if (!window.fbConfig || !window.fbConfig.isConfigured || !window.fbConfig.db) return;
    const ref = window.fbConfig.db.collection('users').doc(uid);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({
        uid,
        email: userInfo.email,
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL,
        createdAt: Date.now(),
      });
    } else {
      await ref.update({
        lastLoginAt: Date.now(),
        displayName: userInfo.displayName,
      });
    }
  }

  function bindShellEvents() {
    const app = document.getElementById('app');
    app.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', () => {
        const v = el.getAttribute('data-nav');
        navigate(v);
      });
    });
    app.querySelectorAll('[data-action="set-lang"]').forEach((el) => {
      el.addEventListener('click', () => {
        const l = el.getAttribute('data-lang');
        window.i18n.setLang(l);
        state.lang = l;
        render();
      });
    });
    app.querySelectorAll('[data-action="open-login"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.showLoginDialog = true;
        state.authMode = 'login';
        state.authError = null;
        render();
      });
    });
    app.querySelectorAll('[data-action="close-login"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.showLoginDialog = false;
        state.authError = null;
        render();
      });
    });
    // 点击 overlay 关闭
    app.querySelectorAll('#login-overlay').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          state.showLoginDialog = false;
          state.authError = null;
          render();
        }
      });
    });
    // 切换登录/注册
    app.querySelectorAll('[data-action="switch-to-signup"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.authMode = 'signup';
        state.authError = null;
        render();
      });
    });
    app.querySelectorAll('[data-action="switch-to-login"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.authMode = 'login';
        state.authError = null;
        render();
      });
    });
    // 第三方登录
    app.querySelectorAll('[data-auth]').forEach((el) => {
      el.addEventListener('click', () => {
        const method = el.getAttribute('data-auth');
        if (method === 'google' || method === 'github') {
          handleOAuth(method);
        } else if (method === 'guest') {
          handleGuestLogin();
        }
      });
    });
    // 邮箱表单提交
    const emailForm = app.querySelector('#email-auth-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEmailAuth();
      });
    }
    app.querySelectorAll('[data-action="logout"]').forEach((el) => {
      el.addEventListener('click', async () => {
        // 如果是 Firebase 用户，先调用 signOut
        if (window.fbConfig && window.fbConfig.isConfigured && window.fbConfig.auth && state.user && !state.user.isGuest) {
          try { await window.fbConfig.auth.signOut(); } catch (e) {}
        }
        localStorage.removeItem('vzong-guest');
        state.user = null;
        ensureGuest();
        toast(window.i18n.t('auth.logoutSuccess'), 'success');
        render();
      });
    });
  }

  function renderView() {
    const root = document.getElementById('view-root');
    if (!root) return;
    let html = '';
    switch (state.view) {
      case 'landing': html = renderLanding(); break;
      case 'tutorials': html = state.activeTutorialId ? renderTutorialDetail() : renderTutorialList(); break;
      case 'workshop': html = renderWorkshop(); break;
      case 'gallery': html = renderGallery(); break;
      case 'settings': html = renderSettings(); break;
      default: html = renderLanding();
    }
    root.innerHTML = html;
    window.i18n.applyTranslations(root);
    bindViewEvents();
  }

  // ===== Landing =====
  function renderLanding() {
    const stats = [
      { num: '6', key: 'landing.stats.tutorials' },
      { num: '10+', key: 'landing.stats.models' },
      { num: '7', key: 'landing.stats.styles' },
      { num: '100', key: 'landing.stats.free' },
    ];

    const features = [
      { icon: '📚', titleKey: 'landing.features.tutorial.title', descKey: 'landing.features.tutorial.desc', nav: 'tutorials' },
      { icon: '✨', titleKey: 'landing.features.workshop.title', descKey: 'landing.features.workshop.desc', nav: 'workshop' },
      { icon: '🎬', titleKey: 'landing.features.gallery.title', descKey: 'landing.features.gallery.desc', nav: 'gallery' },
    ];

    const steps = [
      { num: '01', titleKey: 'landing.howitworks.step1.title', descKey: 'landing.howitworks.step1.desc' },
      { num: '02', titleKey: 'landing.howitworks.step2.title', descKey: 'landing.howitworks.step2.desc' },
      { num: '03', titleKey: 'landing.howitworks.step3.title', descKey: 'landing.howitworks.step3.desc' },
      { num: '04', titleKey: 'landing.howitworks.step4.title', descKey: 'landing.howitworks.step4.desc' },
    ];

    return `
      <section class="relative overflow-hidden">
        <div class="hero-bg"></div>
        <div class="hero-glow" style="top: -200px; left: -200px;"></div>
        <div class="hero-glow" style="bottom: -300px; right: -100px; background: radial-gradient(circle, rgba(0,128,255,0.12) 0%, transparent 70%);"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 relative">
          <div class="text-center max-w-4xl mx-auto">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs text-[#00F0FF] mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <span data-i18n="landing.badge"></span>
            </div>
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
              <span class="gradient-text" data-i18n="landing.titleLine1"></span>
              <br/>
              <span data-i18n="landing.titleLine2"></span>
            </h1>
            <p class="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-8" data-i18n="landing.subtitle"></p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <button class="btn-primary text-base" data-nav="tutorials">
                <span data-i18n="landing.cta.startTutorial"></span>
                <span class="ml-2">→</span>
              </button>
              <button class="btn-secondary text-base" data-nav="workshop" data-i18n="landing.cta.visitWorkshop"></button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            ${stats.map((s) => `
              <div class="glass-card p-5 text-center">
                <div class="text-3xl md:text-4xl font-black gradient-text">${s.num}</div>
                <div class="text-xs md:text-sm text-white/60 mt-1" data-i18n="${s.key}"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-3" data-i18n="landing.howitworks.title"></h2>
          <p class="text-white/60" data-i18n="landing.howitworks.subtitle"></p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${steps.map((s) => `
            <div class="glass-card glass-card-hover p-6">
              <div class="text-3xl font-black gradient-text mb-3">${s.num}</div>
              <h3 class="text-lg font-bold mb-2" data-i18n="${s.titleKey}"></h3>
              <p class="text-sm text-white/60" data-i18n="${s.descKey}"></p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-3" data-i18n="landing.features.title"></h2>
          <p class="text-white/60" data-i18n="landing.features.subtitle"></p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          ${features.map((f) => `
            <div class="glass-card glass-card-hover p-8 cursor-pointer" data-nav="${f.nav}">
              <div class="text-4xl mb-4">${f.icon}</div>
              <h3 class="text-xl font-bold mb-3" data-i18n="${f.titleKey}"></h3>
              <p class="text-sm text-white/60" data-i18n="${f.descKey}"></p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div class="glass-card p-10 md:p-12 text-center pulse-glow">
          <h2 class="text-2xl md:text-3xl font-bold mb-4" data-i18n="landing.ctaFinal.title"></h2>
          <p class="text-white/60 mb-8" data-i18n="landing.ctaFinal.subtitle"></p>
          <button class="btn-primary text-base" data-nav="tutorials" data-i18n="landing.ctaFinal.button"></button>
        </div>
      </section>
    `;
  }

  // ===== 教程列表 =====
  function renderTutorialList() {
    const tutorials = window.TUTORIALS || [];
    const completedCount = tutorials.filter((t) => state.tutorialProgress[t.id]).length;
    const totalCount = tutorials.length;
    const progressPct = totalCount ? Math.round(completedCount / totalCount * 100) : 0;

    const cards = tutorials.map((t, i) => {
      const content = t[state.lang] || t.zh;
      const done = !!state.tutorialProgress[t.id];
      const diffKey = `tutorial.difficulty.${t.difficulty}`;
      return `
        <div class="glass-card glass-card-hover p-6 cursor-pointer" data-tutorial="${t.id}">
          <div class="flex items-start justify-between mb-3">
            <div class="text-5xl font-black gradient-text leading-none">${String(i + 1).padStart(2, '0')}</div>
            ${done ? `<span class="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
              <span data-i18n="tutorial.completed"></span> ✓
            </span>` : ''}
          </div>
          <h3 class="text-lg font-bold mb-2">${escapeHtml(content.title)}</h3>
          <p class="text-sm text-white/60 mb-4">${escapeHtml(content.summary)}</p>
          <div class="flex items-center gap-3 text-xs text-white/40">
            <span>⏱ ${window.i18n.t('tutorial.estimatedTime', { min: t.estimatedMin })}</span>
            <span>·</span>
            <span data-i18n="${diffKey}"></span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-black mb-3" data-i18n="tutorial.title"></h1>
          <p class="text-white/60" data-i18n="tutorial.subtitle"></p>
        </div>

        <div class="glass-card p-6 mb-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold" data-i18n="tutorial.progress"></span>
            <span class="text-sm text-[#00F0FF]">${window.i18n.t('tutorial.progressHint', { done: completedCount, total: totalCount })}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${cards}
        </div>
      </section>
    `;
  }

  // ===== 教程详情 =====
  function renderTutorialDetail() {
    const tutorial = (window.TUTORIALS || []).find((t) => t.id === state.activeTutorialId);
    if (!tutorial) {
      state.activeTutorialId = null;
      return renderTutorialList();
    }
    const content = tutorial[state.lang] || tutorial.zh;
    const idx = window.TUTORIALS.indexOf(tutorial);
    const prev = idx > 0 ? window.TUTORIALS[idx - 1] : null;
    const next = idx < window.TUTORIALS.length - 1 ? window.TUTORIALS[idx + 1] : null;
    const done = !!state.tutorialProgress[tutorial.id];
    const diffKey = `tutorial.difficulty.${tutorial.difficulty}`;

    const stepsHtml = content.steps.map((step, i) => renderTutorialStep(step, i)).join('');

    return `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button class="btn-ghost text-sm mb-4" data-action="back-to-tutorials">
          ← <span data-i18n="tutorial.backToList"></span>
        </button>

        <div class="mb-8">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs px-2 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30" data-i18n="${diffKey}"></span>
            <span class="text-xs text-white/40">⏱ ${window.i18n.t('tutorial.estimatedTime', { min: tutorial.estimatedMin })}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black mb-3">${escapeHtml(content.title)}</h1>
          <p class="text-white/60 text-lg">${escapeHtml(content.summary)}</p>
        </div>

        <div class="space-y-6 mb-8">
          ${stepsHtml}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button class="btn-ghost text-sm" data-action="${prev ? 'go-tutorial' : 'back-to-tutorials'}" data-tutorial="${prev ? prev.id : ''}">
            ← <span data-i18n="tutorial.prevChapter"></span>
          </button>
          <button class="${done ? 'btn-secondary' : 'btn-primary'} text-sm" data-action="toggle-tutorial-done" data-tutorial="${tutorial.id}">
            ${done ? '✓ ' : ''}<span data-i18n="${done ? 'tutorial.markedInComplete' : 'tutorial.markComplete'}"></span>
          </button>
          <button class="btn-ghost text-sm" data-action="${next ? 'go-tutorial' : 'back-to-tutorials'}" data-tutorial="${next ? next.id : ''}">
            <span data-i18n="tutorial.nextChapter"></span> →
          </button>
        </div>
      </section>
    `;
  }

  function renderTutorialStep(step, idx) {
    if (step.type === 'text') {
      const heading = step.heading ? `<h3 class="text-xl font-bold mb-3 text-white">${escapeHtml(step.heading)}</h3>` : '';
      return `<div class="glass-card p-6">
        ${heading}
        <p class="text-white/80 leading-relaxed">${escapeHtml(step.content)}</p>
      </div>`;
    }
    if (step.type === 'code') {
      return `<div class="glass-card p-6">
        ${step.heading ? `<h3 class="text-xl font-bold mb-3 text-white">${escapeHtml(step.heading)}</h3>` : ''}
        <div class="code-block">
          <div class="code-block-header">
            <span class="text-xs text-white/40">${escapeHtml(step.lang || 'code')}</span>
            <button class="text-xs text-[#00F0FF] hover:text-white transition" data-copy-code="${idx}">
              <span data-i18n="tutorial.copyCode"></span>
            </button>
          </div>
          <pre><code>${escapeHtml(step.content)}</code></pre>
        </div>
      </div>`;
    }
    if (step.type === 'warning') {
      return `<div class="glass-card p-6 border-l-4 border-yellow-500/60 bg-yellow-500/5">
        <div class="flex items-start gap-3">
          <span class="text-2xl">⚠️</span>
          <div class="flex-1">
            <div class="text-sm font-bold text-yellow-400 mb-2" data-i18n="tutorial.warning"></div>
            <p class="text-white/80">${escapeHtml(step.content)}</p>
          </div>
        </div>
      </div>`;
    }
    if (step.type === 'tip') {
      return `<div class="glass-card p-6 border-l-4 border-[#00F0FF]/60 bg-[#00F0FF]/5">
        <div class="flex items-start gap-3">
          <span class="text-2xl">💡</span>
          <div class="flex-1">
            <div class="text-sm font-bold text-[#00F0FF] mb-2" data-i18n="tutorial.tip"></div>
            <p class="text-white/80">${escapeHtml(step.content)}</p>
          </div>
        </div>
      </div>`;
    }
    if (step.type === 'requirement') {
      return `<div class="glass-card p-6 border-l-4 border-blue-500/60 bg-blue-500/5">
        <div class="flex items-start gap-3">
          <span class="text-2xl">📋</span>
          <div class="flex-1">
            <div class="text-sm font-bold text-blue-400 mb-2" data-i18n="tutorial.requirement"></div>
            <p class="text-white/80">${escapeHtml(step.content)}</p>
          </div>
        </div>
      </div>`;
    }
    return '';
  }

  // ===== 创意工坊 =====
  function renderWorkshop() {
    const statusColor = state.ollamaStatus === 'online' ? 'green' : (state.ollamaStatus === 'offline' ? 'red' : 'yellow');
    const statusKey = state.ollamaStatus === 'online' ? 'workshop.ollamaOnline'
                    : (state.ollamaStatus === 'offline' ? 'workshop.ollamaOffline' : 'workshop.ollamaChecking');

    const cameraOptions = ['push', 'pull', 'pan', 'tilt', 'random'].map((c) =>
      `<button class="capsule-btn ${state.workshopCamera === c ? 'active' : ''}" data-camera="${c}" data-i18n="workshop.camera.${c}"></button>`
    ).join('');

    const styleOptions = ['cinematic', 'cyberpunk', 'ink', 'anime', 'realistic', 'fantasy', 'watercolor'].map((s) =>
      `<button class="capsule-btn ${state.workshopStyle === s ? 'active' : ''}" data-style="${s}" data-i18n="workshop.style.${s}"></button>`
    ).join('');

    const examples = ['example1', 'example2', 'example3', 'example4'].map((k) =>
      `<button class="text-xs text-[#00F0FF] hover:underline" data-example="${k}" data-i18n="workshop.${k}"></button>`
    ).join(' · ');

    const modelOptions = state.ollamaModels.length
      ? state.ollamaModels.map((m) => `<option value="${escapeHtml(m)}" ${state.ollamaSelectedModel === m ? 'selected' : ''}>${escapeHtml(m)}</option>`).join('')
      : `<option value="" data-i18n="workshop.ollamaNoModels"></option>`;

    const resultHtml = state.workshopResult
      ? renderWorkshopResult(state.workshopResult)
      : `<div class="text-center py-12 text-white/40">
          <div class="text-4xl mb-3">✨</div>
          <p data-i18n="workshop.result.empty"></p>
        </div>`;

    return `
      <section class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-black mb-3" data-i18n="workshop.title"></h1>
          <p class="text-white/60" data-i18n="workshop.subtitle"></p>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <!-- 输入 -->
            <div class="glass-card p-6">
              <label class="block text-sm font-semibold mb-2" data-i18n="workshop.ideaLabel"></label>
              <textarea id="workshop-idea" class="input-field" placeholder="" data-i18n-placeholder="workshop.ideaPlaceholder" rows="4">${escapeHtml(state.workshopIdea)}</textarea>
              <div class="mt-2 text-xs text-white/40">
                <span data-i18n="workshop.examples"></span>: ${examples}
              </div>
            </div>

            <!-- 高级设置 -->
            <div class="glass-card p-6">
              <h3 class="text-sm font-semibold mb-4" data-i18n="workshop.advanced"></h3>

              <div class="mb-4">
                <label class="block text-xs text-white/60 mb-2" data-i18n="workshop.camera"></label>
                <div class="flex flex-wrap gap-2">${cameraOptions}</div>
              </div>

              <div class="mb-4">
                <label class="block text-xs text-white/60 mb-2">
                  <span data-i18n="workshop.duration"></span>: <span class="text-[#00F0FF] font-bold">${state.workshopDuration}</span><span data-i18n="workshop.durationUnit"></span>
                </label>
                <input type="range" min="5" max="15" value="${state.workshopDuration}" id="workshop-duration" />
              </div>

              <div>
                <label class="block text-xs text-white/60 mb-2" data-i18n="workshop.style"></label>
                <div class="flex flex-wrap gap-2">${styleOptions}</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex flex-wrap gap-3">
              <button class="btn-primary" id="enhance-btn" ${state.workshopEnhancing ? 'disabled' : ''}>
                ${state.workshopEnhancing ? `<span class="inline-block w-4 h-4 border-2 border-[#0A1128]/30 border-t-[#0A1128] rounded-full animate-spin mr-2"></span><span data-i18n="workshop.enhancing"></span>`
                  : (state.ollamaStatus === 'online'
                    ? `<span data-i18n="workshop.enhance"></span>`
                    : `<span data-i18n="workshop.fallback"></span>`)}
              </button>
              ${state.ollamaStatus === 'offline' ? `<p class="text-xs text-white/40 self-center" data-i18n="workshop.fallbackHint"></p>` : ''}
            </div>

            <!-- 结果 -->
            <div class="glass-card p-6">
              <h3 class="text-sm font-semibold mb-4" data-i18n="workshop.result.title"></h3>
              ${resultHtml}
            </div>
          </div>

          <!-- 侧栏：Ollama 状态 -->
          <aside class="space-y-6">
            <div class="glass-card p-6">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold" data-i18n="workshop.ollamaStatus"></span>
                <span class="inline-flex items-center gap-2 text-xs">
                  <span class="w-2 h-2 rounded-full bg-${statusColor}-500 ${state.ollamaStatus === 'checking' ? 'animate-pulse' : ''}"></span>
                  <span class="text-${statusColor}-400" data-i18n="${statusKey}"></span>
                </span>
              </div>

              <label class="block text-xs text-white/60 mb-1" data-i18n="workshop.ollamaUrl"></label>
              <input type="text" class="input-field text-sm mb-2" id="ollama-url" value="${escapeHtml(state.ollamaUrl)}" placeholder="http://localhost:11434" />
              <p class="text-xs text-white/40 mb-3" data-i18n="workshop.ollamaUrlHint"></p>

              <label class="block text-xs text-white/60 mb-1" data-i18n="workshop.ollamaModel"></label>
              <select class="input-field text-sm mb-2" id="ollama-model" ${state.ollamaModels.length === 0 ? 'disabled' : ''}>
                ${modelOptions}
              </select>
              <button class="btn-ghost text-xs w-full text-center" id="ollama-refresh">
                ↻ <span data-i18n="workshop.ollamaRefresh"></span>
              </button>

              <details class="mt-4 text-xs text-white/60">
                <summary class="cursor-pointer text-[#00F0FF]" data-i18n="workshop.ollamaHelp"></summary>
                <p class="mt-2 leading-relaxed" data-i18n="workshop.ollamaHelpDesc"></p>
              </details>
            </div>

            <div class="glass-card p-6">
              <div class="text-xs text-white/60 mb-2" data-i18n="settings.stats.workshopCount"></div>
              <div class="text-3xl font-black gradient-text">${state.workshopCalls}</div>
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderWorkshopResult(result) {
    const wo = result.workOrder;
    const lang = state.lang;
    const woHtml = wo ? `
      <div class="space-y-3 mt-4">
        ${renderWorkOrderRow('subject', wo.subject)}
        ${renderWorkOrderRow('scene', wo.scene)}
        ${renderWorkOrderRow('action', wo.action)}
        ${renderWorkOrderRow('camera', wo.camera)}
        ${renderWorkOrderRow('style', wo.style)}
        ${renderWorkOrderRow('constraints', wo.constraints)}
      </div>
    ` : '';

    return `
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-white/60" data-i18n="workshop.result.fullPrompt"></span>
          <button class="text-xs text-[#00F0FF] hover:underline" data-copy-text="${encodeURIComponent(result.fullPrompt)}">
            <span data-i18n="workshop.result.copyPrompt"></span>
          </button>
        </div>
        <div class="bg-black/30 rounded-lg p-4 text-sm text-white/90 leading-relaxed whitespace-pre-wrap">${escapeHtml(result.fullPrompt)}</div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-white/60" data-i18n="workshop.result.workOrder"></span>
          <button class="text-xs text-[#00F0FF] hover:underline" data-copy-text="${encodeURIComponent(window.WorkOrder.workOrderToText(wo, lang))}">
            <span data-i18n="workshop.result.copyWorkOrder"></span>
          </button>
        </div>
        ${woHtml}
      </div>
    `;
  }

  function renderWorkOrderRow(key, value) {
    return `
      <div class="flex gap-3">
        <div class="w-20 flex-shrink-0 text-xs text-[#00F0FF] font-semibold pt-0.5" data-i18n="workshop.result.${key}"></div>
        <div class="flex-1 text-sm text-white/80">${escapeHtml(value)}</div>
      </div>
    `;
  }

  // ===== 画廊 =====
  async function loadGallery() {
    state.galleryLoading = true;
    try {
      const items = await window.GalleryDB.getAllMeta();
      state.galleryItems = items.sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.error('[Gallery] load failed:', e);
      state.galleryItems = [];
    } finally {
      state.galleryLoading = false;
    }
  }

  function renderGallery() {
    const items = state.galleryItems || [];
    const filtered = items.filter((it) => {
      if (state.galleryFilter !== 'all' && it.style !== state.galleryFilter) return false;
      if (state.gallerySearch) {
        const q = state.gallerySearch.toLowerCase();
        const text = `${it.title || ''} ${it.description || ''} ${it.prompt || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      return state.gallerySort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    });

    const totalDuration = items.reduce((s, it) => s + (it.duration || 0), 0);
    const totalSize = items.reduce((s, it) => s + (it.size || 0), 0);
    const styleSet = new Set(items.map((it) => it.style).filter(Boolean));

    const stats = [
      { num: items.length, key: 'gallery.statTotal' },
      { num: formatDuration(totalDuration), key: 'gallery.statDuration' },
      { num: formatSize(totalSize), key: 'gallery.statStorage' },
      { num: styleSet.size, key: 'gallery.statStyles' },
    ];

    const styleFilters = ['all', 'cinematic', 'cyberpunk', 'ink', 'anime', 'realistic', 'fantasy', 'watercolor'].map((s) => {
      const label = s === 'all' ? window.i18n.t('gallery.filterAll') : window.i18n.t(`workshop.style.${s}`);
      return `<button class="capsule-btn ${state.galleryFilter === s ? 'active' : ''}" data-gallery-filter="${s}">${label}</button>`;
    }).join('');

    const cards = sorted.length ? sorted.map((it) => renderGalleryCard(it)).join('') : '';

    return `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-black mb-2" data-i18n="gallery.title"></h1>
            <p class="text-white/60" data-i18n="gallery.subtitle"></p>
          </div>
          <button class="btn-primary" id="gallery-upload-btn">
            <span data-i18n="gallery.uploadBtn"></span> ↑
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          ${stats.map((s) => `
            <div class="glass-card p-4 text-center">
              <div class="text-2xl font-black gradient-text">${s.num}</div>
              <div class="text-xs text-white/60 mt-1" data-i18n="${s.key}"></div>
            </div>
          `).join('')}
        </div>

        <div class="glass-card p-4 mb-6">
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <span class="text-xs text-white/60" data-i18n="gallery.filter"></span>
            <div class="flex flex-wrap gap-2">${styleFilters}</div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <input type="text" class="input-field text-sm flex-1 min-w-[200px]" id="gallery-search" value="${escapeHtml(state.gallerySearch)}" placeholder="" data-i18n-placeholder="gallery.searchPlaceholder" />
            <select class="input-field text-sm w-auto" id="gallery-sort">
              <option value="newest" ${state.gallerySort === 'newest' ? 'selected' : ''} data-i18n="gallery.sortNewest"></option>
              <option value="oldest" ${state.gallerySort === 'oldest' ? 'selected' : ''} data-i18n="gallery.sortOldest"></option>
            </select>
          </div>
        </div>

        ${state.galleryLoading ? `
          <div class="text-center py-12 text-white/40">
            <div class="inline-block w-8 h-8 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full animate-spin mb-3"></div>
            <p data-i18n="common.loading"></p>
          </div>
        ` : sorted.length === 0 ? `
          <div class="glass-card p-12 text-center">
            <div class="text-5xl mb-4">🎬</div>
            <h3 class="text-xl font-bold mb-2" data-i18n="gallery.empty.title"></h3>
            <p class="text-sm text-white/60 mb-6 max-w-md mx-auto" data-i18n="gallery.empty.desc"></p>
            <button class="btn-secondary" data-nav="tutorials" data-i18n="gallery.empty.cta"></button>
          </div>
        ` : `
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${cards}
          </div>
        `}

        <input type="file" id="gallery-file-input" accept="video/mp4,video/webm,video/quicktime" class="hidden" />
      </section>
    `;
  }

  function renderGalleryCard(it) {
    const styleLabel = it.style ? window.i18n.t(`workshop.style.${it.style}`) : '';
    return `
      <div class="task-card overflow-hidden">
        <div class="relative bg-black/40 aspect-video flex items-center justify-center video-card-thumb" data-video-id="${it.id}">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <span class="text-2xl">▶</span>
            </div>
          </div>
          <div class="absolute top-2 right-2 text-xs bg-black/60 px-2 py-0.5 rounded">${formatDuration(it.duration || 0)}</div>
          ${styleLabel ? `<div class="absolute top-2 left-2 text-xs bg-[#00F0FF]/80 text-[#0A1128] px-2 py-0.5 rounded font-semibold">${escapeHtml(styleLabel)}</div>` : ''}
        </div>
        <div class="p-4">
          <h3 class="font-bold text-sm mb-1 truncate">${escapeHtml(it.title || window.i18n.t('gallery.card.untitled'))}</h3>
          <p class="text-xs text-white/40 mb-3">
            ${formatSize(it.size || 0)} · ${formatDate(it.createdAt)}
          </p>
          <div class="flex items-center gap-2 text-xs">
            <button class="btn-ghost text-xs flex-1 text-center" data-card-action="edit" data-id="${it.id}">
              ✎ <span data-i18n="gallery.card.edit"></span>
            </button>
            <button class="btn-ghost text-xs flex-1 text-center" data-card-action="download" data-id="${it.id}">
              ↓ <span data-i18n="gallery.card.download"></span>
            </button>
            <button class="btn-ghost text-xs flex-1 text-center text-red-400 hover:text-red-300" data-card-action="delete" data-id="${it.id}">
              ✕ <span data-i18n="gallery.card.delete"></span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ===== 设置 =====
  function renderSettings() {
    const user = state.user || {};
    const tutorials = window.TUTORIALS || [];
    const completedCount = tutorials.filter((t) => state.tutorialProgress[t.id]).length;
    const galleryCount = state.galleryItems.length;

    return `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-black mb-2" data-i18n="settings.title"></h1>
          <p class="text-white/60" data-i18n="settings.subtitle"></p>
        </div>

        <!-- 个人信息 -->
        <div class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold mb-4" data-i18n="settings.profile.title"></h3>
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-xs text-white/40 mb-1" data-i18n="settings.username"></div>
              <div>${escapeHtml(user.displayName || '访客')}</div>
            </div>
            <div>
              <div class="text-xs text-white/40 mb-1" data-i18n="settings.email"></div>
              <div>${escapeHtml(user.email || '—')}</div>
            </div>
            <div>
              <div class="text-xs text-white/40 mb-1" data-i18n="settings.accountType"></div>
              <div>${user.isGuest ? window.i18n.t('settings.accountTypeGuest') : window.i18n.t('settings.accountTypeUser')}</div>
            </div>
            <div>
              <div class="text-xs text-white/40 mb-1" data-i18n="settings.profile.joinedAt"></div>
              <div>${user.joinedAt ? formatDate(user.joinedAt) : '—'}</div>
            </div>
          </div>
        </div>

        <!-- 统计 -->
        <div class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold mb-4" data-i18n="settings.stats"></h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-3xl font-black gradient-text">${completedCount}/${tutorials.length}</div>
              <div class="text-xs text-white/60 mt-1" data-i18n="settings.stats.tutorialProgress"></div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black gradient-text">${galleryCount}</div>
              <div class="text-xs text-white/60 mt-1" data-i18n="settings.stats.galleryCount"></div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-black gradient-text">${state.workshopCalls}</div>
              <div class="text-xs text-white/60 mt-1" data-i18n="settings.stats.workshopCount"></div>
            </div>
          </div>
        </div>

        <!-- 偏好 -->
        <div class="glass-card p-6 mb-6">
          <h3 class="text-lg font-bold mb-4" data-i18n="settings.preferences.title"></h3>
          <div class="space-y-4">
            <div>
              <div class="text-sm font-semibold mb-1" data-i18n="settings.preferences.ollamaUrl"></div>
              <div class="text-xs text-white/60 mb-2" data-i18n="settings.preferences.ollamaUrlDesc"></div>
              <input type="text" class="input-field text-sm" id="settings-ollama-url" value="${escapeHtml(state.ollamaUrl)}" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold" data-i18n="settings.preferences.language"></div>
                <div class="text-xs text-white/60" data-i18n="settings.preferences.languageDesc"></div>
              </div>
              <div class="lang-toggle">
                <button class="${state.lang === 'zh' ? 'active' : ''}" data-action="set-lang" data-lang="zh">中</button>
                <button class="${state.lang === 'en' ? 'active' : ''}" data-action="set-lang" data-lang="en">EN</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-bold mb-4" data-i18n="settings.dataManagement"></h3>
          <div class="space-y-3">
            <button class="btn-secondary text-sm w-full sm:w-auto" id="settings-export">
              ↓ <span data-i18n="settings.exportGallery"></span>
            </button>
            <p class="text-xs text-white/40" data-i18n="settings.exportGalleryDesc"></p>

            <hr class="border-white/10 my-4" />

            <button class="btn-secondary text-sm w-full sm:w-auto border-red-500/40 text-red-400 hover:bg-red-500/10" id="settings-clear">
              ✕ <span data-i18n="settings.clearLocalBtn"></span>
            </button>
            <p class="text-xs text-white/40" data-i18n="settings.clearLocalDesc"></p>
          </div>
        </div>
      </section>
    `;
  }

  // ===== 视图事件绑定 =====
  function bindViewEvents() {
    const root = document.getElementById('view-root');
    if (!root) return;

    // 教程列表卡片
    root.querySelectorAll('[data-tutorial]').forEach((el) => {
      el.addEventListener('click', () => {
        state.activeTutorialId = el.getAttribute('data-tutorial');
        render();
      });
    });

    root.querySelectorAll('[data-action="back-to-tutorials"]').forEach((el) => {
      el.addEventListener('click', () => {
        state.activeTutorialId = null;
        render();
      });
    });

    root.querySelectorAll('[data-action="go-tutorial"]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tutorial');
        if (id) {
          state.activeTutorialId = id;
          render();
        } else {
          state.activeTutorialId = null;
          render();
        }
      });
    });

    root.querySelectorAll('[data-action="toggle-tutorial-done"]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-tutorial');
        state.tutorialProgress[id] = !state.tutorialProgress[id];
        if (!state.tutorialProgress[id]) delete state.tutorialProgress[id];
        saveState();
        toast(state.tutorialProgress[id] ? window.i18n.t('tutorial.completed') + ' ✓' : '', 'success');
        render();
      });
    });

    // 复制代码
    root.querySelectorAll('[data-copy-code]').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-copy-code'), 10);
        const tutorial = (window.TUTORIALS || []).find((t) => t.id === state.activeTutorialId);
        if (!tutorial) return;
        const content = tutorial[state.lang] || tutorial.zh;
        const step = content.steps[idx];
        if (step && step.content) {
          copyToClipboard(step.content);
          toast(window.i18n.t('common.copied'), 'success');
        }
      });
    });

    // 复制任意文本
    root.querySelectorAll('[data-copy-text]').forEach((el) => {
      el.addEventListener('click', () => {
        const text = decodeURIComponent(el.getAttribute('data-copy-text'));
        copyToClipboard(text);
        toast(window.i18n.t('common.copied'), 'success');
      });
    });

    // ===== 工坊事件 =====
    const ideaInput = root.querySelector('#workshop-idea');
    if (ideaInput) {
      ideaInput.addEventListener('input', (e) => { state.workshopIdea = e.target.value; });
    }
    root.querySelectorAll('[data-camera]').forEach((el) => {
      el.addEventListener('click', () => {
        state.workshopCamera = el.getAttribute('data-camera');
        saveState();
        render();
      });
    });
    root.querySelectorAll('[data-style]').forEach((el) => {
      el.addEventListener('click', () => {
        state.workshopStyle = el.getAttribute('data-style');
        saveState();
        render();
      });
    });
    const durationSlider = root.querySelector('#workshop-duration');
    if (durationSlider) {
      durationSlider.addEventListener('input', (e) => {
        state.workshopDuration = parseInt(e.target.value, 10);
        saveState();
        // 只更新数字显示，不重渲染避免破坏拖拽
        const label = durationSlider.parentElement.querySelector('span.text-\\[\\#00F0FF\\]');
        if (label) label.textContent = state.workshopDuration;
      });
    }
    root.querySelectorAll('[data-example]').forEach((el) => {
      el.addEventListener('click', () => {
        state.workshopIdea = window.i18n.t(`workshop.${el.getAttribute('data-example')}`);
        render();
      });
    });

    const enhanceBtn = root.querySelector('#enhance-btn');
    if (enhanceBtn) enhanceBtn.addEventListener('click', handleEnhance);

    const ollamaUrlInput = root.querySelector('#ollama-url');
    if (ollamaUrlInput) {
      ollamaUrlInput.addEventListener('change', async (e) => {
        const newUrl = window.OllamaClient.setUrl(e.target.value);
        state.ollamaUrl = newUrl;
        await checkOllamaStatus();
        render();
      });
    }
    const ollamaRefresh = root.querySelector('#ollama-refresh');
    if (ollamaRefresh) {
      ollamaRefresh.addEventListener('click', async () => {
        await checkOllamaStatus();
        render();
      });
    }
    const ollamaModelSelect = root.querySelector('#ollama-model');
    if (ollamaModelSelect) {
      ollamaModelSelect.addEventListener('change', (e) => {
        state.ollamaSelectedModel = e.target.value;
      });
    }

    // ===== 画廊事件 =====
    const uploadBtn = root.querySelector('#gallery-upload-btn');
    const fileInput = root.querySelector('#gallery-file-input');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', handleFileUpload);
    }
    // 拖拽上传
    const gallerySection = root.querySelector('section');
    if (gallerySection && state.view === 'gallery') {
      ['dragover', 'dragenter'].forEach((evt) => {
        gallerySection.addEventListener(evt, (e) => {
          e.preventDefault();
          gallerySection.classList.add('drag-active');
        });
      });
      ['dragleave', 'drop'].forEach((evt) => {
        gallerySection.addEventListener(evt, (e) => {
          e.preventDefault();
          gallerySection.classList.remove('drag-active');
        });
      });
      gallerySection.addEventListener('drop', async (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length) await handleFile(files[0]);
      });
    }

    root.querySelectorAll('[data-gallery-filter]').forEach((el) => {
      el.addEventListener('click', () => {
        state.galleryFilter = el.getAttribute('data-gallery-filter');
        render();
      });
    });
    const searchInput = root.querySelector('#gallery-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.gallerySearch = e.target.value;
        // 防抖
        clearTimeout(searchInput._t);
        searchInput._t = setTimeout(() => render(), 300);
      });
    }
    const sortSel = root.querySelector('#gallery-sort');
    if (sortSel) {
      sortSel.addEventListener('change', (e) => {
        state.gallerySort = e.target.value;
        render();
      });
    }

    root.querySelectorAll('[data-card-action]').forEach((el) => {
      el.addEventListener('click', () => handleCardAction(el.getAttribute('data-card-action'), el.getAttribute('data-id')));
    });
    root.querySelectorAll('[data-video-id]').forEach((el) => {
      el.addEventListener('click', () => playVideo(el.getAttribute('data-video-id')));
    });

    // ===== 设置事件 =====
    const setOllamaUrl = root.querySelector('#settings-ollama-url');
    if (setOllamaUrl) {
      setOllamaUrl.addEventListener('change', (e) => {
        state.ollamaUrl = window.OllamaClient.setUrl(e.target.value);
        toast('Ollama URL ✓', 'success');
      });
    }
    const exportBtn = root.querySelector('#settings-export');
    if (exportBtn) exportBtn.addEventListener('click', handleExportGallery);
    const clearBtn = root.querySelector('#settings-clear');
    if (clearBtn) clearBtn.addEventListener('click', handleClearLocal);
  }

  // ===== Ollama 状态检测 =====
  async function checkOllamaStatus() {
    state.ollamaStatus = 'checking';
    try {
      const result = await window.OllamaClient.checkStatus();
      state.ollamaStatus = result.online ? 'online' : 'offline';
      state.ollamaModels = result.models;
      if (result.models.length && !state.ollamaSelectedModel) {
        // 优先选 llama3.2 或 qwen2.5
        const preferred = result.models.find((m) => m.includes('llama3.2')) || result.models[0];
        state.ollamaSelectedModel = preferred;
      }
    } catch (e) {
      state.ollamaStatus = 'offline';
      state.ollamaModels = [];
    }
  }

  // ===== 工坊：增强提示词 =====
  async function handleEnhance() {
    const idea = state.workshopIdea.trim();
    if (!idea) {
      toast(state.lang === 'zh' ? '请输入你的创意想法' : 'Please enter your creative idea', 'error');
      return;
    }
    state.workshopEnhancing = true;
    render();
    try {
      let fullPrompt;
      let usedOllama = false;
      if (state.ollamaStatus === 'online' && state.ollamaSelectedModel) {
        try {
          fullPrompt = await window.OllamaClient.enhanceVideoPrompt(idea, state.ollamaSelectedModel, {
            camera: state.workshopCamera,
            duration: state.workshopDuration,
            style: state.workshopStyle,
          });
          usedOllama = true;
        } catch (e) {
          console.warn('[Workshop] Ollama generate failed, fallback:', e);
          fullPrompt = generateFallbackPrompt(idea);
          toast(window.i18n.t('error.ollamaGenerate'), 'error');
        }
      } else {
        fullPrompt = generateFallbackPrompt(idea);
      }

      // 始终生成结构化工单（用内置规则）
      const workOrder = window.WorkOrder.generateWorkOrder({
        prompt: idea,
        mode: 'text-to-video',
        cameraMovement: state.workshopCamera,
        duration: state.workshopDuration,
        styles: [state.workshopStyle],
        hasImage: false,
      }, state.lang);

      state.workshopResult = { fullPrompt, workOrder };
      state.workshopCalls += 1;
      saveState();
      toast(usedOllama ? '✨ Ollama 增强 ✓' : '✓', 'success');
    } catch (e) {
      console.error('[Workshop] enhance failed:', e);
      toast(window.i18n.t('error.generic'), 'error');
    } finally {
      state.workshopEnhancing = false;
      render();
    }
  }

  // 内置规则增强（无 Ollama 时降级使用）
  function generateFallbackPrompt(idea) {
    const lang = state.lang;
    const styleDesc = {
      cinematic: lang === 'zh' ? 'cinematic color grading, warm tones, shallow depth of field' : 'cinematic color grading, warm tones, shallow depth of field',
      cyberpunk: 'cyberpunk aesthetic, neon glow, high-contrast cool/warm palette',
      ink: 'ink wash style, monochrome, generous negative space',
      anime: 'anime style, vivid colors, flat outlines',
      realistic: 'photorealistic, natural lighting, high detail',
      fantasy: 'fantasy aesthetic, dreamy halation, surreal palette',
      watercolor: 'watercolor texture, soft bleed, paper grain',
    }[state.workshopStyle] || 'cinematic';

    const cameraDesc = {
      push: 'medium shot, slow push-in',
      pull: 'medium close-up, gradual pull-back',
      pan: 'wide shot, horizontal pan',
      tilt: 'medium shot, vertical tilt',
      random: 'multi-angle mixed camera movement',
    }[state.workshopCamera] || 'medium shot';

    if (lang === 'zh') {
      return `${idea}。镜头采用${cameraDesc}，画面风格${styleDesc}。视频时长约 ${state.workshopDuration} 秒，4K 分辨率，24fps，高细节，流畅运动，专业电影质感。`;
    }
    return `${idea}. The camera uses ${cameraDesc}, visual style ${styleDesc}. Video duration approximately ${state.workshopDuration} seconds, 4K resolution, 24fps, high detail, smooth motion, professional cinematography.`;
  }

  // ===== 文件上传 =====
  async function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) await handleFile(file);
    e.target.value = '';
  }

  async function handleFile(file) {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      toast(window.i18n.t('gallery.invalidFormat'), 'error');
      return;
    }
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      toast(window.i18n.t('gallery.fileTooLarge'), 'error');
      return;
    }

    toast(window.i18n.t('gallery.uploading'), 'info');
    try {
      const duration = await getVideoDuration(file);
      const meta = {
        title: file.name.replace(/\.[^.]+$/, ''),
        description: '',
        style: '',
        prompt: '',
        duration,
      };
      const id = await window.GalleryDB.addVideo(meta, file);
      await loadGallery();
      toast(window.i18n.t('gallery.uploadSuccess'), 'success');
      render();
    } catch (e) {
      console.error('[Gallery] upload failed:', e);
      if (e && e.name === 'QuotaExceededError') {
        toast(window.i18n.t('error.dbQuota'), 'error');
      } else {
        toast(window.i18n.t('gallery.uploadFailed'), 'error');
      }
    }
  }

  function getVideoDuration(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration || 0);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      video.src = url;
    });
  }

  // ===== 画廊卡片操作 =====
  async function handleCardAction(action, id) {
    if (action === 'delete') {
      const sure = confirm(window.i18n.t('gallery.card.confirmDelete'));
      if (!sure) return;
      try {
        await window.GalleryDB.deleteVideo(id);
        await loadGallery();
        toast('✓', 'success');
        render();
      } catch (e) {
        toast(window.i18n.t('error.generic'), 'error');
      }
    } else if (action === 'download') {
      try {
        const blob = await window.GalleryDB.getVideoBlob(id);
        if (!blob) { toast(window.i18n.t('error.generic'), 'error'); return; }
        const item = state.galleryItems.find((i) => i.id === id);
        const ext = (item && item.type && item.type.split('/')[1]) || 'mp4';
        const filename = (item && item.title) || 'video';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${ext}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        toast(window.i18n.t('error.generic'), 'error');
      }
    } else if (action === 'edit') {
      openEditModal(id);
    }
  }

  function openEditModal(id) {
    const item = state.galleryItems.find((i) => i.id === id);
    if (!item) return;
    const modalRoot = document.getElementById('modal-root');
    const styleOptions = ['', 'cinematic', 'cyberpunk', 'ink', 'anime', 'realistic', 'fantasy', 'watercolor']
      .map((s) => {
        const label = s === '' ? '—' : window.i18n.t(`workshop.style.${s}`);
        return `<option value="${s}" ${item.style === s ? 'selected' : ''}>${label}</option>`;
      }).join('');

    modalRoot.innerHTML = `
      <div class="modal-overlay" id="edit-overlay">
        <div class="modal-content">
          <h2 class="text-xl font-bold mb-4" data-i18n="gallery.editModal.title"></h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="gallery.editModal.videoTitle"></label>
              <input type="text" class="input-field" id="edit-title" value="${escapeHtml(item.title || '')}" />
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="gallery.editModal.description"></label>
              <textarea class="input-field" id="edit-desc" rows="3">${escapeHtml(item.description || '')}</textarea>
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="gallery.editModal.style"></label>
              <select class="input-field" id="edit-style">${styleOptions}</select>
            </div>
            <div>
              <label class="block text-xs text-white/60 mb-1" data-i18n="gallery.editModal.prompt"></label>
              <textarea class="input-field" id="edit-prompt" rows="4">${escapeHtml(item.prompt || '')}</textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button class="btn-secondary flex-1" id="edit-cancel" data-i18n="common.cancel"></button>
            <button class="btn-primary flex-1" id="edit-save" data-i18n="gallery.editModal.save"></button>
          </div>
        </div>
      </div>
    `;
    window.i18n.applyTranslations(modalRoot);

    modalRoot.querySelector('#edit-cancel').addEventListener('click', () => { modalRoot.innerHTML = ''; });
    modalRoot.querySelector('#edit-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'edit-overlay') modalRoot.innerHTML = '';
    });
    modalRoot.querySelector('#edit-save').addEventListener('click', async () => {
      const patch = {
        title: modalRoot.querySelector('#edit-title').value.trim(),
        description: modalRoot.querySelector('#edit-desc').value.trim(),
        style: modalRoot.querySelector('#edit-style').value,
        prompt: modalRoot.querySelector('#edit-prompt').value.trim(),
      };
      try {
        await window.GalleryDB.updateMeta(id, patch);
        await loadGallery();
        modalRoot.innerHTML = '';
        toast('✓', 'success');
        render();
      } catch (e) {
        toast(window.i18n.t('error.generic'), 'error');
      }
    });
  }

  async function playVideo(id) {
    try {
      const blob = await window.GalleryDB.getVideoBlob(id);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const item = state.galleryItems.find((i) => i.id === id);
      const modalRoot = document.getElementById('modal-root');
      modalRoot.innerHTML = `
        <div class="modal-overlay" id="play-overlay" style="align-items: center;">
          <div class="modal-content" style="max-width: 900px; padding: 16px;">
            <video src="${url}" controls autoplay class="w-full rounded-lg" style="max-height: 80vh;"></video>
            <div class="flex items-center justify-between mt-3 px-2">
              <h3 class="font-bold text-sm truncate">${escapeHtml(item ? item.title : '')}</h3>
              <button class="btn-ghost text-sm" id="play-close" data-i18n="common.close"></button>
            </div>
          </div>
        </div>
      `;
      modalRoot.querySelector('#play-close').addEventListener('click', () => {
        URL.revokeObjectURL(url);
        modalRoot.innerHTML = '';
      });
      modalRoot.querySelector('#play-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'play-overlay') {
          URL.revokeObjectURL(url);
          modalRoot.innerHTML = '';
        }
      });
    } catch (e) {
      toast(window.i18n.t('error.generic'), 'error');
    }
  }

  // ===== 设置：导出 =====
  async function handleExportGallery() {
    try {
      const items = await window.GalleryDB.getAllMeta();
      const exportData = items.map((it) => ({
        id: it.id,
        title: it.title,
        description: it.description,
        style: it.style,
        prompt: it.prompt,
        duration: it.duration,
        size: it.size,
        type: it.type,
        createdAt: it.createdAt,
        createdAtFormatted: new Date(it.createdAt).toISOString(),
      }));
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vzong-gallery-${Date.now()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('✓', 'success');
    } catch (e) {
      toast(window.i18n.t('error.generic'), 'error');
    }
  }

  async function handleClearLocal() {
    const sure = confirm(window.i18n.t('settings.clearLocalConfirm'));
    if (!sure) return;
    try {
      await window.GalleryDB.clearAll();
      localStorage.removeItem('vzong-state-v2');
      localStorage.removeItem('vzong-guest');
      state.tutorialProgress = {};
      state.workshopCalls = 0;
      state.user = null;
      state.galleryItems = [];
      toast('✓', 'success');
      ensureGuest();
      navigate('landing');
    } catch (e) {
      toast(window.i18n.t('error.generic'), 'error');
    }
  }

  // ===== 工具函数 =====
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function formatDuration(sec) {
    if (!sec || sec < 1) return '0s';
    if (sec < 60) return `${Math.round(sec)}s`;
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}m ${s}s`;
  }

  function formatSize(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  // ===== 启动 =====
  async function boot() {
    loadState();
    ensureGuest();

    // 隐藏 boot loader
    const loader = document.getElementById('boot-loader');
    if (loader) {
      loader.style.transition = 'opacity 0.3s';
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }

    render();

    // 注册 Firebase 登录状态监听
    setupAuthObserver();

    // 异步检测 Ollama 状态（不阻塞首屏）
    checkOllamaStatus().then(() => {
      if (state.view === 'workshop') render();
    });

    // 异步加载画廊（仅 gallery 视图需要）
    if (state.view === 'gallery') {
      await loadGallery();
      render();
    }

    // 监听语言切换
    window.addEventListener('lang-change', () => {
      state.lang = window.i18n.getLang();
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
