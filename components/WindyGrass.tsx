"use client";
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

interface WildBlade { id: number; height: number; width: number; delay: number; duration: number; opacity: number; left: string; isLeftCurve: boolean; }

// 性能说明：草叶数量从 150 降到 36，并且去掉了每片叶子里嵌套的渐变层（改成单层纯色）。
// 原来一页要跑 150 个无限循环的 transform 动画 + 150 个渐变元素，弱机上是主要掉帧源。
const BLADE_COUNT = 36;

export default function WindyGrass() {
  const [blades, setBlades] = useState<WildBlade[]>([]);
  // 订阅日夜状态
  const { isDark } = useTheme();

  useEffect(() => {
    const generated: WildBlade[] = Array.from({ length: BLADE_COUNT }).map((_, i) => ({
      id: i,
      height: 30 + Math.random() * 50,
      width: 1 + Math.random() * 2,
      delay: Math.random() * -10,
      duration: 3 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.4,
      left: `${(i / BLADE_COUNT) * 100 + (Math.random() - 0.5) * 0.5}%`,
      isLeftCurve: Math.random() > 0.5
    }));
    setBlades(generated);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-10 overflow-hidden transition-colors duration-1000">
      <style>{`@keyframes swayWildGrass { 0% { transform: rotate(-5deg); } 100% { transform: rotate(15deg); } }`}</style>
      {blades.map(blade => (
        <div
          key={blade.id}
          className="absolute bottom-0 origin-bottom"
          style={{
            left: blade.left,
            height: `${blade.height}px`,
            width: `${blade.width}px`,
            opacity: blade.opacity,
            // 白天变绿，晚上变白（纯色替代渐变，省一层渲染）
            backgroundColor: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(16,185,129,0.75)',
            borderRadius: blade.isLeftCurve ? '100% 0 0 100%' : '0 100% 100% 0',
            animation: `swayWildGrass ${blade.duration}s ease-in-out infinite alternate`,
            animationDelay: `${blade.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
