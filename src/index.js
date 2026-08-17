import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { getGrouped, getCategories, addCategory, updateCategory, deleteCategory, moveCategory, addLink, updateLink, deleteLink, moveLink } from './store.js';
import { COOKIE_NAME, TTL_SECONDS, createSessionCookieValue, verifySessionCookieValue } from './auth.js';
import { renderIndex, renderLogin, renderDashboard } from './templates.js';

const app = new Hono();

function normalizeUrl(url) {
  if (!url) return url;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getSecret(env) {
  // 本地开发时若没配置 SESSION_SECRET，用一个固定的开发用密钥兜底
  return env.SESSION_SECRET || 'dev-only-insecure-secret-change-me';
}

function getAdminPassword(env) {
  return env.ADMIN_PASSWORD || 'admin123';
}

async function requireAuth(c, next) {
  const cookieValue = getCookie(c, COOKIE_NAME);
  const ok = await verifySessionCookieValue(getSecret(c.env), cookieValue);
  if (!ok) return c.redirect('/admin/login');
  await next();
}

// ---------------- 前台 ----------------
app.get('/', async (c) => {
  const grouped = await getGrouped(c.env);
  return c.html(renderIndex(grouped));
});

// ---------------- 登录 / 登出 ----------------
app.get('/admin/login', async (c) => {
  const cookieValue = getCookie(c, COOKIE_NAME);
  const ok = await verifySessionCookieValue(getSecret(c.env), cookieValue);
  if (ok) return c.redirect('/admin');
  return c.html(renderLogin(null));
});

app.post('/admin/login', async (c) => {
  const body = await c.req.parseBody();
  const password = body.password;
  if (password === getAdminPassword(c.env)) {
    const value = await createSessionCookieValue(getSecret(c.env));
    setCookie(c, COOKIE_NAME, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: TTL_SECONDS,
    });
    return c.redirect('/admin');
  }
  return c.html(renderLogin('密码错误，请重试'));
});

app.post('/admin/logout', async (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
  return c.redirect('/admin/login');
});

// ---------------- 后台管理 ----------------
app.get('/admin', requireAuth, async (c) => {
  const grouped = await getGrouped(c.env);
  const categories = await getCategories(c.env);
  return c.html(renderDashboard(grouped, categories));
});

// 分类 CRUD
app.post('/admin/categories', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  if (body.name && String(body.name).trim()) {
    await addCategory(c.env, { name: String(body.name).trim(), color: body.color });
  }
  return c.redirect('/admin');
});

app.post('/admin/categories/:id/update', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  await updateCategory(c.env, c.req.param('id'), { name: body.name, color: body.color });
  return c.redirect('/admin');
});

app.post('/admin/categories/:id/delete', requireAuth, async (c) => {
  await deleteCategory(c.env, c.req.param('id'));
  return c.redirect('/admin');
});

app.post('/admin/categories/:id/move', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  await moveCategory(c.env, c.req.param('id'), body.direction);
  return c.redirect('/admin');
});

// 链接 CRUD
app.post('/admin/links', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  if (body.categoryId && body.title && body.url) {
    await addLink(c.env, {
      categoryId: body.categoryId,
      title: String(body.title).trim(),
      url: normalizeUrl(String(body.url)),
      desc: String(body.desc || '').trim(),
    });
  }
  return c.redirect('/admin');
});

app.post('/admin/links/:id/update', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  await updateLink(c.env, c.req.param('id'), {
    categoryId: body.categoryId,
    title: body.title,
    url: body.url ? normalizeUrl(String(body.url)) : undefined,
    desc: body.desc,
  });
  return c.redirect('/admin');
});

app.post('/admin/links/:id/delete', requireAuth, async (c) => {
  await deleteLink(c.env, c.req.param('id'));
  return c.redirect('/admin');
});

app.post('/admin/links/:id/move', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  await moveLink(c.env, c.req.param('id'), body.direction);
  return c.redirect('/admin');
});

export default app;
