import * as THREE from 'three';

const DESK_SURFACE_COLOR = 0x0c0e14;
const DESK_FRAME_COLOR = 0x181a24;
const SCREEN_BEZEL_COLOR = 0x07080c;
const KEYBOARD_BASE_COLOR = 0x161822;

export default class Workstation {
  public group: THREE.Group;

  // Screen materials for dynamic intensity transitions
  private codeScreenMaterial!: THREE.MeshBasicMaterial;
  private terminalScreenMaterial!: THREE.MeshBasicMaterial;

  // Offscreen 2D canvases for high-resolution dynamic screen rendering
  private codeCanvas!: HTMLCanvasElement;
  private codeCtx!: CanvasRenderingContext2D;
  private codeTexture!: THREE.CanvasTexture;

  private terminalCanvas!: HTMLCanvasElement;
  private terminalCtx!: CanvasRenderingContext2D;
  private terminalTexture!: THREE.CanvasTexture;

  private blinkTimer = 0;
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group = new THREE.Group();

    this.initScreenCanvases();
    this.buildDesk();
    this.buildMonitors();
    this.buildPeripherals();
    this.renderScreens(true);

    this.group.position.set(0, 0, -1.1);
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private initScreenCanvases(): void {
    // 1024x576 (16:9) crisp offscreen canvases
    this.codeCanvas = document.createElement('canvas');
    this.codeCanvas.width = 1024;
    this.codeCanvas.height = 576;
    this.codeCtx = this.codeCanvas.getContext('2d')!;
    this.codeTexture = new THREE.CanvasTexture(this.codeCanvas);

    this.terminalCanvas = document.createElement('canvas');
    this.terminalCanvas.width = 1024;
    this.terminalCanvas.height = 576;
    this.terminalCtx = this.terminalCanvas.getContext('2d')!;
    this.terminalTexture = new THREE.CanvasTexture(this.terminalCanvas);

    this.codeScreenMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
      map: this.codeTexture,
    }));

    this.terminalScreenMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
      map: this.terminalTexture,
    }));
  }

  private buildDesk(): void {
    const topMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_SURFACE_COLOR,
      roughness: 0.35,
      metalness: 0.2,
    }));

    const frameMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_FRAME_COLOR,
      roughness: 0.6,
      metalness: 0.7,
    }));

    // Main tabletop
    const topGeo = this.trackGeometry(new THREE.BoxGeometry(3.6, 0.08, 1.6));
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(0, 0.96, 0);
    this.group.add(top);

    // Left and right metal legs
    const legGeo = this.trackGeometry(new THREE.BoxGeometry(0.08, 0.96, 1.4));
    
    const leftLeg = new THREE.Mesh(legGeo, frameMat);
    leftLeg.position.set(-1.65, 0.48, 0);
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, frameMat);
    rightLeg.position.set(1.65, 0.48, 0);
    this.group.add(rightLeg);

    // Rear reinforcement crossbar
    const crossbarGeo = this.trackGeometry(new THREE.BoxGeometry(3.2, 0.06, 0.06));
    const crossbar = new THREE.Mesh(crossbarGeo, frameMat);
    crossbar.position.set(0, 0.5, -0.6);
    this.group.add(crossbar);

    // Subtle desk backlight LED strip along the back edge
    const ledGeo = this.trackGeometry(new THREE.BoxGeometry(3.2, 0.02, 0.02));
    const ledMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x4f46e5 }));
    const ledStrip = new THREE.Mesh(ledGeo, ledMat);
    ledStrip.position.set(0, 0.95, -0.79);
    this.group.add(ledStrip);
  }

  private buildMonitors(): void {
    const bezelMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: SCREEN_BEZEL_COLOR,
      roughness: 0.4,
      metalness: 0.8,
    }));

    const standMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_FRAME_COLOR,
      roughness: 0.5,
      metalness: 0.8,
    }));

    const monitorWidth = 1.45;
    const monitorHeight = 0.85;
    const monitorDepth = 0.04;

    const screenGeo = this.trackGeometry(new THREE.PlaneGeometry(monitorWidth - 0.04, monitorHeight - 0.04));
    const bodyGeo = this.trackGeometry(new THREE.BoxGeometry(monitorWidth, monitorHeight, monitorDepth));

    // Monitor 1 (Left - Code Editor)
    const monitor1Group = new THREE.Group();
    const body1 = new THREE.Mesh(bodyGeo, bezelMat);
    monitor1Group.add(body1);

    const screen1 = new THREE.Mesh(screenGeo, this.codeScreenMaterial);
    screen1.position.z = monitorDepth / 2 + 0.002;
    monitor1Group.add(screen1);

    monitor1Group.position.set(-0.78, 1.52, -0.2);
    monitor1Group.rotation.y = 0.18;
    this.group.add(monitor1Group);

    // Monitor 2 (Right - System Dashboard / Preview)
    const monitor2Group = new THREE.Group();
    const body2 = new THREE.Mesh(bodyGeo, bezelMat);
    monitor2Group.add(body2);

    const screen2 = new THREE.Mesh(screenGeo, this.terminalScreenMaterial);
    screen2.position.z = monitorDepth / 2 + 0.002;
    monitor2Group.add(screen2);

    monitor2Group.position.set(0.78, 1.52, -0.2);
    monitor2Group.rotation.y = -0.18;
    this.group.add(monitor2Group);

    // Monitor arms / dual desk mount
    const armGeo = this.trackGeometry(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16));
    const arm = new THREE.Mesh(armGeo, standMat);
    arm.position.set(0, 1.25, -0.4);
    this.group.add(arm);

    const baseMountGeo = this.trackGeometry(new THREE.BoxGeometry(0.25, 0.06, 0.25));
    const baseMount = new THREE.Mesh(baseMountGeo, standMat);
    baseMount.position.set(0, 1.01, -0.4);
    this.group.add(baseMount);
  }

  private buildPeripherals(): void {
    const keyboardMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: KEYBOARD_BASE_COLOR,
      roughness: 0.5,
    }));
    const keyGlowMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x6366f1 }));
    const mouseMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      roughness: 0.3,
    }));

    // Mechanical keyboard body
    const kbGeo = this.trackGeometry(new THREE.BoxGeometry(0.65, 0.02, 0.22));
    const keyboard = new THREE.Mesh(kbGeo, keyboardMat);
    keyboard.position.set(-0.15, 1.01, 0.25);
    this.group.add(keyboard);

    // Illuminated key row accent
    const keysGeo = this.trackGeometry(new THREE.BoxGeometry(0.6, 0.008, 0.18));
    const keys = new THREE.Mesh(keysGeo, keyGlowMat);
    keys.position.set(-0.15, 1.025, 0.25);
    this.group.add(keys);

    // Precision ergonomics mouse
    const mouseGeo = this.trackGeometry(new THREE.BoxGeometry(0.1, 0.03, 0.16));
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.45, 1.015, 0.25);
    this.group.add(mouse);

    // Extended desk mat
    const matGeo = this.trackGeometry(new THREE.BoxGeometry(1.5, 0.005, 0.55));
    const matMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x08090f,
      roughness: 0.9,
    }));
    const deskMat = new THREE.Mesh(matGeo, matMaterial);
    deskMat.position.set(0.05, 1.002, 0.22);
    this.group.add(deskMat);
  }

  private renderScreens(showCursor: boolean): void {
    // --- Render Screen 1: TypeScript IDE Code Editor ---
    const ctx1 = this.codeCtx;
    ctx1.fillStyle = '#080a12';
    ctx1.fillRect(0, 0, 1024, 576);

    // IDE Header tab bar
    ctx1.fillStyle = '#101322';
    ctx1.fillRect(0, 0, 1024, 46);
    ctx1.fillStyle = '#222744';
    ctx1.fillRect(10, 6, 220, 36);
    ctx1.fillStyle = '#6366f1';
    ctx1.fillRect(10, 40, 220, 3);

    ctx1.font = 'bold 18px "Roboto Mono", monospace';
    ctx1.fillStyle = '#EDEDEF';
    ctx1.fillText('SceneOrchestrator.ts', 24, 28);

    // Code lines with realistic syntax coloring
    const codeLines = [
      { num: '01', tokens: [{ text: 'import', col: '#c084fc' }, { text: ' { Engine, Camera, Timeline } ', col: '#e2e8f0' }, { text: 'from', col: '#c084fc' }, { text: ' "three-cinema";', col: '#38bdf8' }] },
      { num: '02', tokens: [{ text: 'import', col: '#c084fc' }, { text: ' type { StoryState } ', col: '#e2e8f0' }, { text: 'from', col: '#c084fc' }, { text: ' "./types";', col: '#38bdf8' }] },
      { num: '03', tokens: [] },
      { num: '04', tokens: [{ text: 'export class ', col: '#60a5fa' }, { text: 'DeveloperUniverse ', col: '#facc15' }, { text: 'implements ', col: '#c084fc' }, { text: 'StoryState {', col: '#e2e8f0' }] },
      { num: '05', tokens: [{ text: '  private readonly ', col: '#60a5fa' }, { text: 'vision: ', col: '#38bdf8' }, { text: 'string = ', col: '#e2e8f0' }, { text: '"Cinematic Craft";', col: '#4ade80' }] },
      { num: '06', tokens: [{ text: '  public isCrafting: ', col: '#60a5fa' }, { text: 'boolean = ', col: '#e2e8f0' }, { text: 'true;', col: '#f87171' }] },
      { num: '07', tokens: [] },
      { num: '08', tokens: [{ text: '  async onScrollAdvance', col: '#38bdf8' }, { text: '(progress: ', col: '#e2e8f0' }, { text: 'number', col: '#facc15' }, { text: '): Promise<void> {', col: '#e2e8f0' }] },
      { num: '09', tokens: [{ text: '    await this.camera.smoothPush(progress);', col: '#94a3b8' }] },
      { num: '10', tokens: [{ text: '    this.workstation.illuminate(0.95);', col: '#94a3b8' }] },
      { num: '11', tokens: [{ text: '  }', col: '#e2e8f0' }] },
      { num: '12', tokens: [{ text: '}', col: '#e2e8f0' }] },
    ];

    ctx1.font = '20px "Roboto Mono", monospace';
    const startY = 88;
    const lineHeight = 36;

    codeLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      // Line number
      ctx1.fillStyle = '#3b4261';
      ctx1.fillText(line.num, 20, y);

      // Code tokens
      let currentX = 80;
      line.tokens.forEach(token => {
        ctx1.fillStyle = token.col;
        ctx1.fillText(token.text, currentX, y);
        currentX += ctx1.measureText(token.text).width;
      });

      // Cursor at line 10
      if (line.num === '10' && showCursor) {
        ctx1.fillStyle = '#818cf8';
        ctx1.fillRect(currentX + 4, y - 22, 10, 26);
      }
    });

    this.codeTexture.needsUpdate = true;

    // --- Render Screen 2: System Terminal & Health Metrics ---
    const ctx2 = this.terminalCtx;
    ctx2.fillStyle = '#06070c';
    ctx2.fillRect(0, 0, 1024, 576);

    // Terminal header
    ctx2.fillStyle = '#0f121d';
    ctx2.fillRect(0, 0, 1024, 46);
    ctx2.fillStyle = '#f43f5e';
    ctx2.beginPath();
    ctx2.arc(24, 23, 6, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.fillStyle = '#fbbf24';
    ctx2.beginPath();
    ctx2.arc(44, 23, 6, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.fillStyle = '#22c55e';
    ctx2.beginPath();
    ctx2.arc(64, 23, 6, 0, Math.PI * 2);
    ctx2.fill();

    ctx2.font = '16px "Roboto Mono", monospace';
    ctx2.fillStyle = '#64748b';
    ctx2.fillText('build-pipeline — zsh — 80x24', 96, 28);

    // Terminal lines
    const terminalLogs = [
      { tag: '[INFO]', col: '#38bdf8', text: 'Initializing high-fidelity 3D viewport...' },
      { tag: '[OK]', col: '#4ade80', text: 'WebGL 2.0 context compiled (Shader pipeline ready)' },
      { tag: '[PERF]', col: '#818cf8', text: 'Target Framerate: 60fps | VRAM Allocation: 24MB' },
      { tag: '[SYNC]', col: '#facc15', text: 'Scroll-linked timeline listener synchronized' },
      { tag: '[BUILD]', col: '#c084fc', text: 'Projects: 3 loaded, Tech Puzzle: 2 missing slots' },
      { tag: '[STATUS]', col: '#22c55e', text: 'Ready. Waiting for user timeline progression.' },
    ];

    ctx2.font = '19px "Roboto Mono", monospace';
    terminalLogs.forEach((log, i) => {
      const y = startY + i * 44;
      ctx2.fillStyle = log.col;
      ctx2.fillText(log.tag, 24, y);
      ctx2.fillStyle = '#cbd5e1';
      ctx2.fillText(log.text, 140, y);
    });

    // Metric bar at bottom
    ctx2.fillStyle = '#111524';
    ctx2.fillRect(24, 460, 976, 70);
    ctx2.strokeStyle = '#272d4a';
    ctx2.strokeRect(24, 460, 976, 70);

    ctx2.font = 'bold 16px "Roboto Mono", monospace';
    ctx2.fillStyle = '#6366f1';
    ctx2.fillText('● SYSTEM INTEGRITY: 100%', 48, 502);
    ctx2.fillStyle = '#38bdf8';
    ctx2.fillText('MEMORY: OPTIMAL', 360, 502);
    ctx2.fillStyle = '#4ade80';
    ctx2.fillText('STORY ENGINE: ARMED', 660, 502);

    this.terminalTexture.needsUpdate = true;
  }

  public update(deltaTime: number): void {
    this.blinkTimer += deltaTime;
    if (this.blinkTimer > 0.55) {
      this.blinkTimer = 0;
      const showCursor = Math.random() > 0.3;
      this.renderScreens(showCursor);
    }
  }

  public dispose(): void {
    this.codeTexture.dispose();
    this.terminalTexture.dispose();

    for (const geometry of this.geometries) {
      geometry.dispose();
    }
    for (const material of this.materials) {
      material.dispose();
    }
    this.geometries = [];
    this.materials = [];
  }
}
