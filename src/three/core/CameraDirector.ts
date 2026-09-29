import * as THREE from 'three';

export interface ShotKeyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

// Cinematic keyframes for Scene 01 and Transition 01
export const SHOT_ESTABLISHING: ShotKeyframe = {
  position: new THREE.Vector3(0.9, 2.7, 7.6),
  target: new THREE.Vector3(0, 1.35, -0.5),
  fov: 42,
};

export const SHOT_WORKSTATION_FOCUS: ShotKeyframe = {
  position: new THREE.Vector3(-0.45, 1.72, 2.6),
  target: new THREE.Vector3(-0.3, 1.48, -1.05),
  fov: 38,
};

export default class CameraDirector {
  private currentTarget: THREE.Vector3;
  private desiredPosition: THREE.Vector3;
  private desiredTarget: THREE.Vector3;

  // Mouse parallax offset vectors
  private parallaxOffset: THREE.Vector2;
  private currentParallax: THREE.Vector2;

  constructor(private camera: THREE.PerspectiveCamera) {
    this.currentTarget = SHOT_ESTABLISHING.target.clone();
    this.desiredPosition = SHOT_ESTABLISHING.position.clone();
    this.desiredTarget = SHOT_ESTABLISHING.target.clone();

    this.parallaxOffset = new THREE.Vector2(0, 0);
    this.currentParallax = new THREE.Vector2(0, 0);

    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.currentTarget);
  }

  /**
   * Updates desired camera parameters based on scroll progress [0..1]
   */
  public setScrollProgress(progress: number): void {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    
    // Smooth cubic ease for natural cinematic deceleration
    const easeT = t * t * (3 - 2 * t);

    this.desiredPosition.lerpVectors(
      SHOT_ESTABLISHING.position,
      SHOT_WORKSTATION_FOCUS.position,
      easeT
    );

    this.desiredTarget.lerpVectors(
      SHOT_ESTABLISHING.target,
      SHOT_WORKSTATION_FOCUS.target,
      easeT
    );

    const targetFov = THREE.MathUtils.lerp(
      SHOT_ESTABLISHING.fov,
      SHOT_WORKSTATION_FOCUS.fov,
      easeT
    );

    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = targetFov;
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Sets subtle normalized pointer coordinates [-1..1] for gentle depth parallax
   */
  public setPointer(x: number, y: number): void {
    this.parallaxOffset.set(x * 0.12, y * 0.08);
  }

  /**
   * Smoothly interpolates camera position and lookAt target every frame
   */
  public update(dampingFactor: number = 0.05): void {
    // Smooth parallax interpolation
    this.currentParallax.lerp(this.parallaxOffset, dampingFactor);

    // Apply smooth position follow with parallax
    const finalX = this.desiredPosition.x + this.currentParallax.x;
    const finalY = this.desiredPosition.y + this.currentParallax.y;
    const finalZ = this.desiredPosition.z;

    this.camera.position.x += (finalX - this.camera.position.x) * dampingFactor;
    this.camera.position.y += (finalY - this.camera.position.y) * dampingFactor;
    this.camera.position.z += (finalZ - this.camera.position.z) * dampingFactor;

    // Smooth target follow
    this.currentTarget.lerp(this.desiredTarget, dampingFactor);
    this.camera.lookAt(this.currentTarget);
  }
}
