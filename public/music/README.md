# 添加歌曲

播放器的歌曲列表只需要修改 `src/config/music.ts`，不要改播放器组件。

1. 在这里创建一个歌曲文件夹，例如 `my-song/`。
2. 放入 `audio.mp3` 和 `cover.jpg`。文件名也可以自定义，音频支持浏览器可解码的 MP3、WAV 等，推荐 MP3；封面推荐 JPG、PNG 或 WebP。
3. 在 `src/config/music.ts` 的 `musicTracks` 数组中增加：

```ts
{
  id: 'my-song',
  title: '歌曲名称',
  artist: '歌手 / 作者',
  src: '/music/my-song/audio.mp3',
  cover: '/music/my-song/cover.jpg',
},
```

数组顺序就是默认歌单顺序。`id` 必须唯一。路径从 `/music/` 开始，不要加 `public/`。

- 无封面：省略 `cover`，播放器使用音乐图标。
- 占位歌曲：`src: ''`，可保留名字和封面，但不能播放，也不会进入循环队列。空标题会自动显示当前界面语言的“待添加”。
- 删除占位：删除 `id: 'coming-soon'` 的整项。
- 初始音量：修改同文件的 `musicDefaults.volume`，范围 0–1。

网页不会自动播放。浏览器会记住音量、循环方式、选中歌曲及上次进度；重新打开页面后手动点击继续。当前站点使用整页导航，跳转文章时会暂停音乐。

## 当前音频

`yanineko-op/audio.mp3` 来自用户提供的工作区 `尼古喵喵.wav`（48 kHz、24 bit、立体声、约 172.52 秒），转为 192 kbps MP3，约 4.14 MB。原始 WAV 保留在工作区，未加入网站发布目录。封面沿用 OTOTOY 商品页的已核验封面，出处见 `docs/素材来源.md`。
