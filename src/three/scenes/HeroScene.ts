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
  private laptopLight!: THREE.PointLight;
  private windowKeyLight!: THREE.DirectionalLight;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group = new THREE.Group();

    this.protagonist = new StylizedProtagonist();
    this.workstation = new Workstation();
    this.citySkyline = new CitySkyline();

    this.group.add(this.citySkyline.group);
    this.group.add(this.workstation.group);
    this.group.add(this.protagonist.group);

    this.buildOfficeRoom();
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

  private buildOfficeRoom(): void {
    const floorGeo = this.trackGeometry(new THREE.PlaneGeometry(36, 36));
    const floorMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.35,
      metalness: 0.4,
    }));
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.group.add(floor);

    const grid = new THREE.GridHelper(36, 36, 0x1e2c4f, 0x0b1324);
    grid.position.y = 0.005;
    this.group.add(grid);

    // Panoramic window frame overlooking the city
    const frameMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x141a29,
      roughness: 0.3,
      metalness: 0.8,
    }));

    const transomGeo = this.trackGeometry(new THREE.BoxGeometry(26, 0.14, 0.2));
    const bottomSill = new THREE.Mesh(transomGeo, frameMat);
    bottomSill.position.set(0, 0.1, -6.5);
    this.group.add(bottomSill);

    const topHeader = new THREE.Mesh(transomGeo, frameMat);
    topHeader.position.set(0, 6.8, -6.5);
    this.group.add(topHeader);

    const mullionGeo = this.trackGeometry(new THREE.BoxGeometry(0.16, 6.8, 0.18));
    const mullionPositions = [-7.5, -3.8, 0, 3.8, 7.5];
    mullionPositions.forEach(x => {
      const mullion = new THREE.Mesh(mullionGeo, frameMat);
      mullion.position.set(x, 3.4, -6.5);
      this.group.add(mullion);
    });
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0x1a263d, 0.85);
    this.group.add(ambientLight);

    this.windowKeyLight = new THREE.DirectionalLight(0xbde0fe, 1.4);
    this.windowKeyLight.position.set(2, 6, -6);
    this.group.add(this.windowKeyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.9);
    rimLight.position.set(-4, 4, 3);
    this.group.add(rimLight);

    this.monitorLeftLight = new THREE.PointLight(0x38bdf8, 1.4, 3.2, 1.8);
    this.monitorLeftLight.position.set(-0.82, 1.55, -0.9);
    this.group.add(this.monitorLeftLight);

    this.monitorRightLight = new THREE.PointLight(0x2dd4bf, 1.3, 3.2, 1.8);
    this.monitorRightLight.position.set(0.82, 1.55, -0.9);
    this.group.add(this.monitorRightLight);

    this.laptopLight = new THREE.PointLight(0x93c5fd, 0.9, 1.8, 2.0);
    this.laptopLight.position.set(0, 1.25, -0.65);
    this.group.add(this.laptopLight);
  }

  public update(deltaTime: number, elapsedTime: number): void {
    this.protagonist.updateIdle(elapsedTime);
    this.workstation.update(deltaTime);
    this.citySkyline.update(deltaTime);
  }

  public setProject(index: number): void {
    this.workstation.setProject(index);
  }

  public setTimelineProgress(progress: number): void {
    this.protagonist.setTimelineProgress(progress);

    const intensityMultiplier = 1.0 + progress * 0.7;
    this.monitorLeftLight.intensity = 1.4 * intensityMultiplier;
    this.monitorRightLight.intensity = 1.3 * intensityMultiplier;
    this.laptopLight.intensity = 0.9 * intensityMultiplier;
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
