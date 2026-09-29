import CameraDirector from '../core/CameraDirector';
import HeroScene from '../scenes/HeroScene';

export default class ScrollTimeline {
  private currentProgress = 0;
  private targetProgress = 0;

  constructor(
    private cameraDirector: CameraDirector,
    private heroScene: HeroScene
  ) {}

  /**
   * Updates target scroll progress [0..1]
   */
  public updateScrollProgress(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  /**
   * Called on every animation frame to smoothly interpolate timeline parameters
   * @param deltaTime Elapsed delta time in seconds
   */
  public update(deltaTime: number): void {
    // Smooth lerp damping to eliminate scrollwheel notches
    const damping = Math.min(deltaTime * 8, 1);
    this.currentProgress += (this.targetProgress - this.currentProgress) * damping;

    // Drive camera through shot progression
    this.cameraDirector.setScrollProgress(this.currentProgress);

    // Drive scene actors (coffee lowering, monitor glow, head posture)
    this.heroScene.setTimelineProgress(this.currentProgress);
  }

  public getProgress(): number {
    return this.currentProgress;
  }
}
