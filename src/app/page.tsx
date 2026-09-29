'use client';

import { useState, useCallback } from 'react';
import ThreeCanvas from '@/components/three/ThreeCanvas';
import CinematicOverlay from '@/components/ui/CinematicOverlay';
import styles from './page.module.css';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  return (
    <main className={styles.main}>
      {/* 3D WebGL Canvas Layer */}
      <ThreeCanvas onScrollProgress={handleScrollProgress} />

      {/* Cinematic UI Overlay HUD */}
      <CinematicOverlay progress={scrollProgress} />

      {/* Virtual Scroll Track to drive film timeline */}
      <div className={styles.scrollTrack} aria-hidden="true" />
    </main>
  );
}
