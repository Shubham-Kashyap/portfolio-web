import CameraDirector from '../core/CameraDirector';
import HeroScene from '../scenes/HeroScene';

export default class ScrollTimeline {
  private currentProgress = 0;
  private targetProgress = 0;
  private activeProject = 0;

  constructor(
    private cameraDirector: CameraDirector,
    private heroScene: HeroScene
  ) {}

  public updateScrollProgress(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  public setManualProject(index: number): void {
    this.activeProject = index;
    this.heroScene.setProject(index);
  }

  public update(deltaTime: number): void {
    const damping = Math.min(deltaTime * 8, 1);
    this.currentProgress += (this.targetProgress - this.currentProgress) * damping;

    this.cameraDirector.setScrollProgress(this.currentProgress);
    this.heroScene.setTimelineProgress(this.currentProgress);

    // Auto-switch project on the workstation monitor when scrolling through Scene 03
    if (this.currentProgress >= 0.60) {
      const projectSlice = (this.currentProgress - 0.60) / 0.40;
      let projectIndex = 0;
      if (projectSlice >= 0.66) {
        projectIndex = 2;
      } else if (projectSlice >= 0.33) {
        projectIndex = 1;
      }

      if (projectIndex !== this.activeProject) {
        this.activeProject = projectIndex;
        this.heroScene.setProject(projectIndex);
      }
    }
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public getActiveProject(): number {
    return this.activeProject;
  }
}
