// 🛡️ 本文件由控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "hymne-seven",
    "title": "欢颂 · 七人",
    "description": "「欢颂」的七位特殊持有者——他们无神格，却有着神格级的力量。",
    "cover": "/gallery/cover.jpg",
    "date": "2026.09",
    "photos": [
      { "url": "/gallery/hymne-1.jpg", "caption": "① 千象百兔" },
      { "url": "/gallery/hymne-2.jpg", "caption": "② 苦乐贪杯" },
      { "url": "/gallery/hymne-3.jpg", "caption": "③ 笑醉泪醒" },
      { "url": "/gallery/hymne-4.jpg", "caption": "④ 虚实之影" },
      { "url": "/gallery/hymne-5.jpg", "caption": "⑤ 月相无缺" },
      { "url": "/gallery/hymne-6.jpg", "caption": "⑥ 满天遍地" },
      { "url": "/gallery/hymne-7.jpg", "caption": "⑦ 悲喜剧场" }
    ]
  },
];
