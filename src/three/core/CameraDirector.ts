import * as THREE from 'three';

export interface ShotKeyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

/**
 * Key camera stations creating a cinematic arc that sweeps around
 * to reveal the side profile, workstation depth, and character posture.
 */
export const CAMERA_STATIONS = [
  // Station 0: Wide Establishing Shot (Front-Right high angle)
  {
    t: 0.0,
    position: new THREE.Vector3(1.2, 2.7, 7.8),
    target: new THREE.Vector3(0, 1.35, -0.6),
    fov: 42,
  },
  // Station 1: Sweeping into 3/4 Side Profile (revealing laptop, suit, and desk depth)
  {
    t: 0.22,
    position: new THREE.Vector3(3.4, 1.85, 2.8),
    target: new THREE.Vector3(0.1, 1.35, -0.2),
    fov: 39,
  },
  // Station 2: Pure Side Profile (intimate view of developer typing, chair contour, and city)
  {
    t: 0.42,
    position: new THREE.Vector3(3.8, 1.65, 0.4),
    target: new THREE.Vector3(0.0, 1.32, -0.4),
    fov: 38,
  },
  // Station 3: Side-to-Front Tracking Shot (following protagonist rising from chair)
  {
    t: 0.65,
    position: new THREE.Vector3(2.2, 1.95, 1.9),
    target: new THREE.Vector3(0.4, 1.45, -0.7),
    fov: 38,
  },
  // Station 4: Workstation & Projects Showcase Focus (framing presenter & active monitors)
  {
    t: 1.0,
    position: new THREE.Vector3(-1.1, 1.72, 2.6),
    target: new THREE.Vector3(0.35, 1.52, -1.1),
    fov: 36,
  },
];

export default class CameraDirector {
  private positionSpline: THREE.CatmullRomCurve3;
  private targetSpline: THREE.CatmullRomCurve3;

  private currentTarget: THREE.Vector3;
  private desiredPosition: THREE.Vector3;
  private desiredTarget: THREE.Vector3;

  private parallaxOffset: THREE.Vector2;
  private currentParallax: THREE.Vector2;

  constructor(private camera: THREE.PerspectiveCamera) {
    const positions = CAMERA_STATIONS.map((s) => s.position);
    const targets = CAMERA_STATIONS.map((s) => s.target);

    // Create smooth Catmull-Rom splines for C1-smooth camera motion
    this.positionSpline = new THREE.CatmullRomCurve3(positions, false, 'centripetal');
    this.targetSpline = new THREE.CatmullRomCurve3(targets, false, 'centripetal');

    this.desiredPosition = this.positionSpline.getPointAt(0);
    this.desiredTarget = this.targetSpline.getPointAt(0);
    this.currentTarget = this.desiredTarget.clone();

    this.parallaxOffset = new THREE.Vector2(0, 0);
    this.currentParallax = new THREE.Vector2(0, 0);

    this.camera.position.copy(this.desiredPosition);
    this.camera.lookAt(this.currentTarget);
    this.camera.fov = CAMERA_STATIONS[0].fov;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Evaluates camera position, target, and FOV along the smooth spline path
   * based on normalized scroll progress [0..1]
   */
  public setScrollProgress(progress: number): void {
    const t = THREE.MathUtils.clamp(progress, 0, 1);

    // Sample continuous spline positions
    const splinePos = this.positionSpline.getPointAt(t);
    const splineTarget = this.targetSpline.getPointAt(t);

    this.desiredPosition.copy(splinePos);
    this.desiredTarget.copy(splineTarget);

    // Interpolate FOV smoothly across keyframes
    this.camera.fov = this.interpolateFov(t);
    this.camera.updateProjectionMatrix();
  }

  private interpolateFov(t: number): number {
    for (let i = 0; i < CAMERA_STATIONS.length - 1; i++) {
      const s1 = CAMERA_STATIONS[i];
      const s2 = CAMERA_STATIONS[i + 1];
      if (t >= s1.t && t <= s2.t) {
        const segT = (t - s1.t) / (s2.t - s1.t);
        return THREE.MathUtils.lerp(s1.fov, s2.fov, segT);
      }
    }
    return CAMERA_STATIONS[CAMERA_STATIONS.length - 1].fov;
  }

  /**
   * Sets subtle normalized pointer coordinates [-1..1] for interactive side-look parallax
   */
  public setPointer(x: number, y: number): void {
    // Increased horizontal parallax range to allow natural side peek exploration
    this.parallaxOffset.set(x * 0.25, y * 0.12);
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
