export interface MusicTrack {
  /** 唯一标识，新增歌曲时不要重复。 */
  id: string;
  title: string;
  artist: string;
  /** public 下的音频路径，以 / 开头；空字符串表示不可播放的占位。 */
  src: string;
  /** public 下的封面路径；省略时显示音乐图标。 */
  cover?: string;
}

// 每首歌推荐一个文件夹：public/music/歌曲标识/audio.mp3、cover.jpg。
// 新增歌曲只需复制一项，填写以下五个字段，无需改播放器组件。
export const musicTracks: MusicTrack[] = [
  {
    id: 'yanineko-op',
    title: 'なんもねえ',
    artist: '忘れらんねえよ',
    src: '/music/yanineko-op/audio.mp3',
    cover: '/music/yanineko-op/cover.jpg',
  },
  {
    id: 'coming-soon',
    title: '', // 空标题的占位会跟随网站语言显示“待添加”。
    artist: '',
    src: '',
  },
];

export const musicDefaults = { volume: 0.65, mode: 'list' as const };
