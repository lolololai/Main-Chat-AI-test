import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface ThreeViewProps {
  
  modelType?: "cyber-cube" | "retro-torus" | "crystal-sphere" | "game-asset";
  
  modelUrl?: string;
  title?: string;
  wireframeDefault?: boolean;
}

interface ModelSource {
  url: string;
  label: string;
  isObject: boolean;
}

interface ViewerApi {
  setWireframe: (value: boolean) => void;
  setTint: (index: number) => void;
  setAutoRotate: (value: boolean) => void;
  setAnimationPlaying: (value: boolean) => void;
  resetView: () => void;
}

const COLORS = [
  { name: "Pastel Pink", main: 0xec587e, wire: 0xf472b6 },
  { name: "Cyan Cyber", main: 0x0ea5e9, wire: 0x38bdf8 },
  { name: "Emerald", main: 0x10b981, wire: 0x34d399 },
  { name: "Sunset Gold", main: 0xf59e0b, wire: 0xfbbf24 },
];

const DEFAULT_CAMERA = new THREE.Vector3(0, 1.1, 4.2);

function makeSource(url: string, label?: string, isObject = false): ModelSource {
  const fileName = url.split("/").pop() || "3D Model";
  return { url, label: label ? `${label} · ${fileName}` : fileName, isObject };
}

function buildFallbackGeometry(modelType: ThreeViewProps["modelType"]): THREE.BufferGeometry {
  switch (modelType) {
    case "retro-torus":
      return new THREE.TorusKnotGeometry(0.85, 0.28, 128, 32);
    case "crystal-sphere":
      return new THREE.IcosahedronGeometry(1.1, 2);
    case "game-asset":
      return new THREE.DodecahedronGeometry(1.1, 0);
    case "cyber-cube":
    default:
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
  }
}

export default function ThreeView({
  modelType = "cyber-cube",
  modelUrl,
  title,
  wireframeDefault = false,
}: ThreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const viewerApiRef = useRef<ViewerApi | null>(null);

  const [wireframe, setWireframe] = useState<boolean>(wireframeDefault);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<number>(0);
  const [animationPlaying, setAnimationPlaying] = useState<boolean>(true);
  const [hasAnimation, setHasAnimation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errorRetryable, setErrorRetryable] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [source, setSource] = useState<ModelSource | null>(() =>
    modelUrl ? makeSource(modelUrl, title) : null,
  );
  const lastModelUrlRef = useRef(modelUrl);

  const wireframeRef = useRef(wireframe);
  const colorModeRef = useRef(colorMode);
  const autoRotateRef = useRef(autoRotate);
  wireframeRef.current = wireframe;
  colorModeRef.current = colorMode;
  autoRotateRef.current = autoRotate;

  const activeUrl = source?.url ?? null;

  useEffect(() => {
    if (lastModelUrlRef.current === modelUrl) return;
    lastModelUrlRef.current = modelUrl;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSource(modelUrl ? makeSource(modelUrl, title) : null);
    setLoadError(null);
  }, [modelUrl, title]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let width = container.clientWidth || 480;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(DEFAULT_CAMERA);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-canvas";
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    room.dispose();

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    scene.add(new THREE.HemisphereLight(0xfde2ec, 0x1e293b, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const tintLight = new THREE.PointLight(COLORS[colorModeRef.current].main, 24, 16);
    tintLight.position.set(-3, 2, -2.5);
    scene.add(tintLight);

    const grid = new THREE.GridHelper(10, 20, 0x5b6b8c, 0x2b3a54);
    grid.position.y = -1.25;
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.45;
    scene.add(grid);

    const shadowMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.32 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), shadowMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.25;
    ground.receiveShadow = true;
    scene.add(ground);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 9;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.6;
    controls.target.set(0, 0, 0);
    controls.update();

    const content = new THREE.Group();
    scene.add(content);

    let mixer: THREE.AnimationMixer | null = null;
    let action: THREE.AnimationAction | null = null;
    let fallbackMesh: THREE.Mesh | null = null;
    let fallbackWire: THREE.LineSegments | null = null;

    function disposeContent() {
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
        mixer = null;
        action = null;
      }
      content.traverse((object) => {
        const node = object as THREE.Mesh;
        if (node.geometry) node.geometry.dispose();
        const material = node.material as THREE.Material | THREE.Material[] | undefined;
        if (!material) return;
        const list = Array.isArray(material) ? material : [material];
        list.forEach((mat) => {
          Object.values(mat).forEach((value) => {
            if (value && (value as THREE.Texture).isTexture) {
              (value as THREE.Texture).dispose();
            }
          });
          mat.dispose();
        });
      });
      content.clear();
      fallbackMesh = null;
      fallbackWire = null;
      setHasAnimation(false);
    }

    function applyWireframe(value: boolean) {
      content.traverse((object) => {
        const node = object as THREE.Mesh;
        const material = node.material as THREE.Material | THREE.Material[] | undefined;
        if (!material) return;
        const list = Array.isArray(material) ? material : [material];
        list.forEach((mat) => {
          if ("wireframe" in mat) (mat as THREE.MeshStandardMaterial).wireframe = value;
        });
      });
      if (fallbackWire) fallbackWire.visible = !value;
    }

    function applyTint(index: number) {
      tintLight.color.setHex(COLORS[index].main);
      if (fallbackMesh) {
        (fallbackMesh.material as THREE.MeshStandardMaterial).color.setHex(COLORS[index].main);
      }
      if (fallbackWire) {
        (fallbackWire.material as THREE.LineBasicMaterial).color.setHex(COLORS[index].wire);
      }
    }

    function createFallback() {
      disposeContent();
      const geometry = buildFallbackGeometry(modelType);
      const material = new THREE.MeshStandardMaterial({
        color: COLORS[colorModeRef.current].main,
        metalness: 0.6,
        roughness: 0.25,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      content.add(mesh);
      fallbackMesh = mesh;

      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({
        color: COLORS[colorModeRef.current].wire,
        transparent: true,
        opacity: 0.4,
      });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      content.add(wire);
      fallbackWire = wire;

      applyWireframe(wireframeRef.current);
    }

    function fitToStage(root: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const scale = 3 / maxDimension;
      root.scale.setScalar(scale);
      root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      const scaledBox = new THREE.Box3().setFromObject(root);
      root.position.y += -1.2 - scaledBox.min.y;
    }

    viewerApiRef.current = {
      setWireframe: applyWireframe,
      setTint: applyTint,
      setAutoRotate: (value) => {
        controls.autoRotate = value;
      },
      setAnimationPlaying: (value) => {
        if (action) action.paused = !value;
      },
      resetView: () => {
        camera.position.copy(DEFAULT_CAMERA);
        controls.target.set(0, 0, 0);
        controls.update();
      },
    };

    if (activeUrl) {
      setLoading(true);
      setProgress(0);
      setLoadError(null);

      const loader = new GLTFLoader();
      loader.load(
        activeUrl,
        (gltf) => {
          if (disposed) return;
          disposeContent();
          const root = gltf.scene;
          root.traverse((object) => {
            const node = object as THREE.Mesh;
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          fitToStage(root);
          content.add(root);

          if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(root);
            action = mixer.clipAction(gltf.animations[0]);
            action.play();
            setHasAnimation(true);
          }

          applyWireframe(wireframeRef.current);
          applyTint(colorModeRef.current);
          setProgress(100);
          setLoading(false);
        },
        (event) => {
          if (disposed || !event.total) return;
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
        (error) => {
          if (disposed) return;
          console.error("[ThreeView] ไม่สามารถโหลดโมเดล 3D:", error);
          setLoading(false);
          setLoadError("โหลดโมเดลไม่สำเร็จ — ตรวจสอบไฟล์ แล้วลองนำเข้าใหม่");
          setErrorRetryable(true);
          createFallback();
        },
      );
    } else {
      createFallback();
    }

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (!newWidth || !newHeight) return;
      width = newWidth;
      height = newHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    const timer = new THREE.Timer();
    timer.connect(document);
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      timer.update();
      if (mixer) mixer.update(timer.getDelta());
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      timer.disconnect();
      resizeObserver.disconnect();
      controls.dispose();
      disposeContent();
      grid.geometry.dispose();
      gridMat.dispose();
      ground.geometry.dispose();
      shadowMaterial.dispose();
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      if (viewerApiRef.current) viewerApiRef.current = null;
    };
  }, [activeUrl, modelType, reloadKey]);

  useEffect(() => {
    viewerApiRef.current?.setWireframe(wireframe);
  }, [wireframe]);
  useEffect(() => {
    viewerApiRef.current?.setTint(colorMode);
  }, [colorMode]);
  useEffect(() => {
    viewerApiRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);
  useEffect(() => {
    viewerApiRef.current?.setAnimationPlaying(animationPlaying);
  }, [animationPlaying]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "glb" && extension !== "gltf") {
      setLoadError("รองรับเฉพาะไฟล์โมเดล .glb หรือ .gltf");
      setErrorRetryable(false);
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setSource({ url, label: file.name, isObject: true });
    setLoadError(null);
  }

  return (
    <div className="three-viewport-wrapper">
      <div className="three-viewport-header">
        <span className="three-hint-text">ลากเพื่อหมุน 360° • สกอร์ลเพื่อซูม</span>
      </div>

      <div className="three-stage">
        <div className="three-canvas-container" ref={containerRef} />

        {loading && (
          <div className="three-stage-overlay" role="status" aria-label="กำลังโหลดโมเดล 3D">
            <div className="three-spinner" />
            <span className="three-overlay-title">กำลังโหลดโมเดล 3D…</span>
            <span className="three-overlay-sub">{source?.label}</span>
            <div className="three-progress-track">
              <div className="three-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {!loading && loadError && (
          <div className="three-error-banner" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{loadError}</span>
            {errorRetryable && (
              <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                ลองใหม่
              </button>
            )}
          </div>
        )}

        <div className="three-stage-badge">
          <span className="three-live-dot" />
          {source?.label ?? "Procedural Geometry"}
        </div>
      </div>

      <div className="three-viewport-toolbar">
        <button
          type="button"
          className={`three-btn ${autoRotate ? "active" : ""}`}
          onClick={() => setAutoRotate(!autoRotate)}
          title="เปิด/ปิดการหมุนอัตโนมัติ"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>{autoRotate ? "หมุนอัตโนมัติ" : "หมุนเอง"}</span>
        </button>

        <button
          type="button"
          className={`three-btn ${wireframe ? "active" : ""}`}
          onClick={() => setWireframe(!wireframe)}
          title="สลับโหมดโครงลวด (Wireframe)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>{wireframe ? "Wireframe" : "Shaded"}</span>
        </button>

        {hasAnimation && (
          <button
            type="button"
            className={`three-btn ${animationPlaying ? "active" : ""}`}
            onClick={() => setAnimationPlaying(!animationPlaying)}
            title="เล่น/หยุดอนิเมชันของโมเดล"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              {animationPlaying ? (
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
            <span>{animationPlaying ? "อนิเมชัน: เล่น" : "อนิเมชัน: หยุด"}</span>
          </button>
        )}

        <button type="button" className="three-btn" onClick={() => viewerApiRef.current?.resetView()} title="รีเซ็ตมุมมอง">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <polyline points="3 3 3 8 8 8" />
          </svg>
          <span>รีเซ็ตมุมมอง</span>
        </button>

        <input
          ref={fileInputRef}
          className="three-file-input"
          type="file"
          accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
          onChange={handleFileSelected}
          aria-label="เลือกไฟล์โมเดล 3D"
        />
      </div>
    </div>
  );
}
