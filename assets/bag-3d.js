// ═════════════════════════════════════════════════════════════
//  OTAIMA · 3D Coffee Bag Renderer (Three.js)
//  Volumetric bag with PBR materials and cinematic lighting
// ═════════════════════════════════════════════════════════════

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js';

export class CoffeeBag3D {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = Object.assign({
      textureUrl: '',
      frontU: 0.0,
      frontW: 0.22,
      backU: 0.22,
      backW: 0.22,
      sideU: 0.44,
      sideW: 0.10,
      accentColor: 0xc9a961,
      bagWidth: 2.2,
      bagHeight: 3.4,
      bagDepth: 0.8,
      autoRotate: true
    }, opts);

    // Wait for layout before initializing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      // Defer one frame so flex/grid layout settles
      requestAnimationFrame(() => requestAnimationFrame(() => this.boot()));
    }
  }

  boot() {
    try {
      this.init();
      this.load();
      this.bindEvents();
      this.animate();
    } catch (err) {
      console.error('CoffeeBag3D error:', err);
      this.showFallback();
    }
  }

  showFallback() {
    if (this.container.querySelector('.fallback-img')) return;
    const fb = document.createElement('div');
    fb.className = 'fallback-img';
    fb.innerHTML = `<img src="${this.opts.textureUrl}" alt="Bolsa de café" style="object-fit:cover; object-position:left center; width:35%; height:90%; max-height:none; max-width:none;">`;
    this.container.appendChild(fb);
  }

  getSize() {
    const rect = this.container.getBoundingClientRect();
    return {
      w: Math.max(rect.width, 400),
      h: Math.max(rect.height, 500)
    };
  }

  init() {
    const { w, h } = this.getSize();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    this.camera.position.set(0, 0.3, 9.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = this.opts.autoRotate;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = (2 * Math.PI) / 3;

    // Lighting — premium 3-point + accent rim
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff2d8, 2.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 4;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb8d0ff, 0.6);
    fillLight.position.set(-5, 2, 3);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(this.opts.accentColor, 2.0);
    rimLight.position.set(-3, 4, -5);
    this.scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffeac4, 0.6);
    topLight.position.set(0, 8, 0);
    this.scene.add(topLight);

    // Shadow plane (catches contact shadow)
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.55 });
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      shadowMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -this.opts.bagHeight / 2 - 0.4;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);

    // Group to hold bag and accessories
    this.bagGroup = new THREE.Group();
    this.scene.add(this.bagGroup);
  }

  load() {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(
      this.opts.textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        this.buildBag(texture);
      },
      undefined,
      (err) => {
        console.warn('Texture load failed, using fallback:', err);
        this.buildBag(null);
      }
    );
  }

  buildBag(texture) {
    const { bagWidth: w, bagHeight: h, bagDepth: d } = this.opts;

    // Main bag body — RoundedBoxGeometry
    const bagGeom = new RoundedBoxGeometry(w, h, d, 6, 0.12);
    const materials = this.createMaterials(texture);
    const bag = new THREE.Mesh(bagGeom, materials);
    bag.castShadow = true;
    bag.receiveShadow = true;
    this.bagGroup.add(bag);

    // Top metallic seal (dark sealed strip)
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x100c0a,
      metalness: 0.7,
      roughness: 0.35
    });
    const topSeal = new THREE.Mesh(
      new RoundedBoxGeometry(w * 1.015, 0.22, d * 1.015, 2, 0.05),
      sealMat
    );
    topSeal.position.y = h / 2 - 0.11;
    topSeal.castShadow = true;
    this.bagGroup.add(topSeal);

    const bottomSeal = new THREE.Mesh(
      new RoundedBoxGeometry(w * 1.015, 0.16, d * 1.015, 2, 0.04),
      sealMat
    );
    bottomSeal.position.y = -h / 2 + 0.08;
    bottomSeal.castShadow = true;
    this.bagGroup.add(bottomSeal);

    // Rose-gold metallic clips on top corners
    const clipMat = new THREE.MeshStandardMaterial({
      color: 0xc8946a,
      metalness: 0.95,
      roughness: 0.22
    });
    const clipGeom = new RoundedBoxGeometry(0.26, 0.38, d * 1.12, 2, 0.06);

    const clipL = new THREE.Mesh(clipGeom, clipMat);
    clipL.position.set(-w / 2 + 0.3, h / 2 + 0.06, 0);
    clipL.castShadow = true;
    this.bagGroup.add(clipL);

    const clipR = new THREE.Mesh(clipGeom, clipMat);
    clipR.position.set(w / 2 - 0.3, h / 2 + 0.06, 0);
    clipR.castShadow = true;
    this.bagGroup.add(clipR);

    // Initial tilt
    this.bagGroup.rotation.y = -0.3;

    // Hide rotation hint after first interaction
    const hint = this.container.parentElement?.querySelector('.rotation-hint');
    if (hint) {
      this.controls.addEventListener('start', () => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.6s';
      }, { once: true });
    }

    this.ready = true;
  }

  createMaterials(texture) {
    const baseProps = {
      roughness: 0.6,
      metalness: 0.12,
      sheen: 0.5,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color(0x3a2a1c)
    };

    if (!texture) {
      const fallbackMat = new THREE.MeshPhysicalMaterial({
        ...baseProps,
        color: 0x1a1410
      });
      return Array(6).fill(fallbackMat);
    }

    const { frontU, frontW, backU, backW, sideU, sideW } = this.opts;

    const slice = (offsetU, repeatU) => {
      const t = texture.clone();
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.offset.set(offsetU, 0);
      t.repeat.set(repeatU, 1);
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      return t;
    };

    // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
    return [
      // Right (lateral)
      new THREE.MeshPhysicalMaterial({ ...baseProps, map: slice(sideU, sideW) }),
      // Left (lateral)
      new THREE.MeshPhysicalMaterial({ ...baseProps, map: slice(sideU, sideW) }),
      // Top (dark)
      new THREE.MeshPhysicalMaterial({ color: 0x0e0a08, roughness: 0.5, metalness: 0.5 }),
      // Bottom (dark)
      new THREE.MeshPhysicalMaterial({ color: 0x0e0a08, roughness: 0.5, metalness: 0.5 }),
      // Front
      new THREE.MeshPhysicalMaterial({ ...baseProps, map: slice(frontU, frontW) }),
      // Back
      new THREE.MeshPhysicalMaterial({ ...baseProps, map: slice(backU, backW) })
    ];
  }

  bindEvents() {
    this._resizeHandler = () => this.onResize();
    window.addEventListener('resize', this._resizeHandler);
  }

  onResize() {
    const { w, h } = this.getSize();
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    this._rafId = requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._resizeHandler);
    this.renderer?.dispose();
    this.scene?.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}

// Auto-detect WebGL support
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
