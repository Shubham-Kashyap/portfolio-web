import * as THREE from 'three';

const SKIN_TONE = 0xb88360;
const HAIR_COLOR = 0x111318;
const BEARD_COLOR = 0x15171f;
const SUIT_NAVY = 0x18243c;
const SHIRT_WHITE = 0xf1f5f9;
const TIE_CYAN = 0x38bdf8;
const PANTS_COLOR = 0x131c30;
const CHAIR_BLACK = 0x111319;
const CHAIR_FRAME = 0x222633;
const COFFEE_MUG_COLOR = 0x141824;

export default class StylizedProtagonist {
  public group: THREE.Group;

  // Discrete sub-groups to allow standing up while chair stays in place (Clean Code G30)
  private chairGroup: THREE.Group;
  private characterBody: THREE.Group;

  private headPivot: THREE.Group;
  private rightArmPivot: THREE.Group;
  private rightForearmPivot: THREE.Group;
  private leftArmPivot: THREE.Group;
  private leftForearmPivot: THREE.Group;
  private torsoGroup: THREE.Group;
  private coffeeMug: THREE.Group;

  // Legs articulation for standing up
  private leftThighMesh!: THREE.Mesh;
  private rightThighMesh!: THREE.Mesh;
  private leftCalfMesh!: THREE.Mesh;
  private rightCalfMesh!: THREE.Mesh;

  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.chairGroup = new THREE.Group();
    this.characterBody = new THREE.Group();

    this.headPivot = new THREE.Group();
    this.rightArmPivot = new THREE.Group();
    this.rightForearmPivot = new THREE.Group();
    this.leftArmPivot = new THREE.Group();
    this.leftForearmPivot = new THREE.Group();
    this.torsoGroup = new THREE.Group();
    this.coffeeMug = new THREE.Group();

    this.buildExecutiveChair();
    this.buildLowerBody();
    this.buildSuitedTorso();
    this.buildArmsWithLaptopInteraction();
    this.buildHeadAndFace();

    this.group.add(this.chairGroup);
    this.group.add(this.characterBody);

    this.group.position.set(0, 0, 0.05);
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

  private buildExecutiveChair(): void {
    const leatherMat = this.createMaterial({ color: CHAIR_BLACK, roughness: 0.75 });
    const metalMat = this.createMaterial({ color: CHAIR_FRAME, roughness: 0.4, metalness: 0.7 });

    const hubGeo = this.trackGeometry(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16));
    const hub = new THREE.Mesh(hubGeo, metalMat);
    hub.position.y = 0.1;
    this.chairGroup.add(hub);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const legGeo = this.trackGeometry(new THREE.BoxGeometry(0.04, 0.03, 0.46));
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(Math.sin(angle) * 0.23, 0.09, Math.cos(angle) * 0.23);
      leg.rotation.y = angle;
      this.chairGroup.add(leg);

      const wheelGeo = this.trackGeometry(new THREE.SphereGeometry(0.032, 8, 8));
      const wheel = new THREE.Mesh(wheelGeo, metalMat);
      wheel.position.set(Math.sin(angle) * 0.44, 0.035, Math.cos(angle) * 0.44);
      this.chairGroup.add(wheel);
    }

    const colGeo = this.trackGeometry(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12));
    const col = new THREE.Mesh(colGeo, metalMat);
    col.position.y = 0.36;
    this.chairGroup.add(col);

    const seatGeo = this.trackGeometry(new THREE.BoxGeometry(0.72, 0.12, 0.68));
    const seat = new THREE.Mesh(seatGeo, leatherMat);
    seat.position.set(0, 0.64, 0.05);
    this.chairGroup.add(seat);

    const backGeo = this.trackGeometry(new THREE.BoxGeometry(0.66, 1.0, 0.09));
    const back = new THREE.Mesh(backGeo, leatherMat);
    back.position.set(0, 1.22, 0.4);
    back.rotation.x = -0.12;
    this.chairGroup.add(back);

    const headrestGeo = this.trackGeometry(new THREE.BoxGeometry(0.5, 0.22, 0.11));
    const headrest = new THREE.Mesh(headrestGeo, leatherMat);
    headrest.position.set(0, 1.76, 0.46);
    headrest.rotation.x = -0.08;
    this.chairGroup.add(headrest);

    const armrestGeo = this.trackGeometry(new THREE.BoxGeometry(0.09, 0.04, 0.38));
    const leftArm = new THREE.Mesh(armrestGeo, leatherMat);
    leftArm.position.set(-0.38, 0.88, 0.08);
    this.chairGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armrestGeo, leatherMat);
    rightArm.position.set(0.38, 0.88, 0.08);
    this.chairGroup.add(rightArm);
  }

  private buildLowerBody(): void {
    const pantsMat = this.createMaterial({ color: PANTS_COLOR, roughness: 0.75 });

    const thighGeo = this.trackGeometry(new THREE.BoxGeometry(0.19, 0.16, 0.56));
    this.leftThighMesh = new THREE.Mesh(thighGeo, pantsMat);
    this.leftThighMesh.position.set(-0.16, 0.71, -0.15);
    this.characterBody.add(this.leftThighMesh);

    this.rightThighMesh = new THREE.Mesh(thighGeo, pantsMat);
    this.rightThighMesh.position.set(0.16, 0.71, -0.15);
    this.characterBody.add(this.rightThighMesh);

    const calfGeo = this.trackGeometry(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 12));
    this.leftCalfMesh = new THREE.Mesh(calfGeo, pantsMat);
    this.leftCalfMesh.position.set(-0.16, 0.38, -0.42);
    this.leftCalfMesh.rotation.x = 0.14;
    this.characterBody.add(this.leftCalfMesh);

    this.rightCalfMesh = new THREE.Mesh(calfGeo, pantsMat);
    this.rightCalfMesh.position.set(0.16, 0.38, -0.42);
    this.rightCalfMesh.rotation.x = 0.14;
    this.characterBody.add(this.rightCalfMesh);
  }

  private buildSuitedTorso(): void {
    const suitMat = this.createMaterial({ color: SUIT_NAVY, roughness: 0.65 });
    const shirtMat = this.createMaterial({ color: SHIRT_WHITE, roughness: 0.5 });
    const tieMat = this.createMaterial({ color: TIE_CYAN, roughness: 0.4 });

    this.torsoGroup.position.set(0, 1.08, 0.1);
    this.torsoGroup.rotation.x = 0.06;
    this.characterBody.add(this.torsoGroup);

    const blazerGeo = this.trackGeometry(new THREE.BoxGeometry(0.54, 0.7, 0.32));
    const blazer = new THREE.Mesh(blazerGeo, suitMat);
    this.torsoGroup.add(blazer);

    const shirtGeo = this.trackGeometry(new THREE.BoxGeometry(0.22, 0.4, 0.02));
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.set(0, 0.14, -0.162);
    this.torsoGroup.add(shirt);

    const lapelGeo = this.trackGeometry(new THREE.BoxGeometry(0.08, 0.42, 0.025));
    const leftLapel = new THREE.Mesh(lapelGeo, suitMat);
    leftLapel.position.set(-0.13, 0.12, -0.165);
    leftLapel.rotation.z = -0.18;
    this.torsoGroup.add(leftLapel);

    const rightLapel = new THREE.Mesh(lapelGeo, suitMat);
    rightLapel.position.set(0.13, 0.12, -0.165);
    rightLapel.rotation.z = 0.18;
    this.torsoGroup.add(rightLapel);

    const tieGeo = this.trackGeometry(new THREE.BoxGeometry(0.065, 0.36, 0.02));
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 0.1, -0.175);
    this.torsoGroup.add(tie);

    const knotGeo = this.trackGeometry(new THREE.BoxGeometry(0.08, 0.06, 0.03));
    const knot = new THREE.Mesh(knotGeo, tieMat);
    knot.position.set(0, 0.28, -0.18);
    this.torsoGroup.add(knot);
  }

  private buildArmsWithLaptopInteraction(): void {
    const suitMat = this.createMaterial({ color: SUIT_NAVY, roughness: 0.65 });
    const shirtCuffMat = this.createMaterial({ color: SHIRT_WHITE, roughness: 0.5 });
    const skinMat = this.createMaterial({ color: SKIN_TONE, roughness: 0.55 });
    const mugMat = this.createMaterial({ color: COFFEE_MUG_COLOR, roughness: 0.3 });

    // Right Arm
    this.rightArmPivot.position.set(0.31, 1.35, 0.12);
    this.characterBody.add(this.rightArmPivot);

    const upperArmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.07, 0.065, 0.36, 12));
    const rightUpper = new THREE.Mesh(upperArmGeo, suitMat);
    rightUpper.position.set(0.04, -0.16, 0);
    this.rightArmPivot.add(rightUpper);

    this.rightForearmPivot.position.set(0.04, -0.32, 0);
    this.rightArmPivot.add(this.rightForearmPivot);

    const forearmGeo = this.trackGeometry(new THREE.CylinderGeometry(0.065, 0.055, 0.34, 12));
    const rightForearm = new THREE.Mesh(forearmGeo, suitMat);
    rightForearm.position.set(-0.06, -0.14, -0.16);
    rightForearm.rotation.x = -1.1;
    this.rightForearmPivot.add(rightForearm);

    const cuffGeo = this.trackGeometry(new THREE.CylinderGeometry(0.056, 0.056, 0.04, 12));
    const rightCuff = new THREE.Mesh(cuffGeo, shirtCuffMat);
    rightCuff.position.set(-0.06, -0.27, -0.3);
    rightCuff.rotation.x = -1.1;
    this.rightForearmPivot.add(rightCuff);

    const handGeo = this.trackGeometry(new THREE.BoxGeometry(0.08, 0.03, 0.1));
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(-0.06, -0.31, -0.36);
    rightHand.rotation.x = -0.3;
    this.rightForearmPivot.add(rightHand);

    // Single Coffee Mug placed stably on desk
    const mugBodyGeo = this.trackGeometry(new THREE.CylinderGeometry(0.065, 0.06, 0.14, 16));
    const mug = new THREE.Mesh(mugBodyGeo, mugMat);
    this.coffeeMug.add(mug);

    const handleGeo = this.trackGeometry(new THREE.TorusGeometry(0.04, 0.012, 8, 16, Math.PI));
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(0.065, 0, 0);
    handle.rotation.z = -Math.PI / 2;
    this.coffeeMug.add(handle);

    this.coffeeMug.position.set(0.65, 1.05, -0.6);
    this.group.add(this.coffeeMug);

    // Left Arm
    this.leftArmPivot.position.set(-0.31, 1.35, 0.12);
    this.characterBody.add(this.leftArmPivot);

    const leftUpper = new THREE.Mesh(upperArmGeo, suitMat);
    leftUpper.position.set(-0.04, -0.16, 0);
    this.leftArmPivot.add(leftUpper);

    this.leftForearmPivot.position.set(-0.04, -0.32, 0);
    this.leftArmPivot.add(this.leftForearmPivot);

    const leftForearm = new THREE.Mesh(forearmGeo, suitMat);
    leftForearm.position.set(0.06, -0.14, -0.16);
    leftForearm.rotation.x = -1.1;
    this.leftForearmPivot.add(leftForearm);

    const leftCuff = new THREE.Mesh(cuffGeo, shirtCuffMat);
    leftCuff.position.set(0.06, -0.27, -0.3);
    leftCuff.rotation.x = -1.1;
    this.leftForearmPivot.add(leftCuff);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0.06, -0.31, -0.36);
    leftHand.rotation.x = -0.3;
    this.leftForearmPivot.add(leftHand);

    this.rightArmPivot.rotation.x = 0.55;
    this.rightArmPivot.rotation.y = -0.25;
    this.leftArmPivot.rotation.x = 0.55;
    this.leftArmPivot.rotation.y = 0.25;
  }

  private buildHeadAndFace(): void {
    const skinMat = this.createMaterial({ color: SKIN_TONE, roughness: 0.55 });
    const hairMat = this.createMaterial({ color: HAIR_COLOR, roughness: 0.9 });
    const beardMat = this.createMaterial({ color: BEARD_COLOR, roughness: 0.85 });

    this.headPivot.position.set(0, 1.48, 0.12);
    this.characterBody.add(this.headPivot);

    const neckGeo = this.trackGeometry(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 14));
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.05;
    this.headPivot.add(neck);

    const collarGeo = this.trackGeometry(new THREE.CylinderGeometry(0.09, 0.095, 0.05, 14));
    const collarMat = this.createMaterial({ color: SHIRT_WHITE, roughness: 0.5 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 0.02;
    this.headPivot.add(collar);

    const headGeo = this.trackGeometry(new THREE.SphereGeometry(0.18, 20, 20));
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.23;
    this.headPivot.add(head);

    const hairBaseGeo = this.trackGeometry(new THREE.SphereGeometry(0.19, 16, 16));
    const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
    hairBase.position.set(0, 0.27, 0.03);
    hairBase.scale.set(1.02, 1.08, 1.06);
    this.headPivot.add(hairBase);

    const quiffGeo = this.trackGeometry(new THREE.BoxGeometry(0.24, 0.12, 0.2));
    const quiff = new THREE.Mesh(quiffGeo, hairMat);
    quiff.position.set(0, 0.38, -0.06);
    quiff.rotation.x = -0.25;
    this.headPivot.add(quiff);

    const beardGeo = this.trackGeometry(new THREE.CylinderGeometry(0.16, 0.13, 0.12, 16, 1, false, 0, Math.PI));
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.position.set(0, 0.16, -0.05);
    beard.rotation.y = Math.PI / 2;
    this.headPivot.add(beard);

    const mustacheGeo = this.trackGeometry(new THREE.BoxGeometry(0.12, 0.03, 0.04));
    const mustache = new THREE.Mesh(mustacheGeo, beardMat);
    mustache.position.set(0, 0.22, -0.17);
    this.headPivot.add(mustache);

    this.headPivot.rotation.x = 0.12;
    this.headPivot.rotation.y = -0.04;
  }

  public updateIdle(elapsedTime: number): void {
    const breath = Math.sin(elapsedTime * 1.8);
    this.torsoGroup.position.y = 1.08 + breath * 0.005;
    this.headPivot.position.y = 1.48 + breath * 0.004;

    const typingJitter = Math.sin(elapsedTime * 9) * 0.008;
    this.rightForearmPivot.rotation.x = -1.1 + typingJitter;
    this.leftForearmPivot.rotation.x = -1.1 - typingJitter;
  }

  /**
   * Continuous transition from seated at desk to standing beside workstation (Scene 02 & 03)
   * @param progress Scroll timeline progression [0..1]
   */
  public setTimelineProgress(progress: number): void {
    const p = THREE.MathUtils.clamp(progress, 0, 1);

    if (p < 0.35) {
      // Scene 01: Seated, typing and thinking
      this.characterBody.position.set(0, 0, 0);
      this.rightArmPivot.rotation.set(0.55, -0.25, 0);
      this.leftArmPivot.rotation.set(0.55, 0.25, 0);
      this.headPivot.rotation.set(0.12, -0.04, 0);

      this.leftThighMesh.rotation.x = 0;
      this.rightThighMesh.rotation.x = 0;
      this.leftCalfMesh.rotation.x = 0.14;
      this.rightCalfMesh.rotation.x = 0.14;
    } else if (p < 0.65) {
      // Scene 02: Standing up, moving toward workstation
      const t = (p - 0.35) / 0.30;
      const easeT = t * t * (3 - 2 * t);

      // Rise up and step slightly to the right side of the desk
      this.characterBody.position.y = THREE.MathUtils.lerp(0, 0.38, easeT);
      this.characterBody.position.x = THREE.MathUtils.lerp(0, 0.65, easeT);
      this.characterBody.position.z = THREE.MathUtils.lerp(0, -0.35, easeT);

      // Legs straighten into standing posture
      this.leftThighMesh.rotation.x = THREE.MathUtils.lerp(0, 1.4, easeT);
      this.rightThighMesh.rotation.x = THREE.MathUtils.lerp(0, 1.4, easeT);
      this.leftCalfMesh.rotation.x = THREE.MathUtils.lerp(0.14, 0, easeT);
      this.rightCalfMesh.rotation.x = THREE.MathUtils.lerp(0.14, 0, easeT);

      // Arms open up from keyboard into presentation stance
      this.rightArmPivot.rotation.x = THREE.MathUtils.lerp(0.55, 0.2, easeT);
      this.rightArmPivot.rotation.y = THREE.MathUtils.lerp(-0.25, -0.6, easeT);
      this.rightArmPivot.rotation.z = THREE.MathUtils.lerp(0, 0.4, easeT);

      this.leftArmPivot.rotation.x = THREE.MathUtils.lerp(0.55, 0.1, easeT);
      this.leftArmPivot.rotation.y = THREE.MathUtils.lerp(0.25, 0.1, easeT);

      this.headPivot.rotation.x = THREE.MathUtils.lerp(0.12, 0.05, easeT);
      this.headPivot.rotation.y = THREE.MathUtils.lerp(-0.04, -0.3, easeT);
    } else {
      // Scene 03: Projects walkthrough (standing beside system, presenting)
      const t = (p - 0.65) / 0.35;
      this.characterBody.position.set(0.65, 0.38, -0.35);

      this.leftThighMesh.rotation.x = 1.4;
      this.rightThighMesh.rotation.x = 1.4;
      this.leftCalfMesh.rotation.x = 0;
      this.rightCalfMesh.rotation.x = 0;

      // Gesturing toward the monitors
      this.rightArmPivot.rotation.set(0.2 + Math.sin(t * Math.PI) * 0.1, -0.6, 0.4);
      this.leftArmPivot.rotation.set(0.1, 0.1, 0);
      this.headPivot.rotation.set(0.05, -0.35, 0);
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
