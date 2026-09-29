import * as THREE from 'three';
import StylizedProtagonist from '../characters/StylizedProtagonist';
import Workstation from '../environment/Workstation';
import CitySkyline from '../environment/CitySkyline';

export default class HeroScene {
  public group: THREE.Group;

  public protagonist: StylizedProtagonist;
  public workstation: Workstation;
  public citySkyline: CitySkyline;

  private monitorLeftLight!: THREE.PointLight;
  private monitorRightLight!: THREE.PointLight;
  private rimLight!: THREE.DirectionalLight;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Instantiate Core Actors and Environment
    this.protagonist = new StylizedProtagonist();
    this.workstation = new Workstation();
    this.citySkyline = new CitySkyline();

    this.group.add(this.citySkyline.group);
    this.group.add(this.workstation.group);
    this.group.add(this.protagonist.group);

    // 2. Build Room Architecture & Floor
    this.buildRoom();

    // 3. Establish Cinematic Lighting
    this.setupLighting();
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private buildRoom(): void {
    // Dark reflective tech floor
    const floorGeo = this.trackGeometry(new THREE.PlaneGeometry(32, 32));
    const floorMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x030408,
      roughness: 0.65,
      metalness: 0.3,
    }));
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.group.add(floor);

    // Subtle technical grid overlay
    const grid = new THREE.GridHelper(32, 32, 0x1d2440, 0x090e1a);
    grid.position.y = 0.005;
    this.group.add(grid);

    // Architectural Window Frame & Mullions at the room boundary (Z: -6)
    const frameMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x0b0d14,
      roughness: 0.4,
      metalness: 0.7,
    }));

    // Horizontal window sill / transom
    const transomGeo = this.trackGeometry(new THREE.BoxGeometry(24, 0.15, 0.2));
    const bottomSill = new THREE.Mesh(transomGeo, frameMat);
    bottomSill.position.set(0, 0.1, -6);
    this.group.add(bottomSill);

    const topHeader = new THREE.Mesh(transomGeo, frameMat);
    topHeader.position.set(0, 6.5, -6);
    this.group.add(topHeader);

    // Vertical structural mullions
    const mullionGeo = this.trackGeometry(new THREE.BoxGeometry(0.18, 6.5, 0.2));
    const mullionPositions = [-7, -3.5, 0, 3.5, 7];
    mullionPositions.forEach(x => {
      const mullion = new THREE.Mesh(mullionGeo, frameMat);
      mullion.position.set(x, 3.3, -6);
      this.group.add(mullion);
    });
  }

  private setupLighting(): void {
    // Deep midnight ambient fill
    const ambientLight = new THREE.AmbientLight(0x0e1428, 0.75);
    this.group.add(ambientLight);

    // Key soft directional light from high front-right
    const keyLight = new THREE.DirectionalLight(0x94a3b8, 0.8);
    keyLight.position.set(4, 8, 4);
    this.group.add(keyLight);

    // Purple/Magenta rim light behind the developer for silhouette separation
    this.rimLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
    this.rimLight.position.set(-2, 4, -4);
    this.group.add(this.rimLight);

    // Monitor screen glows (simulating light emission onto character & keyboard)
    this.monitorLeftLight = new THREE.PointLight(0x38bdf8, 1.6, 3.5, 1.8);
    this.monitorLeftLight.position.set(-0.8, 1.5, -1.0);
    this.group.add(this.monitorLeftLight);

    this.monitorRightLight = new THREE.PointLight(0x818cf8, 1.4, 3.5, 1.8);
    this.monitorRightLight.position.set(0.8, 1.5, -1.0);
    this.group.add(this.monitorRightLight);
  }

  public update(deltaTime: number, elapsedTime: number): void {
    this.protagonist.updateIdle(elapsedTime);
    this.workstation.update(deltaTime);
  }

  /**
   * Orchestrates scene elements according to scroll progression [0..1]
   */
  public setTimelineProgress(progress: number): void {
    // 1. Lower coffee mug naturally toward the desk
    this.protagonist.setCoffeeProgress(progress * 1.5);

    // 2. Direct protagonist's attention toward active workstation
    this.protagonist.setHeadAttention(progress);

    // 3. Modulate monitor light intensities as workstation activates
    const intensityMultiplier = 1.0 + progress * 0.8;
    this.monitorLeftLight.intensity = 1.6 * intensityMultiplier;
    this.monitorRightLight.intensity = 1.4 * intensityMultiplier;
  }

  public dispose(): void {
    this.protagonist.dispose();
    this.workstation.dispose();
    this.citySkyline.dispose();

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
