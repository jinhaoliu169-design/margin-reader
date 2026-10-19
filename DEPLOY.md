# 长期公网部署

项目已经包含 `Dockerfile` 和 Render Blueprint。部署后，别人可以通过固定的 HTTPS 地址访问，不需要你的电脑保持开机。

## 推荐方案

- 平台：Render
- 区域：Singapore
- 运行方式：Docker
- 实例：Starter（需要绑定付款方式，按 Render 当期价格计费）
- 持久磁盘：1 GB，挂载到 `/var/data`
- 访问密码：由 `MARGIN_ACCESS_CODE` 控制
- 访客数据隔离：`MARGIN_MULTIUSER=1`，每个浏览器使用独立的导入文章空间

## 部署步骤

1. 注册 Render 账号并绑定付款方式。
2. 把本项目上传到 GitHub 仓库。
3. 在 Render 中选择 **New → Blueprint**，连接该仓库。
4. Render 会读取 `render.yaml`，创建一个 Web Service 和 1 GB 持久磁盘。
5. 在环境变量中填写 `MARGIN_ACCESS_CODE`，这是网站访问密码。
6. 点击部署。完成后 Render 会提供类似下面的固定地址：

   `https://margin-reader-xxxx.onrender.com`

7. 把这个地址和访问密码发给别人。浏览器会弹出用户名/密码框，用户名可以随意填写，密码填写 `MARGIN_ACCESS_CODE`。

## 数据与隐私

- 620 本公版小说随网站一起部署，所有人共享这部分内容。
- “我的文章”、回收站等数据会按浏览器 Cookie 隔离，每个访客只能看到自己的文章。
- 持久磁盘 `/var/data` 保存后台导入文章、词典缓存、译文缓存和公版全文缓存。
- 清除浏览器 Cookie 后，该访客会得到新的文章空间；重要数据请先从“我的”页面导出备份。

## 本地验证

没有 Docker 也可以先验证生产参数：

```powershell
$env:PORT="9000"
$env:MARGIN_HOST="0.0.0.0"
$env:MARGIN_MULTIUSER="1"
python server.py --host 0.0.0.0 --port 9000 --no-open
```

访问 `http://127.0.0.1:9000/`。如需测试密码，再设置：

```powershell
$env:MARGIN_ACCESS_CODE="your-password"
```

## 为什么不能直接生成公网链接

长期公网地址必须由云平台账号创建，并且需要绑定付款方式或服务器。当前电脑没有已授权的 Render、Railway、GitHub 或其他云平台凭据，因此代码和部署配置已经准备好，但最后创建线上实例需要账号持有人授权。
