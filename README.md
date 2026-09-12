# 无影 の 藏身处

个人博客。基于 [XHBlogs](https://github.com/XingHuiSama/XinghuisamaBlogs) 二次修改。

> 这是部署用的前端项目。本地写作控制台在 `my-blog-manager`（不在本仓库中）。

## 技术栈

- **Next.js 16** + React 19（App Router）
- **Tailwind CSS 4**
- framer-motion / three.js（动效与 3D）
- 内容：Markdown + gray-matter

## 目录结构

```
app/            页面路由（首页 / 文章 / 说说 / 杂谈 / 相册 / 友链 / 项目 / 归档 / 音乐 / 关于）
components/     组件（导航、播放器、背景特效、AI 猫…）
data/           友链、项目、相册数据
posts/          文章（Markdown）
moments/        说说（Markdown）
chatters/       杂谈（Markdown）
public/         静态资源（头像、封面、相册图）
siteConfig.ts   全站配置（★ 改这里）
```

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建
npm start          # 跑生产构建
```

## 改配置

绝大部分个性化都在 `siteConfig.ts` 一个文件里：站名、头像、简介、背景配色、社交链接、弹幕、AI 猫猫的人设提示词等。

## 写内容

三个目录，都是 Markdown：

- `posts/xxx.md` — 文章。frontmatter 支持 `title / date / description / cover / tags / mood`
- `moments/moment-<时间戳>.md` — 说说。frontmatter 支持 `id / date / location / images`
- `chatters/yyyy-mm-dd-slug.md` — 杂谈。frontmatter 支持 `title / date / tags / mood / cover / description`

## 部署

部署在 [Vercel](https://vercel.com)（因为用到了服务端 API 路由）。把本仓库导入 Vercel 即可，构建命令和输出目录都用默认值。

可选环境变量：

| 变量 | 用途 |
| --- | --- |
| `GEMINI_API_KEY` | 让「AI 猫猫」能说话（Google Gemini） |
| `QWEATHER_KEY` | 天气挂件（和风天气） |

不配也能正常跑，只是对应功能不可用。

## 姊妹站

- [帝国示录 · 设定集](https://wuyeng4444.github.io/-/) — 世界观设定条目归档

## 授权

二次修改自 [XHBlogs](https://github.com/XingHuiSama/XinghuisamaBlogs)，遵循原项目的 **CC BY-NC 4.0** 协议：允许学习、分享与二次修改，**禁止商业用途**，二次开源发布需注明原作者。
