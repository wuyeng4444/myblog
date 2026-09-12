"use client";

import { useEffect, useState } from 'react';

// 更新萤火虫的数据结构，增加独立的移动动画属性
interface Firefly {
  id: number;
  top: string;
  left: string;
  size: number;
  breatheDuration: number; // 呼吸闪烁的周期
  breatheDelay: number;
  floatDuration: number;   // 缓慢飞行的周期
  floatDelay: number;
  floatPath: string;       // 随机分配飞行轨迹
}

// 性能说明（相比原版做了三处改动）：
// 1. 数量 50 → 16：每只萤火虫是一层独立合成，50 只在高分屏上很吃 GPU。
// 2. 呼吸动画不再动 box-shadow：box-shadow 是绘制属性，动画它等于每帧重绘光晕。
//    改成只在透明度/缩放上做呼吸，光晕用固定的 box-shadow（只栅格化一次）。
// 3. 去掉容器上的 mix-blend-screen：全屏混合模式每帧都要重新混合整块画面。
const FIREFLY_COUNT = 16;

export default function Fireflies() {
  const [flies, setFlies] = useState<Firefly[]>([]);

  useEffect(() => {
    const generated: Firefly[] = Array.from({ length: FIREFLY_COUNT }).map((_, i) => ({
      id: i,
      // 初始出生点
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 4,

      // 呼吸闪烁：较快，3 到 8 秒一个来回
      breatheDuration: 3 + Math.random() * 5,
      breatheDelay: Math.random() * -10,

      // 飞行移动：极其缓慢，15 到 35 秒一个来回，营造漫游感
      floatDuration: 15 + Math.random() * 20,
      floatDelay: Math.random() * -20,

      // 随机分配 4 种不同的飞行轨迹，避免大家往同一个方向飞
      floatPath: `float${Math.floor(Math.random() * 4) + 1}`,
    }));
    setFlies(generated);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">

      {/* 动画引擎 */}
      <style>{`
        /* 内层：纯透明度 + 缩放的呼吸（不动 box-shadow，避免每帧重绘光晕） */
        @keyframes fireflyBreathe {
          0%, 100% {
            opacity: 0;
            transform: scale(0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        /* 外层：四种不同的大范围随机漂浮轨迹 (利用 vw 和 vh 跨越屏幕) */
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(10vw, -15vh); }
          66% { transform: translate(-5vw, -20vh); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-12vw, 10vh); }
          66% { transform: translate(8vw, 15vh); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15vw, 15vh); }
          66% { transform: translate(-10vw, 5vh); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-15vw, -10vh); }
          66% { transform: translate(10vw, -15vh); }
        }
      `}</style>

      {flies.map(fly => (
        // 【外层容器】：负责在屏幕上极其缓慢地游荡飞行
        <div
          key={fly.id}
          className="absolute"
          style={{
            top: fly.top,
            left: fly.left,
            animation: `${fly.floatPath} ${fly.floatDuration}s ease-in-out infinite`,
            animationDelay: `${fly.floatDelay}s`,
          }}
        >
          {/* 【内层元素】：负责自身发光、变大和透明度呼吸 */}
          <div
            className="rounded-full"
            style={{
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              backgroundColor: 'rgba(200, 255, 200, 0.9)',
              // 固定光晕，只栅格化一次
              boxShadow: '0 0 10px 3px rgba(100, 255, 150, 0.7), 0 0 20px 6px rgba(50, 255, 100, 0.35)',
              animation: `fireflyBreathe ${fly.breatheDuration}s ease-in-out infinite`,
              animationDelay: `${fly.breatheDelay}s`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}
