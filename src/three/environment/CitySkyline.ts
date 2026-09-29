import * as THREE from 'three';

const CITY_BASE_Z = -22;
const BUILDING_COLOR = 0x070912;
const WINDOW_COLORS = [0x4361ee, 0x3a0ca3, 0x4cc9f0, 0x7209b7, 0xf72585];

export default class CitySkyline {
  public group: THREE.Group;
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildCity();
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private buildCity(): void {
    const buildingMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: BUILDING_COLOR,
      roughness: 0.9,
      metalness: 0.1,
    }));

    // Create a cluster of 30 stylized skyscraper silhouettes
    const buildingCount = 28;
    for (let i = 0; i < buildingCount; i++) {
      const width = THREE.MathUtils.randFloat(1.2, 3.2);
      const height = THREE.MathUtils.randFloat(6, 18);
      const depth = THREE.MathUtils.randFloat(1.5, 3.5);

      const posX = (i - buildingCount / 2) * 2.2 + THREE.MathUtils.randFloatSpread(1.2);
      const posZ = CITY_BASE_Z + THREE.MathUtils.randFloatSpread(6);
      const posY = height / 2 - 3;

      const boxGeo = this.trackGeometry(new THREE.BoxGeometry(width, height, depth));
      const building = new THREE.Mesh(boxGeo, buildingMat);
      building.position.set(posX, posY, posZ);
      this.group.add(building);

      // Add architectural beacon or antenna on select high-rises
      if (height > 12) {
        this.addRooftopAntenna(posX, posY + height / 2, posZ);
      }

      // Add luminous window grids on building fronts
      this.addLuminousWindows(posX, posY, posZ + depth / 2 + 0.02, width, height);
    }
  }

  private addRooftopAntenna(x: number, y: number, z: number): void {
    const antennaGeo = this.trackGeometry(new THREE.CylinderGeometry(0.02, 0.04, 2.5, 6));
    const antennaMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x4f46e5 }));
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(x, y + 1.25, z);
    this.group.add(antenna);

    // Blinking warning light at apex
    const beaconGeo = this.trackGeometry(new THREE.SphereGeometry(0.08, 8, 8));
    const beaconMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0xff0055 }));
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(x, y + 2.5, z);
    this.group.add(beacon);
  }

  private addLuminousWindows(x: number, y: number, z: number, width: number, height: number): void {
    const cols = Math.floor(width / 0.4);
    const rows = Math.floor(height / 0.8);
    if (cols < 2 || rows < 3) return;

    // Use small instanced planes or clusters for distinct architectural windows
    const windowGeo = this.trackGeometry(new THREE.PlaneGeometry(0.18, 0.28));
    
    for (let r = 0; r < rows; r++) {
      // Skip random floors for realistic occupancy patterns
      if (Math.random() < 0.35) continue;

      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.4) continue;

        const colorIndex = Math.floor(Math.random() * WINDOW_COLORS.length);
        const winMat = this.trackMaterial(new THREE.MeshBasicMaterial({
          color: WINDOW_COLORS[colorIndex],
          transparent: true,
          opacity: THREE.MathUtils.randFloat(0.35, 0.85),
        }));

        const win = new THREE.Mesh(windowGeo, winMat);
        const winX = x - width / 2 + (c + 0.5) * (width / cols);
        const winY = y - height / 2 + (r + 0.5) * (height / rows);
        win.position.set(winX, winY, z);
        this.group.add(win);
      }
    }
  }

  public dispose(): void {
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
