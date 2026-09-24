# Roooooxy’s BLOG

基于 Astro 与 Mizuki 的个人笔记网站，当前代码版本 v3.1.0。

[访问网站](https://w-joslin-x.github.io/)

## 本地运行

使用 Node.js 22.12+（GitHub Actions 使用 24）与 pnpm 11.5.3。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

验证与构建：

```sh
pnpm test
pnpm check
pnpm build
pnpm verify
pnpm preview
```

推送 `main` 后，GitHub Actions 验证并部署到 GitHub Pages。

## 网站文件

- `src/`：页面、组件、交互、样式及默认配置。
- `content/posts/`：文章与附件。
- `content/backgrounds/`、`content/music/`：背景及音乐素材、来源元信息。
- `content/catalog.yaml`：图库顺序、默认图片和音乐清单。
- `src/config/roxy-defaults.json`：四组网站默认设置。
- `public/`：本地字体、音效等静态资源。
- `templates/`：文章、背景与音乐模板。
- `scripts/`、`tests/`：资源准备、构建与验证。

构建生成的 `.generated/`、`dist/`、缓存、依赖和个人开发文档不纳入网站源码。未提供音频的音乐条目只展示元信息，不可播放。

## 许可与来源

保留 [LICENSE](LICENSE)、[LICENSE.MIT](LICENSE.MIT)、[第三方声明](THIRD_PARTY_NOTICES.md) 和 [素材来源](docs/素材来源.md)。插图、封面及音乐不随代码许可证授权；各素材来源与许可见相应目录。
