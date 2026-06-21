// vzong · AI视频工坊 - Sora 2 结构化工单生成器
// 参考 Sora 2 / Wan2.5 / Veo3 的 Prompt 工程规范，
// 将用户原始指令扩展为主体、场景、动作、镜头、风格、约束六模块结构化工单

const STYLE_DESCRIPTIONS = {
  zh: {
    cyberpunk: "赛博朋克，霓虹光感，高对比冷暖色调",
    cinematic: "电影感，暖色调，浅景深",
    ink: "水墨风，留白意境，黑白主调",
    anime: "动漫风，鲜艳色彩，扁平描边",
    realistic: "写实风，自然光影，高细节",
    fantasy: "奇幻风，梦幻光晕，超现实色彩",
    watercolor: "水彩风，柔和晕染，纸张质感",
  },
  en: {
    cyberpunk: "cyberpunk, neon glow, high-contrast cool/warm palette",
    cinematic: "cinematic, warm tones, shallow depth of field",
    ink: "ink wash, generous negative space, monochrome",
    anime: "anime, vivid colors, flat outlines",
    realistic: "realistic, natural lighting, high detail",
    fantasy: "fantasy, dreamy halation, surreal palette",
    watercolor: "watercolor, soft bleed, paper texture",
  },
};

const CAMERA_DESCRIPTIONS = {
  zh: {
    push: "中景，缓慢推进，突出主体情绪",
    pull: "中近景，逐渐拉远，展现场景规模",
    pan: "全景，水平摇摄，呈现环境氛围",
    tilt: "中景，垂直移动，强化空间层次",
    random: "多视角混合运镜，节奏富有变化",
  },
  en: {
    push: "medium shot, slow push-in, emphasizes subject emotion",
    pull: "medium close-up, gradual pull-back, reveals scale",
    pan: "wide shot, horizontal pan, establishes atmosphere",
    tilt: "medium shot, vertical tilt, reinforces spatial depth",
    random: "multi-angle mixed camera, varied rhythm",
  },
};

// 中英文关键词 → 主体推断规则
const SUBJECT_RULES_ZH = [
  { keywords: ["人物", "人", "女孩", "男孩", "男人", "女人", "她", "他"], subject: "一位画面中的主要人物" },
  { keywords: ["小狗", "狗", "宠物", "柴犬", "金毛"], subject: "画面中的小狗" },
  { keywords: ["猫", "小猫", "猫咪"], subject: "画面中的小猫" },
  { keywords: ["鸟", "蝴蝶", "动物"], subject: "画面中的动物主体" },
  { keywords: ["风景", "山", "海", "天空", "城市"], subject: "画面中的核心景观" },
];

const SUBJECT_RULES_EN = [
  { keywords: ["person", "people", "man", "woman", "girl", "boy", "she", "he"], subject: "the main person in the image" },
  { keywords: ["puppy", "dog", "pet"], subject: "the puppy in the image" },
  { keywords: ["cat", "kitten"], subject: "the cat in the image" },
  { keywords: ["bird", "butterfly", "animal"], subject: "the animal in the image" },
  { keywords: ["landscape", "mountain", "sea", "sky", "city"], subject: "the core landscape in the image" },
];

const ACTION_RULES_ZH = [
  { keywords: ["跳舞", "舞"], action: "随着音乐节奏自然律动，肢体舒展，表情愉悦" },
  { keywords: ["追逐", "追"], action: "朝着目标轻快奔跑，眼神专注，姿态富有活力" },
  { keywords: ["演唱", "唱歌", "唱"], action: "开口歌唱，唇形与节奏同步，表情投入" },
  { keywords: ["微笑", "笑"], action: "嘴角缓缓上扬，露出温暖的笑容" },
  { keywords: ["挥手", "招手"], action: "抬起手臂自然挥动，姿态友善" },
  { keywords: ["转头", "回头"], action: "缓缓转头回望，目光投向镜头方向" },
  { keywords: ["走路", "走", "奔跑", "跑"], action: "以自然步伐移动，重心稳定，节奏流畅" },
];

const ACTION_RULES_EN = [
  { keywords: ["dance", "dancing"], action: "sways naturally to musical rhythm, limbs extended, joyful expression" },
  { keywords: ["chase", "pursue"], action: "runs briskly toward the target, focused gaze, energetic posture" },
  { keywords: ["sing"], action: "opens mouth to sing, lip-synced with rhythm, engaged expression" },
  { keywords: ["smile", "laugh"], action: "corners of the mouth rise slowly, revealing a warm smile" },
  { keywords: ["wave"], action: "raises arm and waves naturally, friendly gesture" },
  { keywords: ["turn", "look back"], action: "slowly turns head to look back, gaze toward the camera" },
  { keywords: ["walk", "run"], action: "moves with natural gait, stable center of gravity, smooth rhythm" },
];

function detectSubject(prompt, lang, hasImage) {
  if (!prompt) {
    return lang === 'zh'
      ? (hasImage ? "画面中的核心主体" : "一位年轻的女性创作者")
      : (hasImage ? "the core subject in the image" : "a young female creator");
  }
  const rules = lang === 'zh' ? SUBJECT_RULES_ZH : SUBJECT_RULES_EN;
  const lower = prompt.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return rule.subject;
    }
  }
  return lang === 'zh'
    ? (hasImage ? "画面中的主要元素" : "用户描述的主体")
    : (hasImage ? "the main element in the image" : "the subject described by the user");
}

function detectAction(prompt, lang) {
  if (!prompt) {
    return lang === 'zh'
      ? "保持自然呼吸节奏，眼神与镜头互动，姿态放松"
      : "maintains natural breathing rhythm, interacts with the camera through gaze, relaxed posture";
  }
  const rules = lang === 'zh' ? ACTION_RULES_ZH : ACTION_RULES_EN;
  const lower = prompt.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return rule.action;
    }
  }
  return lang === 'zh'
    ? "根据指令进行自然的动作演绎，节奏平稳，情绪到位"
    : "performs natural action interpretation according to the instruction, steady rhythm, on-point emotion";
}

function detectScene(prompt, lang) {
  if (!prompt) {
    return lang === 'zh'
      ? "温暖柔和的室内环境，自然光从侧窗洒入，氛围宁静"
      : "warm and soft indoor environment, natural light from a side window, serene atmosphere";
  }
  const lower = prompt.toLowerCase();
  if (lang === 'zh') {
    if (lower.includes("草地") || lower.includes("草原") || lower.includes("户外"))
      return "阳光明媚的户外草地，远景有树木与蓝天";
    if (lower.includes("海") || lower.includes("沙滩"))
      return "金色沙滩与碧蓝海面，阳光在海面跳跃";
    if (lower.includes("城市") || lower.includes("街"))
      return "繁华都市夜景，霓虹灯光闪烁，行人穿梭";
    if (lower.includes("室内") || lower.includes("房间"))
      return "温暖柔和的室内环境，自然光从侧窗洒入";
    if (lower.includes("雪") || lower.includes("冬"))
      return "雪覆盖的冬日林间，空气清冷，光斑跳跃";
  } else {
    if (lower.includes("meadow") || lower.includes("grass") || lower.includes("outdoor"))
      return "sunny outdoor meadow, trees and blue sky in the background";
    if (lower.includes("sea") || lower.includes("beach"))
      return "golden beach and turquoise sea, sunlight dancing on the water";
    if (lower.includes("city") || lower.includes("street"))
      return "bustling city night scene, neon lights flashing, pedestrians passing by";
    if (lower.includes("indoor") || lower.includes("room"))
      return "warm and soft indoor environment, natural light from a side window";
    if (lower.includes("snow") || lower.includes("winter"))
      return "snow-covered winter forest, crisp air, light dancing through trees";
  }
  return lang === 'zh'
    ? "与主体气质契合的场景，光影柔和富有层次"
    : "a scene matching the subject's vibe, soft light with depth";
}

/**
 * 生成 Sora 2 结构化工单
 * @param {Object} params
 * @param {string} params.prompt - 用户指令
 * @param {string} params.mode - 'text-to-video' | 'image-to-video'
 * @param {string} params.cameraMovement - 'push'|'pull'|'pan'|'tilt'|'random'
 * @param {number} params.duration - 5-15 秒
 * @param {string[]} params.styles - 风格数组
 * @param {boolean} params.hasImage - 是否上传了图片
 * @param {string} lang - 'zh' | 'en'
 */
function generateWorkOrder(params, lang) {
  lang = lang || (window.i18n ? window.i18n.getLang() : 'zh');
  const { prompt, mode, cameraMovement, duration, styles, hasImage } = params;
  const primaryStyle = (styles && styles[0]) || 'cinematic';
  const safeDuration = Math.max(5, Math.min(15, duration || 5));

  const subject = detectSubject(prompt, lang, hasImage);
  const scene = detectScene(prompt, lang);
  const action = detectAction(prompt, lang);
  const camera = (CAMERA_DESCRIPTIONS[lang] || CAMERA_DESCRIPTIONS.zh)[cameraMovement || 'push'];
  const styleParts = (styles && styles.length)
    ? styles.map((s) => (STYLE_DESCRIPTIONS[lang] || STYLE_DESCRIPTIONS.zh)[s]).filter(Boolean)
    : [(STYLE_DESCRIPTIONS[lang] || STYLE_DESCRIPTIONS.zh)[primaryStyle]];
  const style = styleParts.join('；') || (STYLE_DESCRIPTIONS[lang] || STYLE_DESCRIPTIONS.zh)[primaryStyle];

  const constraints = lang === 'zh'
    ? `视频时长 ${safeDuration} 秒；保持主体外观与服装一致；画面流畅无跳帧；分辨率 1080p；避免出现额外文字水印`
    : `video duration ${safeDuration} seconds; maintain subject appearance and outfit consistency; smooth frames without stutter; 1080p resolution; avoid additional text watermarks`;

  return {
    subject,
    scene,
    action,
    camera,
    style,
    constraints,
  };
}

/** 将工单转为可复制的完整文本 */
function workOrderToText(wo, lang) {
  lang = lang || (window.i18n ? window.i18n.getLang() : 'zh');
  if (lang === 'zh') {
    return [
      `【主体】${wo.subject}`,
      `【场景】${wo.scene}`,
      `【动作】${wo.action}`,
      `【镜头】${wo.camera}`,
      `【风格】${wo.style}`,
      `【约束】${wo.constraints}`,
    ].join('\n');
  }
  return [
    `[Subject] ${wo.subject}`,
    `[Scene] ${wo.scene}`,
    `[Action] ${wo.action}`,
    `[Camera] ${wo.camera}`,
    `[Style] ${wo.style}`,
    `[Constraints] ${wo.constraints}`,
  ].join('\n');
}

window.WorkOrder = { generateWorkOrder, workOrderToText };
