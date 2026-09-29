import * as THREE from 'three';

const CITY_BASE_Z = -24;
const BUILDING_COLOR = 0x060810;
const WINDOW_COLORS = [0x38bdf8, 0x22d3ee, 0x6366f1, 0x818cf8, 0x3b82f6];

export default class CitySkyline {
  public group: THREE.Group;
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private trafficParticles: THREE.Points | null = null;
  private trafficVelocities: Float32Array | null = null;

  constructor() {
    this.group = new THREE.Group();

    this.buildCityBuildings();
    this.buildHighwayTraffic();
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private trackMaterial<T extends THREE.Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private buildCityBuildings(): void {
    const buildingMat = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: BUILDING_COLOR,
      roughness: 0.7,
      metalness: 0.3,
    }));

    const buildingCount = 26;
    for (let i = 0; i < buildingCount; i++) {
      const width = THREE.MathUtils.randFloat(1.6, 3.6);
      const height = THREE.MathUtils.randFloat(7, 20);
      const depth = THREE.MathUtils.randFloat(1.8, 3.8);

      const posX = (i - buildingCount / 2) * 2.3 + THREE.MathUtils.randFloatSpread(1.0);
      const posZ = CITY_BASE_Z + THREE.MathUtils.randFloatSpread(5);
      const posY = height / 2 - 2;

      const boxGeo = this.trackGeometry(new THREE.BoxGeometry(width, height, depth));
      const building = new THREE.Mesh(boxGeo, buildingMat);
      building.position.set(posX, posY, posZ);
      this.group.add(building);

      // Add illuminated Cloud / Architecture Logo on select prominent towers (inspired by reference image)
      if (height > 13 && i % 3 === 0) {
        this.addCloudLogo(posX, posY + height / 2 - 1.2, posZ + depth / 2 + 0.05);
      }

      // Add antennas
      if (height > 14) {
        this.addRooftopAntenna(posX, posY + height / 2, posZ);
      }

      // Add luminous window grids
      this.addLuminousWindows(posX, posY, posZ + depth / 2 + 0.02, width, height);
    }
  }

  private addCloudLogo(x: number, y: number, z: number): void {
    const logoGroup = new THREE.Group();
    const logoMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));

    // Stylized glowing cloud emblem
    const circle1 = new THREE.Mesh(this.trackGeometry(new THREE.CircleGeometry(0.35, 16)), logoMat);
    circle1.position.set(0, 0, 0);
    logoGroup.add(circle1);

    const circle2 = new THREE.Mesh(this.trackGeometry(new THREE.CircleGeometry(0.24, 16)), logoMat);
    circle2.position.set(-0.28, -0.06, 0);
    logoGroup.add(circle2);

    const circle3 = new THREE.Mesh(this.trackGeometry(new THREE.CircleGeometry(0.24, 16)), logoMat);
    circle3.position.set(0.28, -0.06, 0);
    logoGroup.add(circle3);

    const basePill = new THREE.Mesh(this.trackGeometry(new THREE.PlaneGeometry(0.68, 0.22)), logoMat);
    basePill.position.set(0, -0.12, 0);
    logoGroup.add(basePill);

    logoGroup.position.set(x, y, z);
    this.group.add(logoGroup);
  }

  private addRooftopAntenna(x: number, y: number, z: number): void {
    const antennaGeo = this.trackGeometry(new THREE.CylinderGeometry(0.02, 0.04, 2.8, 6));
    const antennaMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(x, y + 1.4, z);
    this.group.add(antenna);

    const beaconGeo = this.trackGeometry(new THREE.SphereGeometry(0.08, 8, 8));
    const beaconMat = this.trackMaterial(new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(x, y + 2.8, z);
    this.group.add(beacon);
  }

  private addLuminousWindows(x: number, y: number, z: number, width: number, height: number): void {
    const cols = Math.floor(width / 0.42);
    const rows = Math.floor(height / 0.75);
    if (cols < 2 || rows < 3) return;

    const windowGeo = this.trackGeometry(new THREE.PlaneGeometry(0.18, 0.26));

    for (let r = 0; r < rows; r++) {
      if (Math.random() < 0.3) continue;

      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.38) continue;

        const colorIndex = Math.floor(Math.random() * WINDOW_COLORS.length);
        const winMat = this.trackMaterial(new THREE.MeshBasicMaterial({
          color: WINDOW_COLORS[colorIndex],
          transparent: true,
          opacity: THREE.MathUtils.randFloat(0.4, 0.9),
        }));

        const win = new THREE.Mesh(windowGeo, winMat);
        win.position.set(
          x - width / 2 + (c + 0.5) * (width / cols),
          y - height / 2 + (r + 0.5) * (height / rows),
          z
        );
        this.group.add(win);
      }
    }
  }

  private buildHighwayTraffic(): void {
    // The busy metropolitan highway avenue visible below the office windows (matching reference image)
    const trafficCount = 180;
    const positions = new Float32Array(trafficCount * 3);
    const colors = new Float32Array(trafficCount * 3);
    this.trafficVelocities = new Float32Array(trafficCount);

    const colorHeadlight = new THREE.Color(0xfef08a); // Pale gold / white headlights
    const colorTaillight = new THREE.Color(0xf43f5e); // Vivid red taillights

    for (let i = 0; i < trafficCount; i++) {
      const isEastbound = i % 2 === 0;
      const x = THREE.MathUtils.randFloatSpread(32);
      const y = -0.8 + THREE.MathUtils.randFloatSpread(0.2); // Below window sill level
      const z = CITY_BASE_Z + 4 + (isEastbound ? 0.8 : -0.8);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const chosenColor = isEastbound ? colorHeadlight : colorTaillight;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      this.trafficVelocities[i] = (isEastbound ? 1 : -1) * THREE.MathUtils.randFloat(3.5, 7.0);
    }

    const trafficGeo = this.trackGeometry(new THREE.BufferGeometry());
    trafficGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trafficGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const trafficMat = this.trackMaterial(new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    }));

    this.trafficParticles = new THREE.Points(trafficGeo, trafficMat);
    this.group.add(this.trafficParticles);
  }

  public update(deltaTime: number): void {
    if (!this.trafficParticles || !this.trafficVelocities) return;

    const posAttr = this.trafficParticles.geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;

    for (let i = 0; i < this.trafficVelocities.length; i++) {
      positions[i * 3] += this.trafficVelocities[i] * deltaTime;

      // Wrap around highway boundary
      if (positions[i * 3] > 18) {
        positions[i * 3] = -18;
      } else if (positions[i * 3] < -18) {
        positions[i * 3] = 18;
      }
    }
    posAttr.needsUpdate = true;
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
