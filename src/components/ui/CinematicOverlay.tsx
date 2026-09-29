'use client';

import styles from './CinematicOverlay.module.css';

interface CinematicOverlayProps {
  progress: number;
}

export default function CinematicOverlay({ progress }: CinematicOverlayProps) {
  const isTransitionPhase = progress >= 0.45;
  const progressPercent = Math.round(progress * 100);

  return (
    <div className={styles.overlay}>
      {/* Top HUD Header */}
      <header className={styles.header}>
        <div className={styles.systemBadge}>
          <span className={styles.statusDot} />
          <span>System Active</span>
        </div>

        <div className={styles.titleGroup}>
          <h1 className={styles.developerName}>Shubham Kashyap</h1>
          <p className={styles.developerRole}>Software Engineer & Architect</p>
        </div>

        <div className={styles.sceneTracker}>
          {isTransitionPhase ? 'SCENE 02 // APPROACH' : 'SCENE 01 // SANCTUARY'}
        </div>
      </header>

      {/* Center-Left Narrative Card */}
      <div className={styles.narrativeContainer}>
        <div className={styles.narrativeCard}>
          <div className={styles.sceneSubtitle}>
            {isTransitionPhase ? 'ACT I // TRANSITION 01' : 'ACT I // SCENE 01'}
          </div>
          <h2 className={styles.sceneHeadline}>
            {isTransitionPhase ? 'Approaching the Work' : 'The Developer at Work'}
          </h2>
          <p className={styles.sceneDescription}>
            {isTransitionPhase
              ? 'The monitors illuminate with active code. Every system, architecture, and interface begins with focused intent.'
              : 'In the quiet nocturnal hum of the workspace, complexity turns into architecture. Focused, comfortable, immersed.'}
          </p>
        </div>
      </div>

      {/* Bottom HUD Footer */}
      <footer className={styles.footer}>
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineLabels}>
            <span>TIMELINE</span>
            <span>{progressPercent}%</span>
          </div>
          <div className={styles.timelineTrack}>
            <div
              className={styles.timelineFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.scrollPrompt}>
          <div className={styles.scrollIcon} />
          <span>Scroll To Advance Film</span>
        </div>
      </footer>
    </div>
  );
}
