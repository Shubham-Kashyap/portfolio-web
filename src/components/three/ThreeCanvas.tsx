'use client';

import { useEffect, useRef } from 'react';
import SceneManager from '@/three/core/SceneManager';

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the Three.js Scene Manager
    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;

    // Cleanup on unmount
    return () => {
      sceneManager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Behind the UI layer
        pointerEvents: 'none' // Interaction managed explicitly
      }}
    />
  );
}
