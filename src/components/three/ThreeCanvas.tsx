'use client';

import { useEffect, useRef } from 'react';
import SceneManager from '@/three/core/SceneManager';

interface ThreeCanvasProps {
  onScrollProgress?: (progress: number) => void;
}

export default function ThreeCanvas({ onScrollProgress }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize SceneManager
    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      
      sceneManager.onScroll(progress);
      if (onScrollProgress) {
        onScrollProgress(progress);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneManager.onPointerMove(normX, normY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      sceneManager.dispose();
      sceneManagerRef.current = null;
    };
  }, [onScrollProgress]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
