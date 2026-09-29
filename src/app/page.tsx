'use client';

import { useState, useCallback } from 'react';
import ThreeCanvas from '@/components/three/ThreeCanvas';
import CinematicOverlay from '@/components/ui/CinematicOverlay';
import styles from './page.module.css';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);

  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const handleSelectProject = useCallback((index: number) => {
    setSelectedProject(index);
  }, []);

  return (
    <main className={styles.main}>
      {/* 3D WebGL Canvas Layer */}
      <ThreeCanvas
        onScrollProgress={handleScrollProgress}
        selectedProject={selectedProject}
      />

      {/* Cinematic UI Overlay HUD with Scene 01, 02, and 03 Project Showcase */}
      <CinematicOverlay
        progress={scrollProgress}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
      />

      {/* Virtual Scroll Track driving film timeline */}
      <div className={styles.scrollTrack} aria-hidden="true" />
    </main>
  );
}
