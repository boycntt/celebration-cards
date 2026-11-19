import React, { useEffect, useRef } from 'react';
import { ParticleTheme } from '../types/occasion';

interface ParticleCanvasProps {
  theme: ParticleTheme;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  kind: 'leaf' | 'spark';
  color: string;
}

const THEME_PALETTES: Record<ParticleTheme, { leafColors: string[]; sparkColors: string[] }> = {
  'bamboo-gold': {
    leafColors: ['rgba(212, 175, 55, 0.55)', 'rgba(56, 189, 248, 0.35)', 'rgba(245, 208, 111, 0.45)'],
    sparkColors: ['rgba(253, 230, 138, 0.7)', 'rgba(255, 255, 255, 0.5)'],
  },
  'blossom-tet': {
    leafColors: ['rgba(251, 191, 36, 0.65)', 'rgba(244, 114, 182, 0.55)'],
    sparkColors: ['rgba(254, 240, 138, 0.75)'],
  },
  'petals-pink': {
    leafColors: ['rgba(249, 168, 212, 0.6)', 'rgba(253, 224, 71, 0.45)'],
    sparkColors: ['rgba(255, 255, 255, 0.65)'],
  },
  'confetti-festive': {
    leafColors: ['rgba(59, 130, 246, 0.55)', 'rgba(239, 68, 68, 0.55)', 'rgba(234, 179, 8, 0.6)'],
    sparkColors: ['rgba(255, 255, 255, 0.7)'],
  },
};

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    const palette = THEME_PALETTES[theme];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(42, Math.max(22, Math.floor(window.innerWidth / 34)));
    const particles: Particle[] = Array.from({ length: count }, () => {
      const isLeaf = Math.random() > 0.42;
      const colors = isLeaf ? palette.leafColors : palette.sparkColors;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isLeaf ? 7 + Math.random() * 9 : 1.5 + Math.random() * 2.5,
        speedY: isLeaf ? 0.35 + Math.random() * 0.65 : 0.2 + Math.random() * 0.4,
        speedX: (Math.random() - 0.5) * 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        opacity: 0.25 + Math.random() * 0.55,
        kind: isLeaf ? 'leaf' : 'spark',
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const drawBambooLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.48, 0, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.48, 0, 0, -p.size);
      ctx.fill();
      ctx.restore();
    };

    const drawSpark = (p: Particle) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.012) * 0.25;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        if (p.kind === 'leaf') {
          drawBambooLeaf(p);
        } else {
          drawSpark(p);
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
};
