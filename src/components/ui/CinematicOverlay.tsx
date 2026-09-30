'use client';

import { PROJECTS, RESUME_PROFILE } from '@/three/environment/Workstation';
import styles from './CinematicOverlay.module.css';

interface CinematicOverlayProps {
  progress: number;
  selectedProject: number;
  onSelectProject: (index: number) => void;
}

export default function CinematicOverlay({
  progress,
  selectedProject,
  onSelectProject,
}: CinematicOverlayProps) {
  const isScene03 = progress >= 0.58;
  const isScene02 = progress >= 0.38 && progress < 0.58;
  const progressPercent = Math.round(progress * 100);

  // Auto-calculate project index dynamically based on scroll distance in Scene 03
  let activeProjectIndex = selectedProject;
  if (isScene03) {
    const projectSlice = Math.max(0, Math.min(0.999, (progress - 0.58) / 0.42));
    activeProjectIndex = Math.min(
      PROJECTS.length - 1,
      Math.floor(projectSlice * PROJECTS.length)
    );
  }

  const currentProject = PROJECTS[activeProjectIndex] || PROJECTS[0];

  return (
    <div className={styles.overlay}>
      {/* Top HUD Header */}
      <header className={styles.header}>
        <div className={styles.systemBadge}>
          <span className={styles.statusDot} />
          <span>System Active</span>
        </div>

        <div className={styles.titleGroup}>
          <h1 className={styles.developerName}>{RESUME_PROFILE.name}</h1>
          <p className={styles.developerRole}>
            {RESUME_PROFILE.title} • {RESUME_PROFILE.experience}
          </p>
        </div>

        <div className={styles.sceneTracker}>
          {isScene03
            ? `SCENE 03 // PROJECTS [${activeProjectIndex + 1}/${PROJECTS.length}]`
            : isScene02
            ? 'SCENE 02 // MOVING TO WORK'
            : 'SCENE 01 // SANCTUARY'}
        </div>
      </header>

      {/* Main Narrative Card or Scene 03 Project Showcase Card */}
      <div className={styles.narrativeContainer}>
        {isScene03 ? (
          <div className={styles.projectCard}>
            {/* Project Selection Tabs */}
            <div className={styles.projectTabs}>
              {PROJECTS.map((proj, idx) => (
                <button
                  key={proj.id}
                  className={`${styles.projectTab} ${
                    idx === activeProjectIndex ? styles.projectTabActive : ''
                  }`}
                  onClick={() => onSelectProject(idx)}
                >
                  {`0${idx + 1} ${proj.id.toUpperCase()}`}
                </button>
              ))}
            </div>

            <div className={styles.projectCategory}>{currentProject.category}</div>
            <h2 className={styles.projectName}>{currentProject.name}</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
              {currentProject.company}
            </div>

            <div className={styles.projectGrid}>
              <div className={styles.projectField}>
                <span className={styles.fieldLabel}>Problem</span>
                <p className={styles.fieldContent}>{currentProject.problem}</p>
              </div>

              <div className={styles.projectField}>
                <span className={styles.fieldLabel}>Engineering Solution</span>
                <p className={styles.fieldContent}>{currentProject.solution}</p>
              </div>

              <div className={styles.projectField}>
                <span className={styles.fieldLabel}>Technology Stack</span>
                <div className={styles.techPills}>
                  {currentProject.tech.map((t) => (
                    <span key={t} className={styles.techPill}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.projectMetaRow}>
              <div className={styles.metaItem}>
                <span className={styles.fieldLabel}>Role</span>
                <span className={styles.fieldContent}>{currentProject.role}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.fieldLabel}>Measurable Impact</span>
                <span className={styles.metaHighlight}>{currentProject.impact}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.narrativeCard}>
            <div className={styles.sceneSubtitle}>
              {isScene02 ? 'ACT I // SCENE 02' : 'ACT I // SCENE 01'}
            </div>
            <h2 className={styles.sceneHeadline}>
              {isScene02 ? 'Moving Toward the Work' : 'The Developer at Work'}
            </h2>
            <p className={styles.sceneDescription}>
              {isScene02
                ? 'Standing beside the system, about to walk through real production architectures shipped across FIFA World Cup, Enterprise DAM, and AI platforms.'
                : 'Software engineer with 6+ years of experience designing high-scale search, distributed APIs, and production frontend systems. Focused, comfortable, immersed.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom HUD Footer */}
      <footer className={styles.footer}>
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineLabels}>
            <span>STORY TIMELINE</span>
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
