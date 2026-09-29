import * as THREE from 'three';

// Named constants for character proportions and materials (Clean Code G25)
const SKIN_TONE = 0xd4a373;
const HAIR_COLOR = 0x1a1a24;
const HOODIE_COLOR = 0x1f2438;
const PANTS_COLOR = 0x12141f;
const HEADPHONES_ACCENT = 0x6366f1;
const COFFEE_MUG_COLOR = 0x0f1118;
const CHAIR_METAL = 0x2b2e3b;
const CHAIR_FABRIC = 0x141724;

export default class StylizedProtagonist {
  public group: THREE.Group;
  
  // Articulated joint references for timeline animation
  private headPivot: THREE.Group;
  private rightArmPivot: THREE.Group;
  private rightForearmPivot: THREE.Group;
  private coffeeMug: THREE.Mesh;
  private torsoMesh: THREE.Mesh;
  
  // Materials tracked for complete disposal
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();

    this.headPivot = new THREE.Group();
    this.rightArmPivot = new THREE.Group();
    this.rightForearmPivot = new THREE.Group();
    this.coffeeMug = new THREE.Mesh();
    this.torsoMesh = new THREE.Mesh();

    this.buildChair();
    this.buildLowerBody();
    this.buildUpperBody();
    this.buildRightArmWithCoffee();
    this.buildLeftArm();
    this.buildHeadWithHeadphones();

    // Set initial seated resting position
    this.group.position.set(0, 0, 0.15);
  }

  private createMaterial(parameters: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial(parameters);
    this.materials.push(material);
    return material;
  }

  private trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private buildChair(): void {
    const chairGroup = new THREE.Group();
    const metalMat = this.createMaterial({ color: CHAIR_METAL, roughness: 0.4, metalness: 0.8 });
    const fabricMat = this.createMaterial({ color: CHAIR_FABRIC, roughness: 0.85 });

    // 5-star caster base
    const baseHubGeo = this.trackGeometry(new THREE.CylinderGeometry(0.12, 0.14, 0.1, 16));
    const baseHub = new THREE.Mesh(baseHubGeo, metalMat);
    baseHub.position.y = 0.12;
    chairGroup.add(baseHub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legGeo = this.trackGeometry(new THREE.BoxGeometry(0.04, 0.03, 0.45));
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(Math.sin(angle) * 0.22, 0.1, Math.cos(angle) * 0.22);
      leg.rotation.y = angle;
      chairGroup.add(leg);

      const wheelGeo = this.trackGeometry(new THREE.SphereGeometry(0.03, 8, 8));
      const wheel = new THREE.Mesh(wheelGeo, metalMat);
      wheel.position.set(Math.sin(angle) * 0.42, 0.04, Math.cos(angle) * 0.42);
      chairGroup.add(wheel);
    }

    // Hydraulic cylinder
    const pistonGeo = this.trackGeometry(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16));
    const piston = new THREE.Mesh(pistonGeo, metalMat);
    piston.position.y = 0.38;
    chairGroup.add(piston);

    // Seat cushion
    const seatGeo = this.trackGeometry(new THREE.BoxGeometry(0.7, 0.1, 0.65));
    const seat = new THREE.Mesh(seatGeo, fabricMat);
    seat.position.set(0, 0.65, 0.05);
    chairGroup.add(seat);

    // Ergonomic backrest
    const backGeo = this.trackGeometry(new THREE.BoxGeometry(0.62, 0.85, 0.08));
    const back = new THREE.Mesh(backGeo, fabricMat);
    back.position.set(0, 1.15, 0.38);
    back.rotation.x = -0.1;
    chairGroup.add(back);

    // Armrests
    const armrestGeo = this.trackGeometry(new THREE.BoxGeometry(0.08, 0.04, 0.35));
    const leftArmrest = new THREE.Mesh(armrestGeo, metalMat);
    leftArmrest.position.set(-0.36, 0.88, 0.08);
    chairGroup.add(leftArmrest);

    const rightArmrest = new THREE.Mesh(armrestGeo, metalMat);
    rightArmrest.position.set(0.36, 0.88, 0.08);
    chairGroup.add(rightArmrest);

    this.group.add(chairGroup);
  }

  private buildLowerBody(): void {
    const pantsMat = this.createMaterial({ color: PANTS_COLOR, roughness: 0.7 });

    // Seated thighs extending forward
    const thighGeo = this.trackGeometry(new THREE.BoxGeometry(0.18, 0.16, 0.55));
    
    const leftThigh = new THREE.Mesh(thighGeo, pantsMat);
    leftThigh.position.set(-0.16, 0.72, -0.15);
    this.group.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, pantsMat);
    rightThigh.position.set(0.16, 0.72, -0.15);
    this.group.add(rightThigh);

    // Lower legs descending toward the floor
    const calfGeo = this.trackGeometry(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 12));
    
    const leftCalf = new THREE.Mesh(calfGeo, pantsMat);
    leftCalf.position.set(-0.16, 0.38, -0.42);
    leftCalf.rotation.x = 0.15;
    this.group.add(leftCalf);

    const rightCalf = new THREE.Mesh(calfGeo, pantsMat);
    rightCalf.position.set(0.16, 0.38, -0.42);
    rightCalf.rotation.x = 0.15;
    this.group.add(rightCalf);
  }

  private buildUpperBody(): void {
    const hoodieMat = this.createMaterial({ color: HOODIE_COLOR, roughness: 0.65 });

    // Torso with natural forward lean toward the workstation
    const torsoGeo = this.trackGeometry(new THREE.BoxGeometry(0.52, 0.68, 0.32));
    this.torsoMesh = new THREE.Mesh(torsoGeo, hoodieMat);
    this.torsoMesh.position.set(0, 1.08, 0.1);
    this.torsoMesh.rotation.x = 0.08;
    this.group.add(this.torsoMesh);
  }

  private buildRightArmWithCoffee(): void {
    const hoodieMat = this.createMaterial({ color: HOODIE_COLOR, roughness: 0.65 });
    const skinMat = this.createMaterial({ color: SKIN_TONE, roughness: 0.5 });
    const mugMat = this.createMaterial({ color: COFFEE_MUG_COLOR, roughness: 0.2, metalness: 0.1 });
    const coffeeSurfaceMat = this.createMaterial({ color: 0x3d2314, roughness: 0.1 });

    // Shoulder pivot attached to upper torso
    this.rightArmPivot.position.set(0.3, 1.34, 0.12);
    this.group.add(this.rightArmPivot);

    // Upper arm
    const upperArmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.07, 0.065, 0.35, 12));
    const upperArm = new THREE.Mesh(upperArmGeo, hoodieMat);
    upperArm.position.set(0.05, -0.16, 0);
    this.rightArmPivot.add(upperArm);

    // Elbow pivot
    this.rightForearmPivot.position.set(0.05, -0.32, 0);
    this.rightArmPivot.add(this.rightForearmPivot);

    // Forearm
    const forearmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 12));
    const forearm = new THREE.Mesh(forearmGeo, hoodieMat);
    forearm.position.set(0, 0.14, -0.12);
    forearm.rotation.x = -1.1;
    this.rightForearmPivot.add(forearm);

    // Hand
    const handGeo = this.trackGeometry(new THREE.SphereGeometry(0.05, 10, 10));
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, 0.28, -0.25);
    this.rightForearmPivot.add(hand);

    // The single coffee mug held in right hand
    const mugGroup = new THREE.Group();
    const mugBodyGeo = this.trackGeometry(new THREE.CylinderGeometry(0.065, 0.06, 0.14, 16));
    this.coffeeMug = new THREE.Mesh(mugBodyGeo, mugMat);
    mugGroup.add(this.coffeeMug);

    const liquidGeo = this.trackGeometry(new THREE.CircleGeometry(0.058, 16));
    const liquid = new THREE.Mesh(liquidGeo, coffeeSurfaceMat);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 0.06;
    mugGroup.add(liquid);

    const handleGeo = this.trackGeometry(new THREE.TorusGeometry(0.04, 0.012, 8, 16, Math.PI));
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(0.065, 0, 0);
    handle.rotation.z = -Math.PI / 2;
    mugGroup.add(handle);

    mugGroup.position.set(0, 0.36, -0.28);
    this.rightForearmPivot.add(mugGroup);

    // Initial pose: coffee raised comfortably toward chest/chin
    this.rightArmPivot.rotation.x = 0.3;
    this.rightArmPivot.rotation.z = -0.2;
    this.rightForearmPivot.rotation.x = 0.4;
  }

  private buildLeftArm(): void {
    const hoodieMat = this.createMaterial({ color: HOODIE_COLOR, roughness: 0.65 });
    const skinMat = this.createMaterial({ color: SKIN_TONE, roughness: 0.5 });

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.3, 1.34, 0.12);
    this.group.add(leftArmPivot);

    const upperArmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.07, 0.065, 0.35, 12));
    const upperArm = new THREE.Mesh(upperArmGeo, hoodieMat);
    upperArm.position.set(-0.04, -0.16, 0.04);
    upperArm.rotation.x = 0.15;
    leftArmPivot.add(upperArm);

    // Forearm resting naturally on the armrest/desk
    const forearmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 12));
    const forearm = new THREE.Mesh(forearmGeo, hoodieMat);
    forearm.position.set(-0.06, -0.36, -0.1);
    forearm.rotation.x = -0.7;
    leftArmPivot.add(forearm);

    const handGeo = this.trackGeometry(new THREE.SphereGeometry(0.05, 10, 10));
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(-0.06, -0.46, -0.25);
    leftArmPivot.add(hand);
  }

  private buildHeadWithHeadphones(): void {
    const skinMat = this.createMaterial({ color: SKIN_TONE, roughness: 0.55 });
    const hairMat = this.createMaterial({ color: HAIR_COLOR, roughness: 0.9 });
    const headphoneMat = this.createMaterial({ color: 0x11131a, metalness: 0.8, roughness: 0.3 });
    const glowMat = this.createMaterial({
      color: HEADPHONES_ACCENT,
      emissive: HEADPHONES_ACCENT,
      emissiveIntensity: 0.7,
    });

    // Neck pivot for clean yaw and pitch movements
    this.headPivot.position.set(0, 1.48, 0.12);
    this.group.add(this.headPivot);

    // Neck
    const neckGeo = this.trackGeometry(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12));
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.04;
    this.headPivot.add(neck);

    // Head base
    const headGeo = this.trackGeometry(new THREE.SphereGeometry(0.18, 18, 18));
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.22;
    this.headPivot.add(head);

    // Stylized hair volume
    const hairGeo = this.trackGeometry(new THREE.SphereGeometry(0.19, 14, 14));
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.26, 0.02);
    hair.scale.set(1.02, 1.05, 1.05);
    this.headPivot.add(hair);

    // Headphones band
    const bandGeo = this.trackGeometry(new THREE.TorusGeometry(0.2, 0.02, 8, 24, Math.PI));
    const band = new THREE.Mesh(bandGeo, headphoneMat);
    band.position.set(0, 0.23, 0);
    band.rotation.z = Math.PI;
    this.headPivot.add(band);

    // Earcups with glowing rings
    const earcupGeo = this.trackGeometry(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16));
    const earcupRingGeo = this.trackGeometry(new THREE.TorusGeometry(0.055, 0.008, 8, 16));

    const leftCup = new THREE.Mesh(earcupGeo, headphoneMat);
    leftCup.position.set(-0.2, 0.23, 0);
    leftCup.rotation.z = Math.PI / 2;
    this.headPivot.add(leftCup);

    const leftGlow = new THREE.Mesh(earcupRingGeo, glowMat);
    leftGlow.position.set(-0.22, 0.23, 0);
    leftGlow.rotation.y = Math.PI / 2;
    this.headPivot.add(leftGlow);

    const rightCup = new THREE.Mesh(earcupGeo, headphoneMat);
    rightCup.position.set(0.2, 0.23, 0);
    rightCup.rotation.z = Math.PI / 2;
    this.headPivot.add(rightCup);

    const rightGlow = new THREE.Mesh(earcupRingGeo, glowMat);
    rightGlow.position.set(0.22, 0.23, 0);
    rightGlow.rotation.y = Math.PI / 2;
    this.headPivot.add(rightGlow);

    // Initial posture: head tilted slightly downward toward code monitor
    this.headPivot.rotation.x = 0.08;
    this.headPivot.rotation.y = -0.05;
  }

  /**
   * Updates subtle organic idle animations (breathing and micro head tilt)
   */
  public updateIdle(elapsedTime: number): void {
    const breathCycle = Math.sin(elapsedTime * 1.8);
    this.torsoMesh.position.y = 1.08 + breathCycle * 0.006;
    this.torsoMesh.rotation.x = 0.08 + breathCycle * 0.008;
    this.headPivot.position.y = 1.48 + breathCycle * 0.005;
  }

  /**
   * Smoothly animates coffee lowering as timeline progresses
   * @param progress Normalized [0..1] progress value
   */
  public setCoffeeProgress(progress: number): void {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    
    // Lower right arm smoothly toward the desk
    this.rightArmPivot.rotation.x = THREE.MathUtils.lerp(0.3, 0.12, clamped);
    this.rightArmPivot.rotation.z = THREE.MathUtils.lerp(-0.2, -0.08, clamped);
    this.rightForearmPivot.rotation.x = THREE.MathUtils.lerp(0.4, -0.3, clamped);
    this.rightForearmPivot.rotation.y = THREE.MathUtils.lerp(0, 0.2, clamped);
  }

  /**
   * Adjusts head orientation toward active monitors
   */
  public setHeadAttention(progress: number): void {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    this.headPivot.rotation.y = THREE.MathUtils.lerp(-0.05, 0.1, clamped);
    this.headPivot.rotation.x = THREE.MathUtils.lerp(0.08, 0.15, clamped);
  }

  /**
   * Frees all Three.js memory allocations cleanly on unmount (Clean Code G9)
   */
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
