// 数据层：所有分类和链接都作为一个 JSON 对象存放在 KV 的 "db" 这个 key 下面。
// 数据量小（个人导航站），用单一 key 存取足够简单可靠。

const DB_KEY = 'db';

const DEFAULT_DB = {
  categories: [
    { id: 'c1', name: '常用工具', color: '#2f7bf6', order: 1 },
    { id: 'c2', name: '社交媒体', color: '#ff6b6b', order: 2 },
    { id: 'c3', name: '新闻资讯', color: '#f6a623', order: 3 },
    { id: 'c4', name: '学习教育', color: '#20c997', order: 4 },
    { id: 'c5', name: '影音娱乐', color: '#a855f7', order: 5 },
    { id: 'c6', name: '购物电商', color: '#ff8fab', order: 6 },
    { id: 'c7', name: '开发工具', color: '#1f2937', order: 7 },
    { id: 'c8', name: 'AI 工具', color: '#0ea5e9', order: 8 },
  ],
  links: [
    { id: 'l1', categoryId: 'c1', title: '百度', url: 'https://www.baidu.com', desc: '综合搜索引擎', order: 1 },
    { id: 'l2', categoryId: 'c1', title: '腾讯文档', url: 'https://docs.qq.com', desc: '在线协作文档', order: 2 },
    { id: 'l3', categoryId: 'c1', title: '有道翻译', url: 'https://fanyi.youdao.com', desc: '在线翻译工具', order: 3 },
    { id: 'l4', categoryId: 'c2', title: '微博', url: 'https://weibo.com', desc: '社交媒体平台', order: 1 },
    { id: 'l5', categoryId: 'c2', title: '知乎', url: 'https://www.zhihu.com', desc: '问答社区', order: 2 },
    { id: 'l6', categoryId: 'c3', title: '澎湃新闻', url: 'https://www.thepaper.cn', desc: '时政新闻资讯', order: 1 },
    { id: 'l7', categoryId: 'c4', title: '中国大学MOOC', url: 'https://www.icourse163.org', desc: '在线课程学习平台', order: 1 },
    { id: 'l8', categoryId: 'c5', title: '哔哩哔哩', url: 'https://www.bilibili.com', desc: '视频弹幕网站', order: 1 },
    { id: 'l9', categoryId: 'c6', title: '淘宝', url: 'https://www.taobao.com', desc: '网络购物平台', order: 1 },
    { id: 'l10', categoryId: 'c7', title: 'GitHub', url: 'https://github.com', desc: '代码托管平台', order: 1 },
    { id: 'l11', categoryId: 'c7', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: 'Web开发文档', order: 2 },
    { id: 'l12', categoryId: 'c8', title: 'Claude', url: 'https://claude.ai', desc: 'AI 助手', order: 1 },
  ],
};

function genId(prefix) {
  return prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
}

async function readDb(env) {
  const raw = await env.NAV_DB.get(DB_KEY);
  if (!raw) {
    await env.NAV_DB.put(DB_KEY, JSON.stringify(DEFAULT_DB));
    return structuredClone(DEFAULT_DB);
  }
  return JSON.parse(raw);
}

async function writeDb(env, db) {
  await env.NAV_DB.put(DB_KEY, JSON.stringify(db));
}

// ---------- Categories ----------
async function getCategories(env) {
  const db = await readDb(env);
  return db.categories.sort((a, b) => a.order - b.order);
}

async function getGrouped(env) {
  const db = await readDb(env);
  const categories = [...db.categories].sort((a, b) => a.order - b.order);
  const links = [...db.links].sort((a, b) => a.order - b.order);
  return categories.map((cat) => ({
    ...cat,
    links: links.filter((l) => l.categoryId === cat.id),
  }));
}

async function addCategory(env, { name, color }) {
  const db = await readDb(env);
  const maxOrder = db.categories.reduce((m, c) => Math.max(m, c.order || 0), 0);
  const cat = { id: genId('c'), name, color: color || '#2f7bf6', order: maxOrder + 1 };
  db.categories.push(cat);
  await writeDb(env, db);
  return cat;
}

async function updateCategory(env, id, { name, color }) {
  const db = await readDb(env);
  const cat = db.categories.find((c) => c.id === id);
  if (!cat) return null;
  if (name !== undefined) cat.name = name;
  if (color !== undefined) cat.color = color;
  await writeDb(env, db);
  return cat;
}

async function deleteCategory(env, id) {
  const db = await readDb(env);
  db.categories = db.categories.filter((c) => c.id !== id);
  db.links = db.links.filter((l) => l.categoryId !== id);
  await writeDb(env, db);
}

async function moveCategory(env, id, direction) {
  const db = await readDb(env);
  const sorted = db.categories.sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sorted.length) return;
  const tmp = sorted[idx].order;
  sorted[idx].order = sorted[swapIdx].order;
  sorted[swapIdx].order = tmp;
  await writeDb(env, db);
}

// ---------- Links ----------
async function addLink(env, { categoryId, title, url, desc }) {
  const db = await readDb(env);
  const siblings = db.links.filter((l) => l.categoryId === categoryId);
  const maxOrder = siblings.reduce((m, l) => Math.max(m, l.order || 0), 0);
  const link = { id: genId('l'), categoryId, title, url, desc: desc || '', order: maxOrder + 1 };
  db.links.push(link);
  await writeDb(env, db);
  return link;
}

async function updateLink(env, id, { categoryId, title, url, desc }) {
  const db = await readDb(env);
  const link = db.links.find((l) => l.id === id);
  if (!link) return null;
  if (categoryId !== undefined) link.categoryId = categoryId;
  if (title !== undefined) link.title = title;
  if (url !== undefined) link.url = url;
  if (desc !== undefined) link.desc = desc;
  await writeDb(env, db);
  return link;
}

async function deleteLink(env, id) {
  const db = await readDb(env);
  db.links = db.links.filter((l) => l.id !== id);
  await writeDb(env, db);
}

async function moveLink(env, id, direction) {
  const db = await readDb(env);
  const link = db.links.find((l) => l.id === id);
  if (!link) return;
  const siblings = db.links.filter((l) => l.categoryId === link.categoryId).sort((a, b) => a.order - b.order);
  const idx = siblings.findIndex((l) => l.id === id);
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return;
  const tmp = siblings[idx].order;
  siblings[idx].order = siblings[swapIdx].order;
  siblings[swapIdx].order = tmp;
  await writeDb(env, db);
}

export {
  getCategories, getGrouped, addCategory, updateCategory, deleteCategory, moveCategory,
  addLink, updateLink, deleteLink, moveLink,
};
