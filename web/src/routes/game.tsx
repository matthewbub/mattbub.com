import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Route = createFileRoute("/game")({
  component: Games,
});

export default function Games() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      setErrorMsg("Mount not ready.");
      return;
    }

    let disposed = false;

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#ffffff");

      // Fixed canvas height for stable layout
      const fixedHeight = 420;
      const initialWidth = mount.clientWidth || 800;

      const camera = new THREE.PerspectiveCamera(
        60,
        initialWidth / fixedHeight,
        0.1,
        100
      );
      camera.position.set(0, 2.5, 6);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // Avoid writing inline width/height; let CSS control box size
      renderer.setSize(initialWidth, fixedHeight, false);
      // Ensure canvas behaves as a block-level responsive element
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.maxWidth = "100%";
      renderer.domElement.style.boxSizing = "border-box";
      mount.appendChild(renderer.domElement);

      // Lights
      const hemi = new THREE.HemisphereLight(0xffffff, 0xa0a0a0, 1.0);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xffffff, 0.6);
      dir.position.set(3, 5, 5);
      scene.add(dir);

      // Ground
      const groundGeo = new THREE.PlaneGeometry(20, 200, 10, 50);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0xe5e7eb, // matches --rule tone
        roughness: 0.9,
        metalness: 0.0,
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.z = -80;
      scene.add(ground);

      // Player
      const playerGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const playerMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
      const player = new THREE.Mesh(playerGeo, playerMat);
      player.position.set(0, 0.5, 0);
      scene.add(player);

      // Lane markers
      const laneLines: THREE.Mesh[] = [];
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x6b7280 });
      for (let i = 0; i < 30; i++) {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.01, 1.2),
          lineMat
        );
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.01, -i * 4);
        scene.add(line);
        laneLines.push(line);
      }

      // Obstacles
      const obstacles: THREE.Mesh[] = [];
      const obstacleMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
      const lanes = [-2, 0, 2]; // left, center, right

      function spawnObstacle(zOffset = -40) {
        const laneX = lanes[Math.floor(Math.random() * lanes.length)];
        const s = 0.6 + Math.random() * 0.4; // smaller, max 1.0 instead of 1.8
        const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), obstacleMat);
        m.position.set(laneX, 0.45, zOffset);
        // @ts-expect-error custom data
        m.userData.speed = 0.15 + Math.random() * 0.08; // slower and less variance
        scene.add(m);
        obstacles.push(m);
      }

      for (let i = 0; i < 5; i++) spawnObstacle(-10 - i * 15);

      // Input
      const keys = { left: false, right: false };
      const handleDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
          keys.left = true;
        if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
          keys.right = true;
      };
      const handleUp = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
          keys.left = false;
        if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
          keys.right = false;
      };
      window.addEventListener("keydown", handleDown);
      window.addEventListener("keyup", handleUp);

      // Resize: idempotent and throttled to next frame
      let lastWidth = initialWidth;
      let pendingResize = false;
      const onResize = () => {
        if (!mount) return;
        const w2 = mount.clientWidth || initialWidth;
        if (w2 === lastWidth || pendingResize) return;
        pendingResize = true;
        requestAnimationFrame(() => {
          if (!mount) return;
          lastWidth = w2;
          camera.aspect = w2 / fixedHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(w2, fixedHeight, false);
          pendingResize = false;
        });
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      // Game state
      let running = true;
      let laneIndex = 1; // 0 left, 1 center, 2 right
      let distance = 0;
      let speed = 0.22;
      let last = performance.now();

      function update(dt: number) {
        // Discrete lane changes per key press
        if (keys.left) {
          laneIndex = Math.max(0, laneIndex - 1);
          keys.left = false;
        }
        if (keys.right) {
          laneIndex = Math.min(2, laneIndex + 1);
          keys.right = false;
        }

        // Smooth move to lane
        const targetX = lanes[laneIndex];
        player.position.x += (targetX - player.position.x) * 0.2;

        // Move environment
        const dz = dt * speed;
        distance += dz;

        laneLines.forEach((l) => {
          l.position.z += dz * 6;
          if (l.position.z > 2) l.position.z -= 120; // loop
        });

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const o = obstacles[i];
          // @ts-expect-error custom data
          o.position.z += dz * 6 + o.userData.speed;
          if (o.position.z > 4) {
            scene.remove(o);
            obstacles.splice(i, 1);
            spawnObstacle(-70 - Math.random() * 30);
          }
        }

        // Collision
        for (const o of obstacles) {
          const dx = o.position.x - player.position.x;
          const dz2 = o.position.z - player.position.z;
          if (Math.abs(dx) < 0.7 && Math.abs(dz2) < 0.7) {
            running = false;
          }
        }
      }

      const loop = (t: number) => {
        if (disposed) return;
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        if (running) {
          update(dt);
        } else {
          // flash player on game over
          const s = 0.9 + Math.sin(t * 0.02) * 0.1;
          player.scale.set(s, s, s);
        }
        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
      setReady(true);
      setErrorMsg(null);
      console.log("[Games] Three.js scene mounted.");
      return () => {
        disposed = true;
        setReady(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        window.removeEventListener("keydown", handleDown);
        window.removeEventListener("keyup", handleUp);
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
        scene.traverse((obj: THREE.Object3D) => {
          const anyObj = obj as any;
          if (anyObj.geometry?.dispose) anyObj.geometry.dispose();
          if (anyObj.material) {
            const mats = Array.isArray(anyObj.material)
              ? anyObj.material
              : [anyObj.material];
            mats.forEach((m: any) => m?.dispose?.());
          }
        });
        renderer.dispose();
      };
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "WebGL failed to initialize.");
    }
  }, []);

  return (
    <>
      <Header />
      <main className="paper">
        <article className="lead" aria-labelledby="games-headline">
          <div className="kicker">Play</div>
          <h1 id="games-headline" className="headline">
            Endless Lanes — tiny Three.js runner
          </h1>
          <div className="byline">
            Arrow keys or A/D to switch lanes. Avoid the blue blocks.
          </div>
          <p className="deck">
            Minimal geometry, sharp contrasts, and smooth motion that fits the
            newspaper style. Clean shapes, no textures.
          </p>

          <div
            style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: 10,
              marginTop: 8,
            }}
          >
            <div
              ref={mountRef}
              style={{
                width: "100%",
                maxWidth: "100%",
                height: 420,
                border: "1px solid var(--border)",
                borderRadius: 6,
                overflow: "hidden",
                background: "var(--bg)",
              }}
            />
            <div className="byline" style={{ marginTop: 8 }}>
              {errorMsg
                ? `Error: ${errorMsg}`
                : ready
                  ? "Tip: tap left/right quickly to dodge clusters."
                  : "Loading WebGL…"}
            </div>
          </div>

          <div className="columns" style={{ marginTop: 16 }}>
            <p>
              Runs in a single render loop without physics libs. Obstacles are
              recycled for steady memory and constant GC pressure.
            </p>
            <p>
              Tweak speeds, lanes, and sizes to adjust difficulty—or swap cubes
              for low‑poly models.
            </p>
          </div>
        </article>

        <aside className="sidebar" aria-label="Sidebar">
          <section>
            <div className="section-head">Controls</div>
            <p className="tease">Left/Right or A/D — change lanes.</p>
          </section>
          <section>
            <div className="section-head">Tech</div>
            <p className="tease">Three.js, single scene, basic lighting.</p>
          </section>
        </aside>
      </main>
      <footer>
        <div>
          © <span id="y" /> Matt
        </div>
        <div>hand rolled</div>
      </footer>
    </>
  );
}
