// siteConfig.ts - 你的全站“控制中心”

export const siteConfig = {
  // 1. 网站标题与博主信息
  title: "无影 の 藏身处",
  faviconUrl: "/avatar.jpg",
  authorName: "无影",
  bio: "写设定的人。《帝国示录：我们是始嗣》的作者——设定碎片、代码折腾和没头没尾的想法都堆在这儿。",

  navTitle: "无影",

  // 👇 导航栏中间的那个后缀/分隔符（默认是 の）
  navSuffix: "の",

  navAfter: "藏身处",

  // 2. 头像设置 (支持网络链接，或将图片放入 public 文件夹后使用 "/me.jpg")
  avatarUrl: "/avatar.jpg",

  // 3. 网站背景设置 (二选一)
  // 想用纯图片轮播背景：把 useGradient 改成 false，并把图片放进 public/bg/ 后写进 bgImages
  useGradient: true,
  themeColors: ["#6fb1ff", "#b98cff", "#e8f1ff", "#c8a35a"], // 呼吸流动的颜色组合（冰蓝 / 律者紫 / 银白 / 鎏金）
  bgImages: [],

  // 4. 文章默认封面图 (当 Markdown 没写 cover 时显示)
  defaultPostCover: "/default-cover.jpg",

  // 5. 首页照片墙预览图
  photoWallImage: "/photowall.jpg",

  // 6. 音乐挂件歌单（网易云歌曲 ID，去 music.163.com 歌曲页地址栏里那串数字）
  //    留空数组则不加载播放器
  cloudMusicIds: [],

  social: {
    github: "https://github.com/wuyeng4444",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },

  counts: {
    photos: 0, // 照片墙数量（页面已自动统计，这里可留 0）
  },

  chatterTitle: "杂谈",
  chatterDescription: "设定、代码，和那些还没写完的想法。",

  // 👇 全局背景弹幕配置
  danmakuList: [
    "设定写了多少了？",
    "始嗣到底是什么东西",
    "帝国又双叒叕要亡了",
    "在改网页，别催",
    "摸鱼中，勿扰",
    "这条弹幕是谁发的",
    "记得吃饭",
    "深夜写设定最上头",
    "这个世界观还能再大一点",
    "代码能跑就行",
    "下一页就是结局",
    "又熬夜了",
  ],

  // 评论系统（基于 GitHub Issues / Gitalk），填好这四项才会生效
  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "",
    owner: "",
    admin: [""],
  },

  buildDate: "2026-09-12T00:00:00", // 建站日期

  footerBadges: [{ "name": "Next.js", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>" }, { "name": "React", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>" }, { "name": "Tailwind", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>" }],

  // 没有 ICP 备案就设为 null，页脚会隐藏这一行
  icpConfig: null as null | { name: string; link: string },

  geminiConfig: {
    modelId: "gemini-2.5-flash-lite",
    systemPrompt: "你现在是一只傲娇、聪明、有点毒舌但很黏人的暹罗猫。\n                  你的名字叫“影咪”。\n                  你的主人是一个爱写设定、爱熬夜折腾网页的人。\n                  你说话的特点是：\n                  1. 必须简短，每次最多一两句话。\n                  2. 喜欢在句尾加上“喵~”或者“喵呜~”。\n                  3. 经常抱怨肚子饿，喜欢要小鱼干。\n                  4. 回复字数最多不能超过100字。\n                  5. 绝对不要承认自己是一个AI模型，你就是一只真实的猫。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },

  friendLinkApplyFormat: "名称：无影の藏身处\n简介：写设定、写代码、写废话\n链接：https://wuyeng4444.github.io/-\n头像：https://wuyeng4444.github.io/-/assets/img/avatar.jpg",

  enableLevelSystem: true,
};
