# Design Specification: Cinematic 3D Portfolio Film (Phase 1 Foundation)

**Date**: 2026-09-29  
**Status**: Approved / In Implementation  
**Target Milestone**: Phase 1 — Scene 01 ("The Developer at Work") & Transition 01 ("Toward the Workstation")

---

## 1. Overview & Vision
The portfolio is designed as an interactive cinematic short film driven by user scroll progression (`Scroll = Time`). The visitor does not navigate standard website tabs; instead, their scrolling advances the timeline of a unified 3D developer environment. 

Phase 1 establishes a fully functional, visually complete, dark cinematic experience containing:
1. A rich 3D environment: futuristic developer room, technical grid floor, atmospheric fog, and a silhouetted cyber-city skyline through expansive panoramic windows.
2. A meticulously assembled procedural protagonist: seated in an ergonomic office chair, wearing headphones, holding a single coffee mug, with articulated limbs and natural posture.
3. Dual workstation monitors featuring active glowing code canvases and terminal textures rendered dynamically with HTML5 Canvas.
4. A smooth scroll-linked timeline (`ScrollDirector`) coordinating camera push-in, lighting shifts, coffee lowering, head turns, and monitor activation.
5. A decoupled, cinematic HTML/CSS overlay layer presenting crisp typography, developer metadata, and narrative cues.

---

## 2. Architecture & File Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout with Inter & Roboto Mono fonts
│   ├── page.tsx                  # Main page coordinating 3D canvas and scroll narrative sections
│   ├── page.module.css           # Styling for scroll sections and UI overlay
│   └── globals.css               # Design tokens, color system, and glassmorphic surfaces
├── config/
│   └── designTokens.ts           # Centralized theme tokens (colors, typography, transitions)
├── three/
│   ├── core/
│   │   ├── SceneManager.ts       # Three.js lifecycle, renderer, post-processing/composer, resize
│   │   └── CameraDirector.ts     # Smooth camera motion curves and target interpolation
│   ├── scenes/
│   │   └── HeroScene.ts          # Complete Scene 01 composite (room, city, workstation, protagonist)
│   ├── characters/
│   │   └── StylizedProtagonist.ts # Articulated procedural character rig with joint hierarchy
│   ├── environment/
│   │   ├── CitySkyline.ts        # Futuristic cityscape background with glowing window arrays
│   │   └── Workstation.ts        # Dual monitors, desk, dynamic canvas code textures
│   └── timeline/
│       └── ScrollTimeline.ts     # GSAP timeline orchestrating camera, character, and lights by scroll %
└── components/
    ├── three/
    │   └── ThreeCanvas.tsx       # Next.js client wrapper with WebGL lifecycle and error boundary
    └── ui/
        ├── CinematicOverlay.tsx  # Story text, developer role, and scroll guidance HUD
        └── NavigationHUD.tsx     # Minimal top/bottom status indicators
```

---

## 3. Detailed Component Specifications

### 3.1 3D Character Rig (`StylizedProtagonist.ts`)
- **Structure**: Hierarchical `THREE.Group` with distinct articulated pivot points:
  - Pelvis & Seated Thighs/Lower Legs resting naturally.
  - Ergonomic task chair with base caster ring, hydraulic cylinder, seat cushion, curved lumbar support, and mesh backrest.
  - Torso leaning slightly forward toward screens in deep concentration.
  - Head assembly with neck pivot, spherical head, hair block geometry, and over-ear headphones with headband and illuminated earcups.
  - Left arm resting casually on desk/armrest.
  - Right arm with shoulder and elbow pivot groups holding the single dark ceramic coffee mug.
- **Dynamic Control**:
  - `setHeadRotation(yaw: number, pitch: number)`: subtle glance control.
  - `setCoffeeSipProgress(progress: number)`: smoothly lowers the coffee mug from near chest/chin down toward the desk surface as the timeline progresses.
  - `updateIdleBreathing(elapsedTime: number)`: subtle procedural sinusoidal breathing movement (torso Y offset `±0.015`, subtle shoulder elevation).

### 3.2 Environment & Workstation (`Workstation.ts` & `CitySkyline.ts`)
- **Atmosphere & Palette**:
  - Background base: `#020203` (deep near-black).
  - Ambient illumination: `#0a1226` (deep midnight blue).
  - Key monitor emission: `#4f75ff` (electric indigo) and `#a855f7` (subtle violet).
  - Volumetric feel: `THREE.FogExp2(0x020205, 0.035)`.
- **Dynamic Screens**:
  - Main Screen: Rendered using an offscreen HTML5 `HTMLCanvasElement` generating realistic syntax-highlighted TypeScript code snippets with a blinking cursor.
  - Secondary Screen: Offscreen canvas displaying a system dashboard / build terminal output with performance metrics.
- **City Backdrop**:
  - Cluster of monolithic futuristic skyscraper silhouettes beyond floor-to-ceiling glass mullions.
  - Randomized window light grids in soft cyan, amber, and indigo, giving depth and scale to the world outside.

### 3.3 Scroll-Driven Cinematic Engine (`ScrollTimeline.ts`)
- **Mapping Principle**: `Scroll = Time`.
- **Scroll Range Normalization**:
  - Total scroll height defined by virtual narrative distance (`300vh` for Phase 1 establishing shot into workstation close-up).
  - Progress calculated cleanly as `clamp(window.scrollY / (maxScroll), 0, 1)`.
- **Timeline Beats**:
  - `0.00 - 0.25`: **Establishing Shot** (Wide view, developer sipping coffee, city skyline visible, typography introduces "SHUBHAM KASHYAP / SOFTWARE ENGINEER").
  - `0.25 - 0.65`: **The Transition** (Camera pushes forward smoothly along a spline, coffee mug lowers, monitors intensify in brightness, typography cross-fades to "FOCUSED ON CRAFT & SYSTEMS").
  - `0.65 - 1.00`: **Arrival at the Workstation** (Medium-close focus on screen code and developer posture, camera locks into work perspective, preparing for project discovery).

### 3.4 Decoupled UI Overlay (`CinematicOverlay.tsx`)
- Fixed full-screen non-blocking viewport (`pointer-events: none` on container, `pointer-events: auto` on interactive buttons).
- Subtle, high-contrast, accessibility-compliant typography using Inter and Roboto Mono.
- Cinematic HUD elements:
  - Top header: Status dot `● ACTIVE ENVIRONMENT`, local time indicator, subtle branding.
  - Bottom scroll indicator: "SCROLL TO ADVANCE TIMELINE" with animated indicator.
  - Narrative subtitles synced cleanly to scroll progression.

---

## 4. Code Quality & Standards (Clean Code Compliance)
- **TypeScript**: Strict type definitions, no `any`, zero magic numbers (all dimensions, speeds, and colors defined as constants).
- **Function Purity**: Functions adhere to single responsibility and max 3 parameters (`F1`, `G30`).
- **Memory & Lifecycle**: Explicit disposal of all Three.js geometries, materials, canvas textures, and animation frames on unmount to prevent WebGL memory leaks.
- **Performance**: Render loop throttled by pixel ratio clamp (`Math.min(window.devicePixelRatio, 2)`), frustum culling enabled, shared geometries/materials where applicable.

---

## 5. Verification & Testing Plan
1. **Compilation & Lint**: Run `npm run build` and Next.js linting to ensure zero TypeScript errors or broken imports.
2. **Visual Fidelity**: Run `npm run dev` and verify that the 3D scene renders with depth, clean lighting, the seated character holding his coffee mug, dynamic monitor glows, and city backdrop.
3. **Scroll Responsiveness**: Verify that scrolling down smoothly moves the camera and protagonist seamlessly with zero stutter, and reverse scrolling returns precisely to the establishing wide shot.
