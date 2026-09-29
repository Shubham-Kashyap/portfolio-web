import * as THREE from 'three';

export interface ShotKeyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

// Keyframes across Scene 01, Scene 02, and Scene 03
export const SHOT_SCENE_01: ShotKeyframe = {
  position: new THREE.Vector3(0.9, 2.7, 7.6),
  target: new THREE.Vector3(0, 1.35, -0.5),
  fov: 42,
};

export const SHOT_SCENE_02: ShotKeyframe = {
  position: new THREE.Vector3(0.1, 2.1, 4.4),
  target: new THREE.Vector3(0.2, 1.45, -0.8),
  fov: 40,
};

export const SHOT_SCENE_03_PROJECTS: ShotKeyframe = {
  position: new THREE.Vector3(-0.65, 1.72, 2.6),
  target: new THREE.Vector3(0.3, 1.52, -1.1),
  fov: 36,
};

export default class CameraDirector {
  private currentTarget: THREE.Vector3;
  private desiredPosition: THREE.Vector3;
  private desiredTarget: THREE.Vector3;

  private parallaxOffset: THREE.Vector2;
  private currentParallax: THREE.Vector2;

  constructor(private camera: THREE.PerspectiveCamera) {
    this.currentTarget = SHOT_SCENE_01.target.clone();
    this.desiredPosition = SHOT_SCENE_01.position.clone();
    this.desiredTarget = SHOT_SCENE_01.target.clone();

    this.parallaxOffset = new THREE.Vector2(0, 0);
    this.currentParallax = new THREE.Vector2(0, 0);

    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.currentTarget);
  }

  public setScrollProgress(progress: number): void {
    const p = THREE.MathUtils.clamp(progress, 0, 1);

    if (p < 0.45) {
      // Interpolate from Scene 01 (Establishing) to Scene 02 (Approaching)
      const t = p / 0.45;
      const easeT = t * t * (3 - 2 * t);

      this.desiredPosition.lerpVectors(SHOT_SCENE_01.position, SHOT_SCENE_02.position, easeT);
      this.desiredTarget.lerpVectors(SHOT_SCENE_01.target, SHOT_SCENE_02.target, easeT);
      this.camera.fov = THREE.MathUtils.lerp(SHOT_SCENE_01.fov, SHOT_SCENE_02.fov, easeT);
    } else {
      // Interpolate into Scene 03 (Project Display)
      const t = (p - 0.45) / 0.55;
      const easeT = t * t * (3 - 2 * t);

      this.desiredPosition.lerpVectors(SHOT_SCENE_02.position, SHOT_SCENE_03_PROJECTS.position, easeT);
      this.desiredTarget.lerpVectors(SHOT_SCENE_02.target, SHOT_SCENE_03_PROJECTS.target, easeT);
      this.camera.fov = THREE.MathUtils.lerp(SHOT_SCENE_02.fov, SHOT_SCENE_03_PROJECTS.fov, easeT);
    }

    this.camera.updateProjectionMatrix();
  }

  public setPointer(x: number, y: number): void {
    this.parallaxOffset.set(x * 0.1, y * 0.07);
  }

  public update(dampingFactor: number = 0.05): void {
    this.currentParallax.lerp(this.parallaxOffset, dampingFactor);

    const finalX = this.desiredPosition.x + this.currentParallax.x;
    const finalY = this.desiredPosition.y + this.currentParallax.y;
    const finalZ = this.desiredPosition.z;

    this.camera.position.x += (finalX - this.camera.position.x) * dampingFactor;
    this.camera.position.y += (finalY - this.camera.position.y) * dampingFactor;
    this.camera.position.z += (finalZ - this.camera.position.z) * dampingFactor;

    this.currentTarget.lerp(this.desiredTarget, dampingFactor);
    this.camera.lookAt(this.currentTarget);
  }
}
