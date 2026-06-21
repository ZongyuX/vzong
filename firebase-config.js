// vzong · AI视频工坊 - Firebase 配置
// 用户提供的真实 Firebase 项目配置

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHh6hHsHo7niP_Rztnb_ZyROgPZxYJ2q8",
  authDomain: "zongv-65dec.firebaseapp.com",
  projectId: "zongv-65dec",
  storageBucket: "zongv-65dec.firebasestorage.app",
  messagingSenderId: "549323863140",
  appId: "1:549323863140:web:1904ffa5d1c003d8da5b71",
  measurementId: "G-LPB2Q0N1L1"
};

// Initialize Firebase (with safe fallback if scripts not yet loaded)
let fbApp = null;
let fbAuth = null;
let fbDb = null;
let fbConfigured = false;

function initFirebase() {
  if (typeof firebase === 'undefined' || !firebase.initializeApp) {
    console.warn('[Firebase] SDK 尚未加载，将使用本地访客模式');
    return false;
  }
  try {
    fbApp = firebase.initializeApp(firebaseConfig);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    fbConfigured = true;
    console.log('[Firebase] 初始化成功，项目:', firebaseConfig.projectId);
    return true;
  } catch (e) {
    console.warn('[Firebase] 初始化失败，降级到本地模式：', e);
    return false;
  }
}

// 启动时尝试初始化（如果 SDK 已加载）
// 否则在 DOMContentLoaded 后再试
if (typeof firebase !== 'undefined' && firebase.initializeApp) {
  initFirebase();
} else {
  window.addEventListener('load', () => {
    // 等待所有 async/cdn 脚本加载完毕
    setTimeout(initFirebase, 200);
  });
}

window.fbConfig = {
  config: firebaseConfig,
  get app() { return fbApp; },
  get auth() { return fbAuth; },
  get db() { return fbDb; },
  get isConfigured() { return fbConfigured; },
  init: initFirebase,
};
