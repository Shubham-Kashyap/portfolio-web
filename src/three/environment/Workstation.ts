import * as THREE from 'three';

const DESK_SURFACE_COLOR = 0x090b10;
const DESK_FRAME_COLOR = 0x161822;
const SCREEN_BEZEL_COLOR = 0x050608;
const LAPTOP_CHASSIS_COLOR = 0x1b1f2b;

export interface ProjectData {
  id: string;
  name: string;
  category: string;
  problem: string;
  solution: string;
  tech: string[];
  role: string;
  impact: string;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 'aether-engine',
    name: 'AETHER ENGINE',
    category: 'Cloud Infrastructure / Distributed Systems',
    problem: 'High cross-region replication latency and inconsistent state synchronization in global microservices.',
    solution: 'Engineered a decentralized edge mesh network utilizing zero-copy protocols and optimistic consensus verification.',
    tech: ['Rust', 'TypeScript', 'gRPC', 'Redis', 'Kafka', 'Docker'],
    role: 'Lead Systems Architect',
    impact: '85% drop in cross-region latency, 1.4M events/sec throughput with 99.999% uptime.',
  },
  {
    id: 'synapse-ai',
    name: 'SYNAPSE WORKFLOW OS',
    category: 'Autonomous AI Orchestration',
    problem: 'Multi-agent LLM systems failing unpredictably without verifiable state machines or audit checkpoints.',
    solution: 'Designed a deterministic directed acyclic graph (DAG) runtime with sandboxed execution and self-healing memory pools.',
    tech: ['Next.js', 'TypeScript', 'Python', 'Vector DB', 'PostgreSQL', 'Tailwind'],
    role: 'Full-Stack & AI Engineer',
    impact: '99.4% task completion rate, automating 400+ complex workflows across enterprise pipelines.',
  },
  {
    id: 'nebula-fin',
    name: 'NEBULA TRADING TERMINAL',
    category: 'High-Frequency FinTech Platform',
    problem: 'Laggy charting engines and websocket bottlenecks causing execution slippage during peak market volatility.',
    solution: 'Built a GPU-accelerated WebGL telemetry visualizer and sub-millisecond order execution gateway.',
    tech: ['TypeScript', 'WebGL', 'Three.js', 'WebSockets', 'RxJS', 'Node.js'],
    role: 'Principal Frontend Architect',
    impact: 'Sub-2ms render loop, processing $18M+ in daily transaction volume with zero frame drops.',
  },
];

export default class Workstation {
  public group: THREE.Group;

  private codeScreenMaterial!: THREE.MeshBasicMaterial;
  private archScreenMaterial!: THREE.MeshBasicMaterial;
  private laptopScreenMaterial!: THREE.MeshBasicMaterial;

  private codeCanvas!: HTMLCanvasElement;
  private codeCtx!: CanvasRenderingContext2D;
  private codeTexture!: THREE.CanvasTexture;

  private archCanvas!: HTMLCanvasElement;
  private archCtx!: CanvasRenderingContext2D;
  private archTexture!: THREE.CanvasTexture;

  private laptopCanvas!: HTMLCanvasElement;
  private laptopCtx!: CanvasRenderingContext2D;
  private laptopTexture!: THREE.CanvasTexture;

  private currentProjectIndex = 0;
  private blinkTimer = 0;
  private animTimer = 0;
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group = new THREE.Group();

    this.initScreenCanvases();
    this.buildDesk();
    this.buildMonitors();
    this.buildOpenLaptop();
    this.renderAllScreens(true);

    this.group.position.set(0, 0, -1.05);
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
    this.codeCanvas = document.createElement('canvas');
    this.codeCanvas.width = 1024;
    this.codeCanvas.height = 576;
    this.codeCtx = this.codeCanvas.getContext('2d')!;
    this.codeTexture = new THREE.CanvasTexture(this.codeCanvas);

    this.archCanvas = document.createElement('canvas');
    this.archCanvas.width = 1024;
    this.archCanvas.height = 576;
    this.archCtx = this.archCanvas.getContext('2d')!;
    this.archTexture = new THREE.CanvasTexture(this.archCanvas);

    this.laptopCanvas = document.createElement('canvas');
    this.laptopCanvas.width = 512;
    this.laptopCanvas.height = 320;
    this.laptopCtx = this.laptopCanvas.getContext('2d')!;
    this.laptopTexture = new THREE.CanvasTexture(this.laptopCanvas);

    this.codeScreenMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({ map: this.codeTexture }));
    this.archScreenMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({ map: this.archTexture }));
    this.laptopScreenMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({ map: this.laptopTexture }));
  }

  private buildDesk(): void {
    const topMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_SURFACE_COLOR,
      roughness: 0.25,
      metalness: 0.35,
    }));

    const frameMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_FRAME_COLOR,
      roughness: 0.5,
      metalness: 0.8,
    }));

    const topGeo = this.trackGeometry(new THREE.BoxGeometry(3.8, 0.08, 1.8));
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(0, 0.96, 0);
    this.group.add(top);

    const legGeo = this.trackGeometry(new THREE.BoxGeometry(0.1, 0.96, 1.5));
    const leftLeg = new THREE.Mesh(legGeo, frameMat);
    leftLeg.position.set(-1.75, 0.48, 0);
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, frameMat);
    rightLeg.position.set(1.75, 0.48, 0);
    this.group.add(rightLeg);
  }

  private buildMonitors(): void {
    const bezelMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: SCREEN_BEZEL_COLOR,
      roughness: 0.3,
      metalness: 0.85,
    }));

    const standMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: DESK_FRAME_COLOR,
      roughness: 0.5,
      metalness: 0.8,
    }));

    const monitorWidth = 1.48;
    const monitorHeight = 0.88;
    const monitorDepth = 0.04;

    const screenGeo = this.trackGeometry(new THREE.PlaneGeometry(monitorWidth - 0.04, monitorHeight - 0.04));
    const bodyGeo = this.trackGeometry(new THREE.BoxGeometry(monitorWidth, monitorHeight, monitorDepth));

    // Monitor 1 (Left - Code)
    const mon1Group = new THREE.Group();
    mon1Group.add(new THREE.Mesh(bodyGeo, bezelMat));
    const screen1 = new THREE.Mesh(screenGeo, this.codeScreenMaterial);
    screen1.position.z = monitorDepth / 2 + 0.002;
    mon1Group.add(screen1);
    mon1Group.position.set(-0.82, 1.54, -0.32);
    mon1Group.rotation.y = 0.16;
    this.group.add(mon1Group);

    const stand1 = new THREE.Mesh(this.trackGeometry(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 12)), standMat);
    stand1.position.set(-0.82, 1.25, -0.42);
    this.group.add(stand1);

    // Monitor 2 (Right - Active Project Showcase)
    const mon2Group = new THREE.Group();
    mon2Group.add(new THREE.Mesh(bodyGeo, bezelMat));
    const screen2 = new THREE.Mesh(screenGeo, this.archScreenMaterial);
    screen2.position.z = monitorDepth / 2 + 0.002;
    mon2Group.add(screen2);
    mon2Group.position.set(0.82, 1.54, -0.32);
    mon2Group.rotation.y = -0.16;
    this.group.add(mon2Group);

    const stand2 = new THREE.Mesh(this.trackGeometry(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 12)), standMat);
    stand2.position.set(0.82, 1.25, -0.42);
    this.group.add(stand2);
  }

  private buildOpenLaptop(): void {
    const chassisMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: LAPTOP_CHASSIS_COLOR,
      roughness: 0.35,
      metalness: 0.8,
    }));
    const keybMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x1e2436 }));

    const laptopGroup = new THREE.Group();

    const baseGeo = this.trackGeometry(new THREE.BoxGeometry(0.72, 0.018, 0.48));
    const base = new THREE.Mesh(baseGeo, chassisMat);
    laptopGroup.add(base);

    const kbGeo = this.trackGeometry(new THREE.BoxGeometry(0.64, 0.006, 0.26));
    const kb = new THREE.Mesh(kbGeo, keybMat);
    kb.position.set(0, 0.008, -0.06);
    laptopGroup.add(kb);

    const padGeo = this.trackGeometry(new THREE.BoxGeometry(0.24, 0.004, 0.12));
    const pad = new THREE.Mesh(padGeo, chassisMat);
    pad.position.set(0, 0.007, 0.14);
    laptopGroup.add(pad);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.009, -0.24);

    const lidGeo = this.trackGeometry(new THREE.BoxGeometry(0.72, 0.44, 0.014));
    const lid = new THREE.Mesh(lidGeo, chassisMat);
    lid.position.set(0, 0.22, 0);
    lidGroup.add(lid);

    const lScreenGeo = this.trackGeometry(new THREE.PlaneGeometry(0.68, 0.4));
    const lScreen = new THREE.Mesh(lScreenGeo, this.laptopScreenMaterial);
    lScreen.position.set(0, 0.22, 0.008);
    lidGroup.add(lScreen);

    lidGroup.rotation.x = -0.38;
    laptopGroup.add(lidGroup);

    laptopGroup.position.set(0, 1.01, 0.22);
    this.group.add(laptopGroup);
  }

  public setProject(index: number): void {
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, index));
    if (this.currentProjectIndex !== clamped) {
      this.currentProjectIndex = clamped;
      this.renderAllScreens(true);
    }
  }

  private renderAllScreens(showCursor: boolean): void {
    this.renderCodeScreen(showCursor);
    this.renderProjectShowcaseScreen();
    this.renderLaptopScreen();
  }

  private renderCodeScreen(showCursor: boolean): void {
    const ctx = this.codeCtx;
    ctx.fillStyle = '#080c16';
    ctx.fillRect(0, 0, 1024, 576);

    ctx.fillStyle = '#111726';
    ctx.fillRect(0, 0, 1024, 48);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(16, 8, 240, 34);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(16, 40, 240, 2);

    ctx.font = 'bold 18px "Roboto Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${PROJECTS[this.currentProjectIndex].id}.core.ts`, 36, 30);

    const currentProj = PROJECTS[this.currentProjectIndex];
    const codeLines = [
      { num: '01', tokens: [{ text: 'import', col: '#c084fc' }, { text: ` { ${currentProj.name.replace(/\s+/g, '')} } `, col: '#e2e8f0' }, { text: 'from', col: '#c084fc' }, { text: ' "@/architecture";', col: '#38bdf8' }] },
      { num: '02', tokens: [{ text: 'export class ', col: '#60a5fa' }, { text: 'ProductionPipeline ', col: '#facc15' }, { text: '{', col: '#e2e8f0' }] },
      { num: '03', tokens: [{ text: '  readonly status = ', col: '#60a5fa' }, { text: '"OPERATIONAL";', col: '#4ade80' }] },
      { num: '04', tokens: [{ text: `  readonly impact = "${currentProj.impact.slice(0, 42)}...";`, col: '#94a3b8' }] },
      { num: '05', tokens: [{ text: '  async execute(): Promise<Metrics> {', col: '#e2e8f0' }] },
      { num: '06', tokens: [{ text: '    const nodes = await Mesh.discoverEndpoints();', col: '#94a3b8' }] },
      { num: '07', tokens: [{ text: '    return await this.dispatch(nodes);', col: '#94a3b8' }] },
      { num: '08', tokens: [{ text: '  }', col: '#e2e8f0' }] },
      { num: '09', tokens: [{ text: '}', col: '#e2e8f0' }] },
    ];

    ctx.font = '20px "Roboto Mono", monospace';
    const startY = 96;
    codeLines.forEach((line, index) => {
      const y = startY + index * 40;
      ctx.fillStyle = '#334155';
      ctx.fillText(line.num, 24, y);

      let currentX = 84;
      line.tokens.forEach(token => {
        ctx.fillStyle = token.col;
        ctx.fillText(token.text, currentX, y);
        currentX += ctx.measureText(token.text).width;
      });

      if (line.num === '07' && showCursor) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(currentX + 6, y - 22, 10, 26);
      }
    });

    this.codeTexture.needsUpdate = true;
  }

  private renderProjectShowcaseScreen(): void {
    const ctx = this.archCtx;
    const proj = PROJECTS[this.currentProjectIndex];

    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, 1024, 576);

    // Title Bar with dynamic project name
    ctx.fillStyle = '#0d1527';
    ctx.fillRect(0, 0, 1024, 48);
    ctx.font = 'bold 18px "Roboto Mono", monospace';
    ctx.fillStyle = '#2dd4bf';
    ctx.fillText(`LIVE PROJECT PREVIEW [${this.currentProjectIndex + 1}/3] // ${proj.name}`, 36, 30);

    if (this.currentProjectIndex === 0) {
      // --- Project 1: Cloud Mesh Architecture Network Map ---
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(220, 240);
      ctx.lineTo(512, 240);
      ctx.lineTo(512, 160);
      ctx.lineTo(760, 160);
      ctx.moveTo(512, 240);
      ctx.lineTo(512, 360);
      ctx.lineTo(760, 360);
      ctx.stroke();

      // Nodes
      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(100, 180, 140, 120);
      ctx.strokeRect(100, 180, 140, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Roboto Mono", monospace';
      ctx.fillText('API GATEWAY', 115, 230);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '13px "Roboto Mono", monospace';
      ctx.fillText('Load Balancer', 115, 260);

      ctx.fillStyle = '#102847';
      ctx.fillRect(432, 180, 160, 120);
      ctx.strokeRect(432, 180, 160, 120);
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('[AETHER CORE]', 448, 225);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Roboto Mono", monospace';
      ctx.fillText('Rust / gRPC', 452, 255);

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(740, 100, 160, 110);
      ctx.strokeRect(740, 100, 160, 110);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 15px "Roboto Mono", monospace';
      ctx.fillText('GLOBAL REPLICAS', 755, 145);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Roboto Mono", monospace';
      ctx.fillText('Kafka / Redis', 760, 175);
    } else if (this.currentProjectIndex === 1) {
      // --- Project 2: AI DAG Workflow Engine ---
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;

      // DAG Nodes
      const nodes = [
        { label: 'PROMPT PARSER', x: 120, y: 220, color: '#38bdf8' },
        { label: 'PLANNER AGENT', x: 380, y: 140, color: '#c084fc' },
        { label: 'CODE EXECUTOR', x: 380, y: 300, color: '#4ade80' },
        { label: 'VERIFICATION GATE', x: 680, y: 220, color: '#facc15' },
      ];

      // Draw connecting lines
      ctx.beginPath();
      ctx.moveTo(250, 250);
      ctx.lineTo(380, 170);
      ctx.moveTo(250, 250);
      ctx.lineTo(380, 330);
      ctx.moveTo(510, 170);
      ctx.lineTo(680, 250);
      ctx.moveTo(510, 330);
      ctx.lineTo(680, 250);
      ctx.stroke();

      nodes.forEach(n => {
        ctx.fillStyle = '#111827';
        ctx.fillRect(n.x, n.y, 160, 70);
        ctx.strokeStyle = n.color;
        ctx.strokeRect(n.x, n.y, 160, 70);
        ctx.fillStyle = n.color;
        ctx.font = 'bold 13px "Roboto Mono", monospace';
        ctx.fillText(n.label, n.x + 14, n.y + 40);
      });
    } else {
      // --- Project 3: FinTech GPU Telemetry Terminal ---
      ctx.fillStyle = '#0a1122';
      ctx.fillRect(80, 100, 864, 320);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(80, 100, 864, 320);

      // Candlestick simulated bars
      const candleColors = ['#22c55e', '#ef4444', '#22c55e', '#22c55e', '#ef4444', '#22c55e'];
      for (let i = 0; i < 24; i++) {
        const cx = 120 + i * 34;
        const cy = 240 + Math.sin(i * 0.8 + this.animTimer) * 60;
        const h = 20 + Math.abs(Math.sin(i)) * 40;
        const isUp = i % 3 !== 1;
        ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';
        ctx.fillRect(cx, cy, 18, h);
      }
    }

    // Bottom Metric Strip
    ctx.fillStyle = '#081224';
    ctx.fillRect(40, 460, 944, 70);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(40, 460, 944, 70);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 15px "Roboto Mono", monospace';
    ctx.fillText(`● IMPACT: ${proj.impact}`, 70, 502);

    this.archTexture.needsUpdate = true;
  }

  private renderLaptopScreen(): void {
    const ctx = this.laptopCtx;
    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = '#0f1424';
    ctx.fillRect(0, 0, 512, 28);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Roboto Mono", monospace';
    ctx.fillText('shubham@workstation — prod', 16, 18);

    const logs = [
      `$ inspect ${PROJECTS[this.currentProjectIndex].id}`,
      'Status: Verified Production Deployment',
      `Stack: ${PROJECTS[this.currentProjectIndex].tech.slice(0, 3).join(', ')}`,
      'All health probes passing [200 OK]',
    ];

    ctx.font = '14px "Roboto Mono", monospace';
    logs.forEach((log, i) => {
      ctx.fillStyle = log.startsWith('$') ? '#38bdf8' : (log.includes('Verified') ? '#4ade80' : '#cbd5e1');
      ctx.fillText(log, 16, 64 + i * 38);
    });

    this.laptopTexture.needsUpdate = true;
  }

  public update(deltaTime: number): void {
    this.blinkTimer += deltaTime;
    this.animTimer += deltaTime * 2;
    if (this.blinkTimer > 0.55) {
      this.blinkTimer = 0;
      this.renderAllScreens(Math.random() > 0.35);
    }
  }

  public dispose(): void {
    this.codeTexture.dispose();
    this.archTexture.dispose();
    this.laptopTexture.dispose();

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
