import * as THREE from 'three';

export default class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver;

  constructor(private container: HTMLDivElement) {
    // 1. Initialize Scene
    this.scene = new THREE.Scene();
    
    // Ambient background is handled by CSS, so we can make the scene transparent
    // Or set a solid color if we prefer
    
    // 2. Initialize Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 20); // Initial fallback position

    // 3. Initialize Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Allow CSS background to show through
      powerPreference: 'high-performance',
    });
    
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    container.appendChild(this.renderer.domElement);

    // 4. Handle Resizing
    this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
    this.resizeObserver.observe(container);

    // 5. Start Animation Loop
    this.start();
  }

  private onWindowResize() {
    if (!this.container) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Update scene animations here (e.g., via GSAP tick or TWEEN)
    
    this.renderer.render(this.scene, this.camera);
  };

  public start() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public dispose() {
    this.stop();
    this.resizeObserver.disconnect();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
