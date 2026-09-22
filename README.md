# Roooooxy’s BLOG

笔记、随笔与阅读收藏。基于 Mizuki / Astro 定制的个人博客。

- 网站：https://w-joslin-x.github.io/
- 首个版本：v1.0.0
- 写作与外观配置：[使用说明](使用说明.md)

## 更新内容

在 `src/content/posts/` 中维护 Markdown 及文章自己的图片目录。提交到 `main` 后，GitHub Actions 自动检查、构建并发布网站，同时生成下载包、反向引用和 Git 活跃记录。

## 本地预览

使用 Node.js 24 和 pnpm 11.5.3：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

正式构建与检查：

```sh
pnpm test:roxy
pnpm build
node scripts/verify-roxy.mjs
```

## 当前内容

六篇带“演示”标签的文章用于展示阅读、搜索、公式、代码、流程图及下载。个人介绍、格言和音乐仍为明确占位；音乐未提供音源，网页宠物未启用。

## 致谢与素材

主题基于 [Mizuki](https://github.com/LyraVoid/Mizuki) 和 [Astro](https://astro.build/)，保留原有许可证及第三方声明。插图出处见 [素材来源](docs/素材来源.md)。文章内容、头像和官方宣传插图不因代码许可证而获得额外授权。
