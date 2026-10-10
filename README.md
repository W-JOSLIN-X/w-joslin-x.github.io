# Roooooxy’s BLOG

基于 Astro 与 Mizuki 的个人笔记网站，当前代码版本 V5.1.0。

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

## Live2D

电脑浏览器默认显示薇薇安，大小 70%；右键可切换 Roxy、简和尼古喵喵或调整大小。直接拖动，贴边松手收起，点击边缘标签恢复。本站默认启用，手机不加载。

`public/live2d/` 包含本版本实际使用的组件运行模块、四角色配置和运行资源、Cubism Core 与着色器。无需相邻开发工程即可构建。`character.json` 管理可选清单与组件默认角色，博客通过挂载配置指定薇薇安和 70% 大小；`profiles/` 管理角色配置。人物模块保持框架无关；此仓库是网站发布快照。

模型素材不随网站代码许可证授权；Live2D Core 与 Framework 条款见 `public/live2d/sdk/Core-LICENSE.md` 和 `Framework-LICENSE.md`。这些资源仅用于本站运行，不代表可任意二次分发。

## 大肥鱼问答

右键人物选择“问问大肥鱼”，或选中正文后右键选择“问大肥鱼”。选文先进入草稿，不自动发送。支持文字、原图、文章材料、多轮回复、停止和重试，以及 Markdown、表格、数学公式和代码复制。切页、收起及更换角色保留当前会话，刷新清空。

在设置中填写自己的 API Key；请求由浏览器直接发往所选服务。支持 DeepSeek 预设及自定义 Chat Completions 兼容接口，后者的图像能力需自行确认，服务也须允许浏览器跨域访问。没有公共代理、共享 Key、账号或云历史。Key 默认仅本次使用，主动选择记住后才按服务地址存入本设备浏览器；可独立清除。模型的系统提示仅为“你叫大肥鱼。”。

窗口支持四边缩放、页面全屏、六部分独立换肤及女仆工坊、虎鲸链路、毛玻璃、轻拟物整套预设。默认女仆白天背景，夜景可手动选；没有场景资源的预设使用无图片背景。本地背景不上传，外观修改只在本次浏览有效。配色可手动修改或一次性同步网站；网站明暗模式继续同步。

皮肤来源与完整许可见 [皮肤素材说明](public/live2d/lib/skins/SOURCES.md) 及该目录的许可证；女仆工坊与虎鲸链路美术资源适用 **CC BY-NC-SA 4.0**，代码许可不覆盖美术。问答依赖及组件说明见 [运行依赖声明](public/live2d/THIRD_PARTY_NOTICES.md)。

网站默认采用暗色、紫色 270、宽屏、背景叠加及 20% 透明度、樱花氛围、星点鼠标轨迹、涟漪点击、机械按键音效与 20% 音量。横幅模式默认多层波浪边缘。浏览器中已有的网站偏好仍优先于这些默认值。
