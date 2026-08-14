import * as THREE from 'three';
import gsap from 'gsap';

export interface CameraPosition {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export const CameraStates: Record<string, CameraPosition> = {
  HERO_IDLE: {
    position: new THREE.Vector3(0, 1.5, 5),
    target: new THREE.Vector3(0, 1, 0),
  },
  WORKSTATION_ACTIVE: {
    position: new THREE.Vector3(-2, 1.6, 2),
    target: new THREE.Vector3(0, 1.2, -1),
  },
  // Add more states as needed
};

export default class CameraController {
  constructor(private camera: THREE.PerspectiveCamera) {}

  public transitionTo(stateName: keyof typeof CameraStates, duration: number = 2) {
    const targetState = CameraStates[stateName];
    if (!targetState) return;

    // We animate both the camera position and where it's looking (target)
    // For the target, we need a proxy object that the camera looks at during the tween
    const currentTarget = new THREE.Vector3(0, 0, 0); // Need to store actual current target
    // In a full implementation, we'd use OrbitControls target or a custom dummy object.
    
    gsap.to(this.camera.position, {
      x: targetState.position.x,
      y: targetState.position.y,
      z: targetState.position.z,
      duration,
      ease: 'power2.inOut',
    });
  }
}
