# 使用 Koyeb 免费部署

Koyeb 可以直接识别仓库里的 `Dockerfile`，适合当前项目。

## 部署步骤

1. 打开 `https://app.koyeb.com/`。
2. 使用 GitHub 登录并授权 Koyeb 读取仓库。
3. 选择 **Create Service → Web Service**。
4. 选择 GitHub 仓库 `jinhaoliu169-design/margin-reader`，分支 `main`。
5. Builder 选择 **Dockerfile**。
6. 实例规格优先选择可用的 **Free** 实例；如果当前页面没有免费规格，先停止部署并告诉我页面显示的价格。
7. 服务端口填写 `8765`，协议选择 `HTTP`。
8. 健康检查路径填写 `/api/health`。
9. 添加以下环境变量：

   | 变量 | 值 |
   |---|---|
   | `MARGIN_DATA_DIR` | `/tmp/margin-data` |
   | `MARGIN_HOST` | `0.0.0.0` |
   | `MARGIN_MULTIUSER` | `1` |
   | `PORT` | `8765` |
   | `MARGIN_ACCESS_CODE` | 自定义访问密码 |

10. 点击 Deploy。
11. 部署成功后会得到类似 `https://margin-reader-xxx.koyeb.app` 的地址。

## 访问方式

- 用户名可以任意填写，例如 `reader`
- 密码填写你设置的 `MARGIN_ACCESS_CODE`

## 免费实例的限制

- 服务可能在一段时间无人访问后休眠，首次打开会更慢。
- 免费实例没有持久磁盘，后台缓存可能重置。
- 每个浏览器的导入文章保存在自己的浏览器本地；“我的”页面会自动把本机文章同步回服务。
- 重要文章建议定期在“我的”页面导出备份。
