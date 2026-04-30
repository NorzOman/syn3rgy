"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function PrizePoolHeader() {
  return (
    <div className="flex flex-col items-center w-full px-4 pt-5 pb-2 md:pt-8 md:pb-3 pointer-events-none">
      {/* PRIZE VAULT title */}
      <h1 className="text-white text-3xl md:text-6xl font-black italic tracking-tighter leading-none"
        style={{ textShadow: '0 0 40px rgba(255,80,0,0.9), 0 0 80px rgba(255,0,0,0.4)' }}>
        PRIZE VAULT
      </h1>

      {/* Total pool badge */}
      <div className="mt-2 md:mt-3 flex flex-col items-center">
        <div
          className="relative px-4 md:px-8 py-1 md:py-2 rounded-full border border-amber-400/50"
          style={{ background: 'linear-gradient(135deg, rgba(255,160,0,0.25), rgba(255,80,0,0.15))', boxShadow: '0 0 30px rgba(255,140,0,0.4)' }}
        >
          <div className="flex items-center gap-1.5 md:gap-3">
            <span className="text-amber-300/80 text-[9px] md:text-sm font-bold uppercase tracking-[0.3em]">Total Prize Pool</span>
            <span className="text-amber-300 text-xl md:text-6xl font-black italic tracking-tight" style={{ textShadow: '0 0 20px rgba(255,180,0,0.8) animate-pulse-glow'}}>
              ₹75,000
            </span>
          </div>
        </div>

        {/* In-kind disclaimer */}
        <div className="mt-4 md:mt-2 flex items-center gap-1.5 md:gap-2">
          <div className="w-3 md:w-5 h-px bg-white/30" />
          <span className="text-white/45 text-[7px] md:text-[11px] font-semibold uppercase tracking-[0.2em]">
            Incl. ₹25,000 in-kind · ₹50,000 cash
          </span>
          <div className="w-3 md:w-5 h-px bg-white/30" />
        </div>
      </div>

      {/* Sub-label */}
      <p className="text-white/40 mt-1 text-[7px] md:text-xs font-bold uppercase tracking-[0.4em]">
        Target Locked · Eliminate to Reveal
      </p>
    </div>
  );
}

export default function PrizeVaultPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [ammo, setAmmo] = useState(2);

  // New Data Structure based on your request
  const CARDS_DATA = [
    { id: "c1", prize: "₹25,000", pos: -1.6, color: "#0088FF", img: "/queen_trophy.webp", frontImg: "/queenheart_blue.webp" },
    { id: "c2", prize: "₹35,000", pos: 0, color: "#FF8C00", img: "/king_trophy.webp", frontImg: "/kingspade_red.webp" },
    { id: "c3", prize: "₹15,000", pos: 1.6, color: "#00CC55", img: "/jack_trophy.webp", frontImg: "/jackclub_green.webp" }
  ];

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2)); // Boost light for textures

    // --- 3. TARGET CARDS (Updated for Neon UI) ---
    const targets: THREE.Group[] = [];
    const texLoader = new THREE.TextureLoader();

    CARDS_DATA.forEach(data => {
      const g = new THREE.Group();
      // Adjust height/depth slightly to fit the fan-out look
      const zOffset = Math.abs(data.pos) > 0 ? 2.8 : 3.0; 
      g.position.set(data.pos, 1.15, zOffset);

      if (data.pos < 0) g.rotation.y = 0.3;      // Tilt toward center
      else if (data.pos > 0) g.rotation.y = -0.3;
      
      // Geometry for a tall playing card
      const geo = new THREE.PlaneGeometry(1.2, 1.7);
      
      // Front Material (The Neon King/Queen/Jack)
      const frontMat = new THREE.MeshStandardMaterial({ 
        map: texLoader.load(data.frontImg),
        roughness: 0.6
      });

      // Back Material (The Prize Reveal)
      // Note: We use a simple texture for the prize for now
      const backMat = new THREE.MeshStandardMaterial({ 
        map: texLoader.load(data.img), // This is your trophy image
        transparent: true 
      });

      const front = new THREE.Mesh(geo, frontMat);
      const back = new THREE.Mesh(geo, backMat);
      back.rotation.y = Math.PI; // Face the other way
      
      g.add(front, back);
      scene.add(g);
      targets.push(g);
    });

    // --- 4. GUN SYSTEM (Keep your existing GLTF Loader here) ---
    let mixer: THREE.AnimationMixer;
    let actions: Record<string, THREE.AnimationAction> = {};
    let pistolGroup = new THREE.Group();
    let isActionLocked = false;
    let localAmmo = 2;
    let currentAction: THREE.AnimationAction;

    new GLTFLoader().load('/pistol_model/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.position.set(-0.3, -0.4, 1.1); 
      model.rotation.y = Math.PI;
      model.scale.set(0.7, 0.7, 0.7);
      pistolGroup.add(model);
      pistolGroup.position.set(0, 0.5, 3.5); 
      scene.add(pistolGroup);
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach(clip => { actions[clip.name] = mixer.clipAction(clip); });
      if (actions['Pistol_WALK']) { currentAction = actions['Pistol_WALK']; currentAction.play(); }
    });

    const raycaster = new THREE.Raycaster();

    const shoot = () => {
      if (isActionLocked || localAmmo <= 0) return;
      isActionLocked = true;
      localAmmo--;
      setAmmo(localAmmo);

      if (flashRef.current) {
        flashRef.current.style.opacity = '1';
        setTimeout(() => { if (flashRef.current) flashRef.current.style.opacity = '0'; }, 50);
      }

      // Handle Animation
      const animName = localAmmo === 0 ? 'Pistol_FIRE_EMPTY' : 'Pistol_FIRE';
      const next = actions[animName];
      if (next) {
        if (currentAction) currentAction.crossFadeTo(next, 0.1, true);
        next.reset().setLoop(THREE.LoopOnce, 1).play();
        next.clampWhenFinished = true;
      }

      // Hit detection
      raycaster.setFromCamera(new THREE.Vector2(mouse.current.x, mouse.current.y), camera);
      const hits = raycaster.intersectObjects(targets, true);
      if (hits.length > 0) {
        let card = hits[0].object;
        while (card.parent && !targets.includes(card as THREE.Group)) card = card.parent;
        card.userData.spinning = true; // Trigger the reveal spin
      }

      setTimeout(() => {
        isActionLocked = false;
        // Simple reload logic
        if (localAmmo === 0) {
            setAmmo(2);
            localAmmo = 2;
        }
      }, 800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      const crosshair = document.querySelector('.crosshair') as HTMLElement;
      if (crosshair) {
        crosshair.style.left = `${e.clientX}px`;
        crosshair.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', (e) => e.button === 0 && shoot());

    const clock = new THREE.Clock();
    const tick = () => {
      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);
      
      pistolGroup.rotation.y = Math.max(-0.33, Math.min(0.5, -mouse.current.x * 1.0));

      targets.forEach(t => {
        if (t.userData.spinning) {
            // Smoothly rotate 180 degrees to show the back
            t.rotation.y += dt * 10;
            if (t.rotation.y >= Math.PI) {
                t.rotation.y = Math.PI;
                t.userData.spinning = false;
            }
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      renderer.dispose();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="vault-wrapper">
      <div className="absolute inset-0 z-0 bg-center bg-cover" style={{ backgroundImage: "url('/bg_prize.webp')", filter: 'brightness(0.6) contrast(1.2)' }} />
      <div ref={containerRef} className="game-viewport relative z-10"/>
      <div className="crosshair z-50"><div className="dot"></div><div className="ring"></div></div>
      <div ref={flashRef} className="muzzle-flash" />
      <div className="absolute top-0 left-0 w-full z-50"><PrizePoolHeader /></div>
      <div className="hud-bottom z-50"><div className="ammo-display">{ammo} / 2</div></div>
      
      <style jsx>{`
        .vault-wrapper { position: relative; width: 100%; height: 100vh; overflow: hidden; cursor: none; }
        .game-viewport { width: 100%; height: 100%; }
        .crosshair { position: fixed; width: 40px; height: 40px; pointer-events: none; transform: translate(-50%, -50%); }
        .dot { position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; background: #FF8C00; border-radius: 50%; transform: translate(-50%, -50%); }
        .ring { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 2px solid rgba(255, 140, 0, 0.3); border-radius: 50%; }
        .hud-bottom { position: absolute; right: 40px; bottom: 40px; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 10px; border-left: 4px solid #FF8C00; }
        .ammo-display { font-size: 40px; font-weight: 900; color: #fff; }
        .muzzle-flash { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: 0; pointer-events: none; z-index: 99; transition: opacity 0.05s; }
      `}</style>
    </div>
  );
}