import * as THREE from 'three';
import HeroScene from '../scenes/HeroScene';
import CameraDirector from './CameraDirector';
import ScrollTimeline from '../timeline/ScrollTimeline';

export default class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  public heroScene: HeroScene;
  public cameraDirector: CameraDirector;
  public scrollTimeline: ScrollTimeline;

  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver;

  constructor(private container: HTMLDivElement) {
    this.clock = new THREE.Clock();

    // 1. Initialize Three.js Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020307, 0.038);

    // 2. Initialize Camera
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);

    // 3. Initialize High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. Instantiate Scene Graph & Directors
    this.heroScene = new HeroScene();
    this.scene.add(this.heroScene.group);

    this.cameraDirector = new CameraDirector(this.camera);
    this.scrollTimeline = new ScrollTimeline(this.cameraDirector, this.heroScene);

    // 5. Setup Window Resizing
    this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
    this.resizeObserver.observe(container);

    // 6. Start Render Loop
    this.start();
  }

  private onWindowResize(): void {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = Math.max(this.container.clientHeight, 1);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public onScroll(progress: number): void {
    this.scrollTimeline.updateScrollProgress(progress);
  }

  public setProject(index: number): void {
    this.scrollTimeline.setManualProject(index);
  }

  public onPointerMove(normalizedX: number, normalizedY: number): void {
    this.cameraDirector.setPointer(normalizedX, normalizedY);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update scene actors & timeline progression
    this.heroScene.update(deltaTime, elapsedTime);
    this.scrollTimeline.update(deltaTime);
    this.cameraDirector.update(0.06);

    this.renderer.render(this.scene, this.camera);
  };

  public start(): void {
    if (!this.animationFrameId) {
      this.clock.start();
      this.animate();
    }
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public dispose(): void {
    this.stop();
    this.resizeObserver.disconnect();

    this.heroScene.dispose();

    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
