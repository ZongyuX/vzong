// vzong · AI视频导航 - 基于 IndexedDB 的视频本地存储
// 用于个人画廊的视频文件 + 元数据持久化
// localStorage 限额 5MB 远远不够视频，必须用 IndexedDB（通常 1GB+）

const GalleryDB = (function () {
  'use strict';

  const DB_NAME = 'vzong-gallery';
  const DB_VERSION = 1;
  const STORE_VIDEOS = 'videos';       // 视频文件 Blob
  const STORE_META = 'metadata';        // 元数据（不含 Blob）

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
          db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          const store = db.createObjectStore(STORE_META, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('style', 'style', { unique: false });
        }
      };
    });
    return dbPromise;
  }

  // 添加视频（含 Blob 和元数据）
  async function addVideo(meta, blob) {
    const db = await openDB();
    const id = meta.id || ('v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
    const record = {
      id,
      blob,
      size: blob.size,
      type: blob.type,
      createdAt: Date.now(),
      ...meta,
      id, // 强制覆盖
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VIDEOS, STORE_META], 'readwrite');
      tx.objectStore(STORE_VIDEOS).put(record);
      const metaRecord = { ...record };
      delete metaRecord.blob;  // 元数据中不存 Blob，节省读取开销
      tx.objectStore(STORE_META).put(metaRecord);
      tx.oncomplete = () => resolve(id);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 获取单个视频 Blob（用于播放/下载）
  async function getVideoBlob(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VIDEOS], 'readonly');
      const req = tx.objectStore(STORE_VIDEOS).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  }

  // 获取所有视频元数据（不含 Blob）
  async function getAllMeta() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_META], 'readonly');
      const req = tx.objectStore(STORE_META).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // 更新元数据（标题、描述、风格、提示词）
  async function updateMeta(id, patch) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VIDEOS, STORE_META], 'readwrite');
      const storeV = tx.objectStore(STORE_VIDEOS);
      const storeM = tx.objectStore(STORE_META);
      const getReq = storeV.get(id);
      getReq.onsuccess = () => {
        const video = getReq.result;
        if (!video) { reject(new Error('Video not found')); return; }
        const updated = { ...video, ...patch, id, updatedAt: Date.now() };
        storeV.put(updated);
        const metaRecord = { ...updated };
        delete metaRecord.blob;
        storeM.put(metaRecord);
      };
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 删除视频
  async function deleteVideo(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VIDEOS, STORE_META], 'readwrite');
      tx.objectStore(STORE_VIDEOS).delete(id);
      tx.objectStore(STORE_META).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 清空所有视频
  async function clearAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_VIDEOS, STORE_META], 'readwrite');
      tx.objectStore(STORE_VIDEOS).clear();
      tx.objectStore(STORE_META).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // 估算已使用空间（通过 navigator.storage.estimate，浏览器支持时）
  async function estimateUsage() {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        return {
          usage: est.usage || 0,
          quota: est.quota || 0,
        };
      } catch (e) {
        return { usage: 0, quota: 0 };
      }
    }
    return { usage: 0, quota: 0 };
  }

  return {
    addVideo,
    getVideoBlob,
    getAllMeta,
    updateMeta,
    deleteVideo,
    clearAll,
    estimateUsage,
  };
})();

window.GalleryDB = GalleryDB;
