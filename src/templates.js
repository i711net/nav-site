// 所有页面的 HTML 模板（纯字符串拼接，不依赖 EJS，Workers 环境下更轻量可靠）

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  background: #f0f2f5;
  color: #1f2329;
}
a { text-decoration: none; color: inherit; }

.topbar {
  background: linear-gradient(90deg, #1e5fdb 0%, #2f7bf6 45%, #4fa3ff 100%);
  padding: 28px 16px 60px;
  text-align: center;
}
.topbar .logo { color: #fff; font-size: 26px; font-weight: 700; letter-spacing: 2px; margin-bottom: 18px; }
.topbar .logo span { color: #ffe066; }

.search-box {
  max-width: 640px; margin: 0 auto; display: flex; background: #fff;
  border-radius: 26px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 40, 120, 0.25);
}
.search-box select { border: none; background: #f4f6fa; padding: 0 12px; font-size: 14px; color: #555; border-right: 1px solid #e5e8ee; }
.search-box input[type="text"] { flex: 1; border: none; outline: none; padding: 14px 16px; font-size: 15px; }
.search-box button { border: none; background: #2f7bf6; color: #fff; padding: 0 28px; font-size: 15px; font-weight: 600; cursor: pointer; }
.search-box button:hover { background: #1e5fdb; }

.container { max-width: 1180px; margin: -34px auto 40px; padding: 0 16px; }

.category-card { background: #fff; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); overflow: hidden; }
.category-header { padding: 14px 20px; font-size: 16px; font-weight: 700; color: #fff; display: flex; align-items: center; }
.category-header .bar { width: 4px; height: 16px; background: #fff; margin-right: 8px; border-radius: 2px; opacity: 0.85; }

.link-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; padding: 16px 20px 20px; }

.link-item { display: flex; align-items: center; padding: 10px; border-radius: 8px; border: 1px solid #eef0f3; transition: all 0.15s ease; min-width: 0; }
.link-item:hover { border-color: #2f7bf6; background: #f5f9ff; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(47, 123, 246, 0.15); }

.link-icon { width: 32px; height: 32px; border-radius: 7px; margin-right: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; overflow: hidden; background: #7c8ba1; }
.link-icon img { width: 100%; height: 100%; object-fit: cover; }

.link-text { min-width: 0; }
.link-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.link-desc { font-size: 12px; color: #8a92a3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.empty-hint { padding: 30px; text-align: center; color: #99a1b0; font-size: 14px; }

.footer { text-align: center; color: #9aa1ad; font-size: 12px; padding: 20px 0 30px; }
.footer a { color: #2f7bf6; }

.admin-body { background: #f4f6f9; min-height: 100vh; }
.admin-header { background: #1e2733; color: #fff; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
.admin-header .title { font-size: 17px; font-weight: 700; }
.admin-header a.view-site { color: #9fd1ff; font-size: 13px; margin-right: 16px; }
.admin-header form { display: inline; }
.admin-header button.logout { background: #ff5c5c; color: #fff; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-size: 13px; }
.admin-container { max-width: 1100px; margin: 24px auto; padding: 0 16px; }

.panel { background: #fff; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.panel h2 { font-size: 16px; margin-bottom: 14px; color: #1e2733; }

.inline-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
.inline-form input[type="text"], .inline-form input[type="url"], .inline-form select, .inline-form input[type="color"] { padding: 8px 10px; border: 1px solid #d8dde5; border-radius: 5px; font-size: 13px; }
.inline-form input[type="color"] { width: 44px; padding: 2px; height: 34px; }
.inline-form button { background: #2f7bf6; color: #fff; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 13px; }
.inline-form button:hover { background: #1e5fdb; }

table.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
table.admin-table th, table.admin-table td { padding: 8px 10px; border-bottom: 1px solid #eef0f3; text-align: left; vertical-align: middle; }
table.admin-table th { color: #6b7280; font-weight: 600; background: #fafbfc; }
.tag-color { display: inline-block; width: 14px; height: 14px; border-radius: 3px; margin-right: 6px; vertical-align: middle; }
.op-btn { border: none; background: #eef1f5; color: #444; padding: 4px 9px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-right: 4px; }
.op-btn.danger { background: #fdeaea; color: #d33; }
.op-btn.danger:hover { background: #fbd1d1; }
.op-btn:hover { background: #dfe4ea; }

.category-block { margin-bottom: 22px; border: 1px solid #eef0f3; border-radius: 8px; }
.category-block-header { padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; background: #fafbfc; border-bottom: 1px solid #eef0f3; }
.category-block-header .name { font-weight: 700; font-size: 14px; }
.category-block-body { padding: 10px 14px; }

.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e5fdb, #4fa3ff); }
.login-card { background: #fff; padding: 36px 32px; border-radius: 10px; width: 320px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
.login-card h1 { font-size: 18px; margin-bottom: 20px; text-align: center; color: #1e2733; }
.login-card input { width: 100%; padding: 10px 12px; border: 1px solid #d8dde5; border-radius: 6px; margin-bottom: 12px; font-size: 14px; }
.login-card button { width: 100%; padding: 10px; background: #2f7bf6; color: #fff; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
.login-card button:hover { background: #1e5fdb; }
.login-error { color: #d33; font-size: 13px; margin-bottom: 10px; text-align: center; }

@media (max-width: 600px) {
  .link-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .admin-header { flex-direction: column; gap: 8px; align-items: flex-start; }
}
`;

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function safeHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function layout(title, bodyClass, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>${CSS}</style>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${bodyHtml}
</body>
</html>`;
}

function renderIndex(grouped) {
  const categoriesHtml = grouped.map((cat) => {
    const linksHtml = cat.links.length === 0
      ? `<div class="empty-hint">该分类下暂无链接</div>`
      : `<div class="link-grid">
        ${cat.links.map((link) => `
          <a class="link-item" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(link.desc)}">
            <span class="link-icon" style="background: ${escapeHtml(cat.color)};">
              <span class="fallback-letter">${escapeHtml(link.title.charAt(0))}</span>
              <img src="https://${escapeHtml(safeHostname(link.url))}/favicon.ico" alt=""
                   onload="this.previousElementSibling.style.display='none'; this.style.display='block';"
                   onerror="this.style.display='none';" style="display:none;">
            </span>
            <span class="link-text">
              <div class="link-title">${escapeHtml(link.title)}</div>
              <div class="link-desc">${escapeHtml(link.desc)}</div>
            </span>
          </a>`).join('')}
      </div>`;
    return `<div class="category-card">
      <div class="category-header" style="background: ${escapeHtml(cat.color)};">
        <span class="bar"></span>${escapeHtml(cat.name)}
      </div>
      ${linksHtml}
    </div>`;
  }).join('');

  const body = `
<div class="topbar">
  <div class="logo">我的<span>导航</span></div>
  <form class="search-box" id="searchForm" onsubmit="return doSearch(event)">
    <select id="engineSelect">
      <option value="https://www.baidu.com/s?wd=">百度</option>
      <option value="https://www.bing.com/search?q=">必应</option>
      <option value="https://www.google.com/search?q=">谷歌</option>
      <option value="https://www.sogou.com/web?query=">搜狗</option>
    </select>
    <input type="text" id="searchInput" placeholder="搜索网页内容">
    <button type="submit">搜索</button>
  </form>
</div>
<div class="container">
  ${categoriesHtml || '<div class="empty-hint">还没有任何分类，请前往管理后台添加</div>'}
  <div class="footer">我的常用网址导航 · <a href="/admin/login">管理后台</a></div>
</div>
<script>
function doSearch(e) {
  e.preventDefault();
  var engine = document.getElementById('engineSelect').value;
  var kw = document.getElementById('searchInput').value.trim();
  if (!kw) return false;
  window.open(engine + encodeURIComponent(kw), '_blank');
  return false;
}
</script>`;
  return layout('我的导航', '', body);
}

function renderLogin(error) {
  const body = `
<div class="login-wrap">
  <div class="login-card">
    <h1>管理后台登录</h1>
    ${error ? `<div class="login-error">${escapeHtml(error)}</div>` : ''}
    <form method="POST" action="/admin/login">
      <input type="password" name="password" placeholder="请输入管理密码" required autofocus>
      <button type="submit">登录</button>
    </form>
  </div>
</div>`;
  return layout('管理员登录 - 我的导航', 'admin-body', body);
}

function renderDashboard(grouped, categories) {
  const categoryRows = categories.map((cat) => {
    const linkCount = grouped.find((g) => g.id === cat.id)?.links.length ?? 0;
    return `
      <tr>
        <td><span class="tag-color" style="background:${escapeHtml(cat.color)};"></span></td>
        <td>
          <span id="cat-name-${cat.id}">${escapeHtml(cat.name)}</span>
          <form id="cat-edit-${cat.id}" method="POST" action="/admin/categories/${cat.id}/update" style="display:none; margin-top:6px;" class="inline-form">
            <input type="text" name="name" value="${escapeHtml(cat.name)}" required>
            <input type="color" name="color" value="${escapeHtml(cat.color)}">
            <button type="submit">保存</button>
          </form>
        </td>
        <td>${linkCount}</td>
        <td>
          <form method="POST" action="/admin/categories/${cat.id}/move" style="display:inline;">
            <input type="hidden" name="direction" value="up"><button type="submit" class="op-btn">↑</button>
          </form>
          <form method="POST" action="/admin/categories/${cat.id}/move" style="display:inline;">
            <input type="hidden" name="direction" value="down"><button type="submit" class="op-btn">↓</button>
          </form>
          <button type="button" class="op-btn" onclick="toggleEdit('cat-edit-${cat.id}')">编辑</button>
          <form method="POST" action="/admin/categories/${cat.id}/delete" style="display:inline;" onsubmit="return confirm('删除该分类将同时删除其下所有链接，确定继续？');">
            <button type="submit" class="op-btn danger">删除</button>
          </form>
        </td>
      </tr>`;
  }).join('');

  const categoryOptions = categories.map((cat) => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');

  const linkBlocks = grouped.map((cat) => {
    const rows = cat.links.length === 0
      ? `<div style="color:#9aa1ad; font-size:13px; padding:8px 0;">暂无链接</div>`
      : `<table class="admin-table">
          <thead><tr><th>名称</th><th>网址</th><th>简介</th><th style="width:280px;">操作</th></tr></thead>
          <tbody>
          ${cat.links.map((link) => `
            <tr>
              <td>${escapeHtml(link.title)}</td>
              <td style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                <a href="${escapeHtml(link.url)}" target="_blank" style="color:#2f7bf6;">${escapeHtml(link.url)}</a>
              </td>
              <td>${escapeHtml(link.desc)}</td>
              <td>
                <form method="POST" action="/admin/links/${link.id}/move" style="display:inline;">
                  <input type="hidden" name="direction" value="up"><button type="submit" class="op-btn">↑</button>
                </form>
                <form method="POST" action="/admin/links/${link.id}/move" style="display:inline;">
                  <input type="hidden" name="direction" value="down"><button type="submit" class="op-btn">↓</button>
                </form>
                <button type="button" class="op-btn" onclick="toggleEdit('link-edit-${link.id}')">编辑</button>
                <form method="POST" action="/admin/links/${link.id}/delete" style="display:inline;" onsubmit="return confirm('确定删除该链接？');">
                  <button type="submit" class="op-btn danger">删除</button>
                </form>
              </td>
            </tr>
            <tr id="link-edit-${link.id}" style="display:none;">
              <td colspan="4">
                <form class="inline-form" method="POST" action="/admin/links/${link.id}/update">
                  <select name="categoryId">
                    ${categories.map((c) => `<option value="${c.id}" ${c.id === link.categoryId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
                  </select>
                  <input type="text" name="title" value="${escapeHtml(link.title)}" required>
                  <input type="text" name="url" value="${escapeHtml(link.url)}" required style="min-width:220px;">
                  <input type="text" name="desc" value="${escapeHtml(link.desc)}" style="min-width:180px;">
                  <button type="submit">保存</button>
                </form>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>`;
    return `
      <div class="category-block">
        <div class="category-block-header">
          <span class="name"><span class="tag-color" style="background:${escapeHtml(cat.color)};"></span>${escapeHtml(cat.name)}</span>
          <span style="color:#9aa1ad; font-size:12px;">${cat.links.length} 个链接</span>
        </div>
        <div class="category-block-body">${rows}</div>
      </div>`;
  }).join('');

  const body = `
<div class="admin-header">
  <div class="title">导航站管理后台</div>
  <div>
    <a class="view-site" href="/" target="_blank">查看前台网站 &rarr;</a>
    <form method="POST" action="/admin/logout"><button type="submit" class="logout">退出登录</button></form>
  </div>
</div>
<div class="admin-container">
  <div class="panel">
    <h2>分类管理</h2>
    <form class="inline-form" method="POST" action="/admin/categories">
      <input type="text" name="name" placeholder="新分类名称" required>
      <input type="color" name="color" value="#2f7bf6">
      <button type="submit">+ 添加分类</button>
    </form>
    <table class="admin-table">
      <thead><tr><th>颜色</th><th>名称</th><th>链接数</th><th style="width:260px;">操作</th></tr></thead>
      <tbody>${categoryRows}</tbody>
    </table>
  </div>

  <div class="panel">
    <h2>添加链接</h2>
    <form class="inline-form" method="POST" action="/admin/links">
      <select name="categoryId" required>${categoryOptions}</select>
      <input type="text" name="title" placeholder="网站名称" required>
      <input type="text" name="url" placeholder="网址（如 example.com）" required style="min-width:220px;">
      <input type="text" name="desc" placeholder="简介（可选）" style="min-width:180px;">
      <button type="submit">+ 添加链接</button>
    </form>
  </div>

  <div class="panel">
    <h2>链接管理</h2>
    ${linkBlocks}
  </div>
</div>
<script>
function toggleEdit(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = (el.style.display === 'none' || el.style.display === '') ? (el.tagName === 'TR' ? 'table-row' : 'flex') : 'none';
}
</script>`;
  return layout('管理后台 - 我的导航', 'admin-body', body);
}

export { renderIndex, renderLogin, renderDashboard };
