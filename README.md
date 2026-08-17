# 我的导航站（Cloudflare Workers 版）

个人常用网址导航网站，带管理后台，运行在 Cloudflare Workers 上（免费额度足够个人使用），数据存储在 Cloudflare KV 中，不需要自己管服务器。风格参照传统门户导航站（如 hao123）。

技术栈：[Hono](https://hono.dev)（轻量 Web 框架）+ Cloudflare Workers + Cloudflare KV。

## 整体流程

1. 本地准备好项目、创建 KV 命名空间
2. 推送到 GitHub
3. 在 Cloudflare 控制台把 Worker 和这个 GitHub 仓库连接起来，以后每次 `git push` 会自动重新部署

下面按顺序操作即可。

---

## 第一步：本地准备

需要先安装 [Node.js](https://nodejs.org/)（18 及以上）。

```bash
cd nav-site-cf
npm install
```

登录 Cloudflare（会打开浏览器授权）：

```bash
npx wrangler login
```

创建一个 KV 命名空间，用来存放分类和链接数据：

```bash
npx wrangler kv namespace create NAV_DB
```

命令执行后会输出类似下面的内容：

```
{ "binding": "NAV_DB", "id": "abcd1234efgh5678..." }
```

打开 `wrangler.jsonc`，把 `kv_namespaces` 里的 `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` 替换成刚才拿到的真实 `id`：

```jsonc
"kv_namespaces": [
  {
    "binding": "NAV_DB",
    "id": "abcd1234efgh5678..."   // 换成你的真实 id
  }
]
```

这个 id 不是敏感信息，可以放心提交到 Git。

## 第二步：本地测试（可选但推荐）

复制一份环境变量文件：

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars`，改成你自己的密码和一个随机字符串：

```
ADMIN_PASSWORD=你的管理密码
SESSION_SECRET=一串随机字符串，越长越好
```

启动本地开发服务器：

```bash
npm run dev
```

打开 http://localhost:8787 看前台页面，http://localhost:8787/admin/login 登录后台（密码就是你在 `.dev.vars` 里设置的）。`.dev.vars` 不会被提交到 Git（已在 `.gitignore` 中排除）。

## 第三步：推送到 GitHub

如果还没有 Git 仓库：

```bash
git init
git add .
git commit -m "个人导航站：Cloudflare Workers 版"
```

在 [github.com](https://github.com) 新建一个空仓库（不要勾选自动生成 README，避免冲突），然后：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

## 第四步：在 Cloudflare 连接 GitHub 仓库，自动部署

1. 打开 [Cloudflare 控制台](https://dash.cloudflare.com) → 左侧 **Workers & Pages**
2. 点击 **Create** → 选择 **Import a repository**（导入一个仓库）
3. 授权并选择你刚才创建的 GitHub 仓库
4. Cloudflare 会自动识别项目里的 `wrangler.jsonc`，构建命令一般不需要改动（默认会执行 `npm install` 然后按配置部署）
5. **重要**：Cloudflare 控制台里的 Worker 名称必须和 `wrangler.jsonc` 里的 `"name": "nav-site"` 一致，否则自动部署会失败
6. 点击部署，等构建完成，会得到一个 `https://nav-site.你的子域.workers.dev` 的网址

部署成功后，去 **该 Worker 的 Settings → Variables and Secrets**，添加两个 **Secret**（不是普通变量，选择加密类型）：

- `ADMIN_PASSWORD`：你的管理后台登录密码
- `SESSION_SECRET`：一串随机字符串（用于给登录状态签名，网上搜"随机字符串生成器"生成一串 32 位以上的即可）

保存后 Worker 会自动重新部署一次生效。

> 也可以用命令行设置（效果一样，会覆盖控制台里的值）：
> ```bash
> npx wrangler secret put ADMIN_PASSWORD
> npx wrangler secret put SESSION_SECRET
> ```

## 之后如何更新网站

以后想加分类、改样式、改代码，本地改完后：

```bash
git add .
git commit -m "说明这次改了什么"
git push
```

推送后 Cloudflare 会自动重新构建部署，一两分钟后生效。日常的"增删改链接"不需要走这个流程，直接在管理后台网页操作就行，数据实时存到 KV 里。

## 绑定自定义域名（可选）

如果你有自己的域名并且已经接入 Cloudflare：Worker 页面 → **Settings → Domains & Routes** → **Add** → 选择你的域名，按提示操作，几分钟后即可通过自己的域名访问。

## 常见问题

**忘记管理密码怎么办？**
去 Worker 的 Settings → Variables and Secrets，重新设置 `ADMIN_PASSWORD` 即可。

**数据会丢失吗？**
数据存在 Cloudflare KV 里，和代码部署是分开的，重新部署代码不会清空数据。真正会清空数据的操作只有手动删除这个 KV 命名空间。

**想本地备份数据怎么办？**
```bash
npx wrangler kv key get "db" --namespace-id=你的KV命名空间id > backup.json
```

## 目录结构

```
nav-site-cf/
├── wrangler.jsonc         # Cloudflare Workers 配置（Worker 名称、KV 绑定等）
├── package.json
├── .dev.vars.example       # 本地开发环境变量示例
└── src/
    ├── index.js            # 路由入口（Hono）
    ├── store.js            # 数据读写（基于 KV）
    ├── auth.js             # 登录态校验（签名 Cookie）
    └── templates.js        # 页面 HTML 模板 + 样式
```
