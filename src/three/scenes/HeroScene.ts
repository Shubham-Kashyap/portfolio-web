import * as THREE from 'three';

export default class HeroScene {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    
    // Build the scene using programmatic geometry as a placeholder for Phase 1
    this.buildWorkstation();
    this.buildProtagonist();
    this.buildEnvironment();
  }

  private buildWorkstation() {
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.8 });
    const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(0, 1, -1);
    this.group.add(desk);

    // Dual Monitors
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x050505, emissive: 0x0a1020, roughness: 0.2 });
    const screenGeo = new THREE.BoxGeometry(1.6, 0.9, 0.05);
    
    const monitor1 = new THREE.Mesh(screenGeo, monitorMat);
    monitor1.position.set(-0.85, 1.6, -1.2);
    monitor1.rotation.y = Math.PI / 12;
    this.group.add(monitor1);

    const monitor2 = new THREE.Mesh(screenGeo, monitorMat);
    monitor2.position.set(0.85, 1.6, -1.2);
    monitor2.rotation.y = -Math.PI / 12;
    this.group.add(monitor2);
  }

  private buildProtagonist() {
    // Highly stylized programmatic placeholder for the protagonist
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.6 });
    
    const torsoGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.set(0, 1.2, 0.2); // Seated position
    this.group.add(torso);

    const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xcc9988, roughness: 0.5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.8, 0.2);
    this.group.add(head);

    // Coffee mug (The ONLY one)
    const mugGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(0.4, 1.3, -0.2); // Held in hand near desk
    this.group.add(mug);
  }

  private buildEnvironment() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x020203, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.group.add(floor);

    // Subtle grid helper for technical aesthetic
    const grid = new THREE.GridHelper(20, 20, 0x1a2035, 0x0a0f1a);
    grid.position.y = 0.01;
    this.group.add(grid);
  }

  public update(deltaTime: number) {
    // Add any continuous idle animations here (e.g., subtle breathing)
  }
}
