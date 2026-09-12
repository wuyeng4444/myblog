"use client";

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

// 这里的 export default 非常关键！没有 default 就会报你那个错误
export default function ThemeToggleBlock() {
  const { isDark, toggleTheme } = useTheme();
  // 背景特效开关（默认开）。关掉后由 globals.css 的 html.fx-off 规则隐藏所有粒子层。
  const [fxOn, setFxOn] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFxOn(localStorage.getItem('fx') !== 'off');
    setReady(true);
  }, []);

  const toggleFx = (e: React.MouseEvent) => {
    // 不要让点击冒泡到卡片本身的「切换主题」
    e.stopPropagation();
    const next = !fxOn;
    setFxOn(next);
    localStorage.setItem('fx', next ? 'on' : 'off');
    document.documentElement.classList.toggle('fx-off', !next);
  };

  return (
    <div
      onClick={toggleTheme}
      // 【核心修复】：移除了定高限制 (h-[180px] md:h-auto)，换成了统一的 h-full w-full
      className={`h-full w-full rounded-3xl backdrop-blur-md border shadow-xl p-6 flex flex-col justify-center items-center transition-all duration-500 hover:scale-[1.05] cursor-pointer group relative overflow-hidden
        ${isDark ? 'bg-slate-800/40 border-slate-600/50' : 'bg-white/40 border-white/60'}
      `}
    >
       {/* 日夜交替动画图标 */}
       <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 shadow-inner flex-shrink-0">
          <div className={`absolute inset-0 transition-transform duration-700 ${isDark ? '-translate-y-full' : 'translate-y-0'} bg-gradient-to-tr from-sky-300 to-yellow-200`}></div>
          <div className={`absolute inset-0 transition-transform duration-700 ${isDark ? 'translate-y-0' : 'translate-y-full'} bg-gradient-to-tr from-indigo-900 to-slate-800`}></div>

          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'} text-3xl drop-shadow-md`}>
            🌸
          </div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'} text-3xl drop-shadow-md`}>
            ✨
          </div>
       </div>
       <div className="text-center z-10 mt-auto">
           <h3 className={`text-xl font-bold transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-800'}`}>
             {isDark ? '夜间模式' : '日间模式'}
           </h3>
           <p className={`text-sm font-medium mt-1 transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
             {isDark ? '流萤飞舞的深空' : '落樱漫舞的清晨'}
           </p>

           {/* 背景特效开关：嫌卡的话点一下关掉所有粒子/弹幕/点击特效 */}
           <button
             type="button"
             onClick={toggleFx}
             title="关掉背景粒子、弹幕和点击特效，能明显更流畅"
             className={`mt-3 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors duration-300
               ${isDark
                 ? 'border-slate-500/60 text-slate-300 hover:border-indigo-400 hover:text-indigo-300'
                 : 'border-slate-300 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'
               }`}
           >
             <span className={`inline-block w-2 h-2 rounded-full ${ready && fxOn ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
             背景特效 {ready ? (fxOn ? '开' : '关') : '…'}
           </button>
       </div>
    </div>
  );
}
