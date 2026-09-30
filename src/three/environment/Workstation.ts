import * as THREE from 'three';

const DESK_SURFACE_COLOR = 0x090b10;
const DESK_FRAME_COLOR = 0x161822;
const SCREEN_BEZEL_COLOR = 0x050608;
const LAPTOP_CHASSIS_COLOR = 0x1b1f2b;

export interface ProjectData {
  id: string;
  name: string;
  company: string;
  category: string;
  problem: string;
  solution: string;
  tech: string[];
  role: string;
  impact: string;
}

export const RESUME_PROFILE = {
  name: 'Shubham Kashyap',
  title: 'Senior Software Engineer',
  experience: '6+ Years Experience',
  companies: '4 Companies',
  appsShipped: '14+ Production Applications Shipped',
  email: 'shubhamkashyap3026@gmail.com',
  phone: '+91 7087312507',
  summary:
    'Software engineer with 6+ years of experience designing high-scale search and API systems in Node.js and NestJS — including an Elasticsearch overhaul that cut asset retrieval time 60% and reduced unanswered search queries 75%. Ships production frontend in React/Next.js and Angular, recently owning a real-time platform through peak FIFA World Cup traffic.',
  coreSkills: [
    'TypeScript',
    'Node.js',
    'NestJS',
    'Next.js',
    'React.js',
    'Elasticsearch',
    'AWS (Lambda, S3, SQS)',
    'PostgreSQL',
    'Docker',
    'AI / RAG Pipelines',
  ],
};

export const PROJECTS: ProjectData[] = [
  {
    id: 'goatzone',
    name: 'Goatzone — FIFA World Cup Platform',
    company: 'Trigma Solutions Pvt Ltd (Mar 2026 – Present)',
    category: 'High-Throughput Real-Time Systems',
    problem:
      'Extreme live knockout traffic spikes during the FIFA World Cup and a 24-zone betting exposure gap where users could enter up to 18 zones simultaneously.',
    solution:
      'Engineered and launched platform in a ~6-week deadline; integrated Sportradar feeds, established entry limits to eliminate exposure gaps, and stabilized live settlement pipelines.',
    tech: ['Node.js', 'Redis', 'WebSockets', 'Sportradar API', 'AWS EC2', 'Docker'],
    role: 'Sr. Full Stack Developer',
    impact: 'Zero settlement failures during peak World Cup knockout stages, eliminated platform risk across 24 zones.',
  },
  {
    id: 'sparkfive',
    name: 'SparkFive — Enterprise DAM Platform',
    company: 'VT Netzwelt Pvt Ltd (Oct 2022 – Jan 2025)',
    category: 'Large-Scale Search & Media Ingestion',
    problem:
      'Sluggish asset retrieval across millions of enterprise files, 75% unanswered search queries, and >1GB media uploads stalling for over 90 seconds.',
    solution:
      'Architected new Elasticsearch indexing and query optimization strategy; designed an asynchronous S3 multipart pipeline using AWS Lambda + SQS.',
    tech: ['Elasticsearch', 'Node.js', 'React.js', 'AWS Lambda', 'AWS S3', 'AWS SQS'],
    role: 'Software Engineer (Architecture Lead)',
    impact: 'Cut asset retrieval time 60%, reduced unanswered searches 75%, and slashed >1GB upload time from 90s to 8–10s.',
  },
  {
    id: 'forvia',
    name: 'Forvia — AI Collaborative Car Design',
    company: 'Programming.com LLP (Mar 2025 – Jan 2026)',
    category: 'Real-Time Collaborative AI Canvas',
    problem:
      'Inherited complex AI-generated codebase with degraded Core Web Vitals (LCP, FID) and high onboarding friction in multi-user real-time canvas interactions.',
    solution:
      'Stabilized userflows across real-time design canvases using Next.js, Tldraw, and TypeScript; applied code-splitting, lazy loading, and mentored junior engineers.',
    tech: ['Next.js', 'TypeScript', 'Tldraw', 'React', 'Tailwind', 'AI Pipelines'],
    role: 'Sr. Software Developer',
    impact: 'Cut onboarding friction ~20%, optimized Core Web Vitals to green scores, and stabilized real-time multi-user design sessions.',
  },
  {
    id: 'clickroof',
    name: 'ClickRoof — One-Click Roofing SaaS',
    company: 'VT Netzwelt Pvt Ltd (Oct 2022 – Jan 2025)',
    category: 'Modular Enterprise SaaS & Automation',
    problem:
      'Manual operational overhead in roofing contractor workflows and recurring API-level production errors under growing customer load.',
    solution:
      'Architected modular NestJS backend services with robust validation, clean architecture, and built a centralized administrative operations suite.',
    tech: ['NestJS', 'Next.js', 'TypeScript', 'MySQL', 'Docker', 'REST APIs'],
    role: 'Full Lifecycle Software Engineer',
    impact: 'Reduced API-related production issues 30% and cut manual operational effort 25–30%.',
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

    // Monitor 2 (Right - Architecture & Project Preview)
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
    ctx.fillRect(16, 8, 260, 34);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(16, 40, 260, 2);

    ctx.font = 'bold 18px "Roboto Mono", monospace';
    ctx.fillStyle = '#ffffff';

    const proj = PROJECTS[this.currentProjectIndex];
    ctx.fillText(`${proj.id}.service.ts`, 36, 30);

    // Realistic production code matching Shubham's actual stack
    const codeLines = [
      { num: '01', tokens: [{ text: 'import', col: '#c084fc' }, { text: ' { Injectable, Logger } ', col: '#e2e8f0' }, { text: 'from', col: '#c084fc' }, { text: ' "@nestjs/common";', col: '#38bdf8' }] },
      { num: '02', tokens: [{ text: 'import', col: '#c084fc' }, { text: ' { ElasticsearchService } ', col: '#e2e8f0' }, { text: 'from', col: '#c084fc' }, { text: ' "@nestjs/elasticsearch";', col: '#38bdf8' }] },
      { num: '03', tokens: [] },
      { num: '04', tokens: [{ text: '@Injectable()', col: '#facc15' }] },
      { num: '05', tokens: [{ text: 'export class ', col: '#60a5fa' }, { text: 'HighScaleSearchEngine ', col: '#facc15' }, { text: '{', col: '#e2e8f0' }] },
      { num: '06', tokens: [{ text: '  constructor(private readonly es: ElasticsearchService) {}', col: '#94a3b8' }] },
      { num: '07', tokens: [] },
      { num: '08', tokens: [{ text: '  async executeOptimizedSearch', col: '#38bdf8' }, { text: '(query: ', col: '#e2e8f0' }, { text: 'SearchPayload', col: '#facc15' }, { text: ') {', col: '#e2e8f0' }] },
      { num: '09', tokens: [{ text: '    // 60% faster asset retrieval + 75% query miss reduction', col: '#4ade80' }] },
      { num: '10', tokens: [{ text: '    return await this.es.search({ index: "dam_assets_v2", query });', col: '#e2e8f0' }] },
      { num: '11', tokens: [{ text: '  }', col: '#e2e8f0' }] },
      { num: '12', tokens: [{ text: '}', col: '#e2e8f0' }] },
    ];

    ctx.font = '20px "Roboto Mono", monospace';
    const startY = 96;
    codeLines.forEach((line, index) => {
      const y = startY + index * 38;
      ctx.fillStyle = '#334155';
      ctx.fillText(line.num, 24, y);

      let currentX = 84;
      line.tokens.forEach(token => {
        ctx.fillStyle = token.col;
        ctx.fillText(token.text, currentX, y);
        currentX += ctx.measureText(token.text).width;
      });

      if (line.num === '10' && showCursor) {
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
    ctx.fillText(`PRODUCTION SYSTEM [${this.currentProjectIndex + 1}/${PROJECTS.length}] // ${proj.name}`, 36, 30);

    if (this.currentProjectIndex === 0) {
      // --- Goatzone: FIFA Real-Time Odds & Exposure Matrix ---
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;

      // Real-time Match & Exposure Dashboard
      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(80, 90, 400, 150);
      ctx.strokeRect(80, 90, 400, 150);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('FIFA WORLD CUP LIVE FEED', 100, 130);
      ctx.fillStyle = '#4ade80';
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillText('● Sportradar Stream: ACTIVE', 100, 165);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Latency: 14ms | Knockout Phase', 100, 195);

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(520, 90, 420, 150);
      ctx.strokeRect(520, 90, 420, 150);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('24-ZONE BETTING RISK CONTROLS', 540, 130);
      ctx.fillStyle = '#f87171';
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillText('Exposure Gap: RESOLVED (Max 18 limits)', 540, 165);
      ctx.fillStyle = '#4ade80';
      ctx.fillText('Settlement Integrity: 100.0%', 540, 195);

      // Real-time Traffic Graph
      ctx.fillStyle = '#0a1324';
      ctx.fillRect(80, 265, 860, 165);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(80, 265, 860, 165);

      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      for (let i = 0; i < 28; i++) {
        const x = 110 + i * 29;
        const y = 370 - Math.abs(Math.sin(i * 0.4 + this.animTimer)) * 80;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '13px "Roboto Mono", monospace';
      ctx.fillText('PEAK KNOCKOUT STAGE TRAFFIC — ZERO DROPPED BETS', 100, 295);
    } else if (this.currentProjectIndex === 1) {
      // --- SparkFive: Elasticsearch & AWS Lambda S3 Architecture ---
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      // Node 1: S3 Upload Pipeline
      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(80, 120, 240, 130);
      ctx.strokeRect(80, 120, 240, 130);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 15px "Roboto Mono", monospace';
      ctx.fillText('AWS S3 + SQS', 100, 160);
      ctx.fillStyle = '#4ade80';
      ctx.font = '13px "Roboto Mono", monospace';
      ctx.fillText('Parallel Lambda Ingestion', 100, 190);
      ctx.fillText('>1GB: 90s → 8-10s', 100, 215);

      // Connecting Arrow
      ctx.beginPath();
      ctx.moveTo(320, 185);
      ctx.lineTo(440, 185);
      ctx.stroke();

      // Node 2: Central Elasticsearch Cluster
      ctx.fillStyle = '#102847';
      ctx.fillRect(440, 100, 280, 170);
      ctx.strokeRect(440, 100, 280, 170);
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('ELASTICSEARCH V2', 460, 145);
      ctx.fillStyle = '#4ade80';
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillText('Retrieval: -60% Latency', 460, 180);
      ctx.fillText('Zero-Results: -75% Drop', 460, 210);

      // Node 3: React DAM Client
      ctx.beginPath();
      ctx.moveTo(720, 185);
      ctx.lineTo(820, 185);
      ctx.stroke();

      ctx.fillStyle = '#0e1e38';
      ctx.fillRect(820, 120, 140, 130);
      ctx.strokeRect(820, 120, 140, 130);
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 14px "Roboto Mono", monospace';
      ctx.fillText('REACT DAM', 835, 165);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Roboto Mono", monospace';
      ctx.fillText('Fast Filtering', 835, 195);
    } else if (this.currentProjectIndex === 2) {
      // --- Forvia: Real-Time Collaborative Canvas ---
      ctx.fillStyle = '#0a1224';
      ctx.fillRect(80, 100, 864, 320);
      ctx.strokeStyle = '#22d3ee';
      ctx.strokeRect(80, 100, 864, 320);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('FORVIA // TLDRW REAL-TIME MULTI-USER CAR DESIGN', 110, 145);

      // Simulated multi-cursor design wires
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(180, 180, 240, 140);
      ctx.strokeStyle = '#22c55e';
      ctx.strokeRect(480, 180, 280, 140);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillText('Chassis Aerodynamics', 200, 240);
      ctx.fillText('AI Generative Specs', 500, 240);

      ctx.fillStyle = '#f43f5e';
      ctx.fillText('▲ User_01 (Paris)', 240, 170);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('▲ Shubham (Mohali)', 540, 170);
    } else {
      // --- ClickRoof: NestJS Modular Microservices ---
      ctx.fillStyle = '#0a1224';
      ctx.fillRect(80, 100, 864, 320);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(80, 100, 864, 320);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px "Roboto Mono", monospace';
      ctx.fillText('CLICKROOF // NESTJS MODULAR ROOFING ARCHITECTURE', 110, 145);

      const modules = ['CONTRACTOR_SRV', 'ESTIMATION_ENGINE', 'ADMIN_PORTAL', 'PAYMENT_GATEWAY'];
      modules.forEach((mod, idx) => {
        const x = 110 + idx * 205;
        ctx.fillStyle = '#101a32';
        ctx.fillRect(x, 190, 180, 90);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(x, 190, 180, 90);
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 13px "Roboto Mono", monospace';
        ctx.fillText(mod, x + 15, 240);
      });
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
    ctx.fillText('shubham@workstation — prod-cluster', 16, 18);

    const proj = PROJECTS[this.currentProjectIndex];
    const logs = [
      `$ git status — ${proj.id}`,
      `Org: ${proj.company.split('(')[0].trim()}`,
      `Role: ${proj.role}`,
      `Stack: ${proj.tech.slice(0, 4).join(', ')}`,
      'Status: 100% Verified in Production',
    ];

    ctx.font = '14px "Roboto Mono", monospace';
    logs.forEach((log, i) => {
      ctx.fillStyle = log.startsWith('$') ? '#38bdf8' : (log.includes('Verified') ? '#4ade80' : '#cbd5e1');
      ctx.fillText(log, 16, 58 + i * 36);
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
