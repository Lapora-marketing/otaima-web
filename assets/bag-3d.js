// ═════════════════════════════════════════════════════════════
//  OTAIMA · 3D Coffee Bag Renderer
//  Three.js procedural bag with texture mapping
// ═════════════════════════════════════════════════════════════

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * CoffeeBag3D — Renderiza una bolsa de café en 3D con textura
 *
 * @param {HTMLElement} container - Elemento DOM contenedor
 * @param {Object} opts
 * @param {string} opts.textureUrl - URL de la imagen completa (composición de la bolsa)
 * @param {number} opts.frontU - Offset U inicio del frente (0-1)
 * @param {number} opts.frontW - Ancho del frente en UV (0-1)
 * @param {number} opts.backU - Offset U del dorso (0-1)
 * @param {number} opts.backW - Ancho del dorso en UV (0-1)
 * @param {number} opts.sideU - Offset U del lateral (0-1)
 * @param {number} opts.sideW - Ancho del lateral en UV (0-1)
 * @param {string} opts.accentColor - Color hex del rim light
 */
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
      bagWidth: 2.4,
      bagHeight: 3.6,
      bagDepth: 0.9,
      autoRotate: true
    }, opts);

    this.init();
    this.load();
    this.bindEvents();
    this.animate();
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 9);

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
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = this.opts.autoRotate;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = (2 * Math.PI) / 3;

    // Lighting setup — premium 3-point
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);

    // Key light (main, warm)
    const keyLight = new THREE.DirectionalLight(0xfff2d8, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill light (cool)
    const fillLight = new THREE.DirectionalLight(0xa8c4ff, 0.4);
    fillLight.position.set(-5, 3, 3);
    this.scene.add(fillLight);

    // Rim light (accent color)
    const rimLight = new THREE.DirectionalLight(this.opts.accentColor, 1.5);
    rimLight.position.set(-2, 3, -6);
    this.scene.add(rimLight);

    // Soft top light
    const topLight = new THREE.DirectionalLight(0xffeac4, 0.5);
    topLight.position.set(0, 8, 0);
    this.scene.add(topLight);

    // Ground shadow plane (invisible, only receives shadows)
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.5 });
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      shadowMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -this.opts.bagHeight / 2 - 0.3;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);
  }

  load() {
    const loader = new THREE.TextureLoader();
    loader.load(this.opts.textureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      this.buildBag(texture);
    }, undefined, (err) => {
      console.error('Error loading bag texture:', err);
      this.buildBag(null);
    });
  }

  buildBag(texture) {
    const { bagWidth: w, bagHeight: h, bagDepth: d } = this.opts;

    // Bag body — rounded box (premium pouch shape)
    const geometry = new RoundedBoxGeometry(w, h, d, 6, 0.12);

    // Generate UV-mapped materials for each face
    // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z (right, left, top, bottom, front, back)
    const materials = this.createMaterials(texture);
    const bag = new THREE.Mesh(geometry, materials);
    bag.castShadow = true;
    bag.receiveShadow = true;
    this.scene.add(bag);
    this.bag = bag;

    // Add subtle "seal" lines at top (the metalized strip)
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0x1a1614,
      metalness: 0.6,
      roughness: 0.4
    });

    const topSeal = new THREE.Mesh(
      new RoundedBoxGeometry(w * 1.02, 0.18, d * 1.02, 2, 0.04),
      sealMat
    );
    topSeal.position.y = h / 2 - 0.09;
    topSeal.castShadow = true;
    this.scene.add(topSeal);

    const bottomSeal = new THREE.Mesh(
      new RoundedBoxGeometry(w * 1.02, 0.14, d * 1.02, 2, 0.04),
      sealMat
    );
    bottomSeal.position.y = -h / 2 + 0.07;
    bottomSeal.castShadow = true;
    this.scene.add(bottomSeal);

    // Two metallic clips on the top (rose gold)
    const clipMat = new THREE.MeshStandardMaterial({
      color: 0xc8946a,
      metalness: 0.95,
      roughness: 0.25
    });
    const clipGeom = new RoundedBoxGeometry(0.25, 0.35, d * 1.1, 2, 0.05);

    const clipL = new THREE.Mesh(clipGeom, clipMat);
    clipL.position.set(-w / 2 + 0.3, h / 2 + 0.05, 0);
    clipL.castShadow = true;
    this.scene.add(clipL);

    const clipR = new THREE.Mesh(clipGeom, clipMat);
    clipR.position.set(w / 2 - 0.3, h / 2 + 0.05, 0);
    clipR.castShadow = true;
    this.scene.add(clipR);

    // Hide rotation hint after first interaction
    const hint = this.container.parentElement?.querySelector('.rotation-hint');
    if (hint) {
      this.controls.addEventListener('start', () => {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.5s';
      });
    }
  }

  createMaterials(texture) {
    const { frontU, frontW, backU, backW, sideU, sideW } = this.opts;

    if (!texture) {
      // Fallback solid color
      const fallback = new THREE.MeshPhysicalMaterial({
        color: 0x1a1614,
        roughness: 0.7,
        metalness: 0.2
      });
      return Array(6).fill(fallback);
    }

    // Helper to clone texture with specific UV offset/repeat
    const sliceTexture = (offsetU, repeatU, flipY = true) => {
      const t = texture.clone();
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.offset.set(offsetU, 0);
      t.repeat.set(repeatU, 1);
      t.flipY = flipY;
      return t;
    };

    const baseMaterialProps = {
      roughness: 0.65,
      metalness: 0.15,
      sheen: 0.4,
      sheenRoughness: 0.5,
      sheenColor: 0x2a2018
    };

    // Six faces of RoundedBoxGeometry (same as BoxGeometry)
    // Order: right (+X), left (-X), top (+Y), bottom (-Y), front (+Z), back (-Z)
    return [
      // Right side (lateral)
      new THREE.MeshPhysicalMaterial({
        ...baseMaterialProps,
        map: sliceTexture(sideU, sideW)
      }),
      // Left side (lateral, mirrored)
      new THREE.MeshPhysicalMaterial({
        ...baseMaterialProps,
        map: sliceTexture(sideU, sideW)
      }),
      // Top (sealed) — dark
      new THREE.MeshPhysicalMaterial({
        color: 0x0e0a08,
        roughness: 0.4,
        metalness: 0.6
      }),
      // Bottom — dark
      new THREE.MeshPhysicalMaterial({
        color: 0x0e0a08,
        roughness: 0.4,
        metalness: 0.6
      }),
      // Front
      new THREE.MeshPhysicalMaterial({
        ...baseMaterialProps,
        map: sliceTexture(frontU, frontW)
      }),
      // Back
      new THREE.MeshPhysicalMaterial({
        ...baseMaterialProps,
        map: sliceTexture(backU, backW)
      })
    ];
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
    this.scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}
