# Netlify 部署

当前公网地址：<https://pianbian-margin.netlify.app>

项目使用 Netlify 的免费套餐：

- 静态前端：`app/`
- API：`netlify/functions/api.mjs`
- 文章后台：Netlify Blobs（每个浏览器通过 `margin_uid` Cookie 隔离）
- 部署配置：`netlify.toml`

## 更新网站

在项目目录运行：

```powershell
git add .
git commit -m "update site"
git push
```

然后用 Netlify CLI 发布：

```powershell
$env:NETLIFY_AUTH_TOKEN="<你的 Netlify Token>"
node work/tools/netlify/node_modules/netlify-cli/bin/run.js deploy --prod --dir=app --functions=netlify/functions --site=9e2be3c3-4a91-4078-b358-672d05e30361
```

也可以把仓库连接到 Netlify 项目，让每次推送自动部署。

## 免费额度说明

- 静态页面与函数请求有免费额度，正常个人阅读足够。
- 函数冷启动时可能需要一两秒。
- 文章正文使用 Netlify Blobs 保存；浏览器本地仍保留副本。
