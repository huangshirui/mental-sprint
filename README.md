# 口算冲刺 · Mental Sprint

一个轻量的中文口算练习网站。直接输入答案，答对自动进入下一题，倒计时结束后统计成绩。

纯静态 HTML、CSS 和 JavaScript，无框架、无依赖、无需构建，可直接部署到 Cloudflare Pages。无需登录或服务器；最佳纪录保存在当前浏览器的 localStorage 中。

## 功能

- 整数、小数、分数和混合练习。
- 可选择加、减、乘、除，基础 / 标准 / 进阶难度，以及 1 / 2 / 5 分钟。
- 小数除法支持有限小数答案，例如 `8 ÷ 5 = 1.6`。
- 分数输入使用 `1/2`；接受等值分数和精确小数答案，不支持带分数写法。
- 使用约分后的有理数进行答案判定，避免 `0.1 + 0.2` 的浮点误差。
- 整数操作数从 2 起。所有主题排除实际数值为 0 或 1 的操作数，以及相同数相减、相除；保留 `0.1` 和 `1/2` 等有效练习。
- 桌面实体键盘和触屏数字键盘；竖屏键盘在下，横屏键盘在右。
- 练习页按可用视口高度排布；极小窗口允许滚动，保证控件可用。
- 统计答对总数、每分钟答对数、已答对题的平均耗时；支持跳过题回顾和相同设置的最佳纪录。

切换标签页不会暂停倒计时；提前结束的练习不计入最佳纪录。

## 本地运行

在仓库根目录运行：

```sh
python3 -m http.server 8080 --directory dist
```

打开 <http://localhost:8080>。无需 `npm install`。

## Cloudflare Pages 部署

在 Cloudflare 控制台的 **Workers & Pages** 创建 **Pages** 项目，选择导入 Git 仓库，并连接 `huangshirui/mental-sprint`。

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Root directory | 留空（仓库根目录） |
| Environment variables | 无需配置 |

`dist` 已包含完整站点，文件需要提交到 Git。这里没有额外构建步骤，也不需要 Workers、D1、R2 或 API 密钥。

部署成功后可在项目的 **Custom domains** 中绑定自己的域名。启用 Git 集成后，推送到 `main` 会触发生产部署。

参考：[Cloudflare 静态 HTML 部署文档](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)。

## 代码结构

| 文件 | 用途 |
| --- | --- |
| `dist/index.html` | 主题设置、练习、结果和说明界面 |
| `dist/engine.js` | 题目生成、有理数计算、输入解析与答案校验 |
| `dist/app.js` | 练习状态、计时、键盘交互、统计与本机纪录 |
| `dist/style.css` | 基础视觉样式 |
| `dist/layout.css` | 紧凑布局和横竖屏适配 |
| `dist/icon.svg` | 网站图标 |

修改后可用 Node.js 检查 JavaScript 语法：

```sh
node --check dist/engine.js
node --check dist/app.js
```

## 许可证

[MIT](LICENSE)
