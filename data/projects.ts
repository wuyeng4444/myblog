// 🛡️ 本文件由控制台自动生成，请勿手动修改

export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
};

export const projectsData: Project[] = [
  {
    "id": "proj_imperial_record",
    "name": "帝国示录 · 设定集",
    "githubUrl": "https://github.com/wuyeng4444/-",
    "description": "《帝国示录：我们是始嗣》的线上设定集。静态站，带文章列表、详情、标签分类与目录页，内容由 Python 脚本从剧本文本自动切分生成。",
    "icon": "🌑",
    "tags": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  },
  {
    "id": "proj_myblog",
    "name": "无影の藏身处",
    "githubUrl": "https://github.com/wuyeng4444/myblog",
    "description": "就是这个博客本身。Next.js + Tailwind 的毛玻璃风格站点，文章、杂谈、说说、照片墙、友链都在这里。",
    "icon": "🪟",
    "tags": [
      "Next.js",
      "React",
      "Tailwind"
    ]
  },
];
