// vzong · AI视频导航 - Ollama API 客户端
// 与本地 Ollama 服务通信：状态检测、模型列表、提示词生成
// 文档：https://github.com/ollama/ollama/blob/main/docs/api.md

const OllamaClient = (function () {
  'use strict';

  function getUrl() {
    return (localStorage.getItem('vzong-ollama-url') || 'http://localhost:11434').replace(/\/+$/, '');
  }

  function setUrl(url) {
    const cleaned = (url || 'http://localhost:11434').trim().replace(/\/+$/, '');
    localStorage.setItem('vzong-ollama-url', cleaned);
    return cleaned;
  }

  // 检测 Ollama 是否在线（5 秒超时）
  async function checkStatus() {
    const url = getUrl();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(`${url}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!resp.ok) return { online: false, models: [] };
      const data = await resp.json();
      const models = (data.models || []).map((m) => m.name);
      return { online: true, models };
    } catch (e) {
      return { online: false, models: [] };
    }
  }

  // 调用 Ollama 生成（流式输出可选，这里用非流式简化）
  async function generate(prompt, model, options) {
    const url = getUrl();
    options = options || {};
    const body = {
      model: model || 'llama3.2',
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        num_predict: options.numPredict || 800,
        stop: options.stop || undefined,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 分钟超时

    try {
      const resp = await fetch(`${url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }
      const data = await resp.json();
      return data.response || '';
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error('Ollama 请求超时（120秒），请检查模型是否过大或重试');
      }
      throw e;
    }
  }

  // ===== 视频提示词增强专用 prompt 模板 =====

  const SYSTEM_PROMPT_ZH = `你是一个专业的 AI 视频提示词工程师，精通 Sora、Runway、LTX、Wan2.5 等视频生成模型。

你的任务：把用户的简短中文想法，扩展为一段高质量、可直接用于视频生成的英文提示词。

输出要求（严格遵守）：
1. 输出必须是纯文本，不要包含任何代码块标记、JSON 或额外说明
2. 输出一段连贯的英文描述，长度 80-150 词
3. 必须包含以下要素（融合在自然段落中，不要分点）：
   - 主体（Subject）：人物/物体的具体外貌、衣着
   - 场景（Scene）：环境、光照、氛围
   - 动作（Action）：具体的动作描述、节奏
   - 镜头（Camera）：景别、运镜方式
   - 风格（Style）：色调、视觉风格
4. 结尾附加技术约束：分辨率、帧率、画质关键词
5. 全部使用英文输出（即使输入是中文）

示例输入：一只柴犬在草地上追蝴蝶，阳光明媚
示例输出：A golden Shiba Inu with a fluffy coat runs joyfully across a lush green meadow dotted with wildflowers, chasing a flurry of yellow butterflies that dance just out of reach. The camera follows in a medium tracking shot with a slow push-in, keeping the dog centered as it darts and leaps. Warm afternoon sunlight bathes the scene with soft golden-hour tones, casting long gentle shadows. The depth of field is shallow, blurring the distant tree line while keeping fur and butterfly wings crisp. Cinematic color grading, 4K resolution, 24fps, high detail, smooth motion, professional cinematography.`;

  const SYSTEM_PROMPT_EN = `You are a professional AI video prompt engineer, expert in Sora, Runway, LTX, Wan2.5 and similar video generation models.

Your task: expand the user's short idea into a high-quality English prompt ready for video generation.

Output requirements (strictly follow):
1. Output must be plain text — no code blocks, JSON, or extra commentary
2. Output a single coherent English paragraph, 80-150 words
3. Must include these elements (woven into the paragraph, NOT bulleted):
   - Subject: specific appearance, clothing
   - Scene: environment, lighting, atmosphere
   - Action: specific motion description, rhythm
   - Camera: shot type, camera movement
   - Style: color palette, visual style
4. End with technical constraints: resolution, fps, quality keywords
5. Always output in English

Example input: A Shiba Inu chasing butterflies on a sunny meadow
Example output: A golden Shiba Inu with a fluffy coat runs joyfully across a lush green meadow dotted with wildflowers, chasing a flurry of yellow butterflies that dance just out of reach. The camera follows in a medium tracking shot with a slow push-in, keeping the dog centered as it darts and leaps. Warm afternoon sunlight bathes the scene with soft golden-hour tones, casting long gentle shadows. The depth of field is shallow, blurring the distant tree line while keeping fur and butterfly wings crisp. Cinematic color grading, 4K resolution, 24fps, high detail, smooth motion, professional cinematography.`;

  function buildEnhancePrompt(idea, options) {
    options = options || {};
    const lang = window.i18n ? window.i18n.getLang() : 'zh';
    const system = lang === 'zh' ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN;

    const userParts = [];
    userParts.push(`Idea: ${idea}`);
    if (options.camera) userParts.push(`Camera: ${options.camera}`);
    if (options.duration) userParts.push(`Duration: ${options.duration} seconds`);
    if (options.style) userParts.push(`Style: ${options.style}`);

    const fullPrompt = `${system}\n\n---\n\n${userParts.join('\n')}\n\nEnhanced prompt:`;
    return fullPrompt;
  }

  // 调用 Ollama 增强视频提示词
  async function enhanceVideoPrompt(idea, model, options) {
    const prompt = buildEnhancePrompt(idea, options);
    const result = await generate(prompt, model, {
      temperature: 0.7,
      numPredict: 600,
    });
    return result.trim();
  }

  return {
    getUrl,
    setUrl,
    checkStatus,
    generate,
    enhanceVideoPrompt,
    buildEnhancePrompt,
  };
})();

window.OllamaClient = OllamaClient;
