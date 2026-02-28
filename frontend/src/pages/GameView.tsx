import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import World from '../components/three/World';
import PlayerController from '../components/three/PlayerController';
import HUD from '../components/HUD';
import ChatUI from '../components/ChatUI';
import PauseMenu from '../components/PauseMenu';
import InventoryUI from '../components/InventoryUI';
import JobBoard from '../components/JobBoard';
import InteractionPrompt from '../components/InteractionPrompt';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { useWantedLevel } from '../hooks/useWantedLevel';
import { useGetCallerUserProfile, useGetSettings } from '../hooks/useQueries';
import { Variant_firstPerson_thirdPerson } from '../backend';

interface GameViewProps {
  onExit: () => void;
}

const KEY_MAP = [
  { keys: ['KeyW', 'ArrowUp'], name: 'forward' },
  { keys: ['KeyS', 'ArrowDown'], name: 'backward' },
  { keys: ['KeyA', 'ArrowLeft'], name: 'left' },
  { keys: ['KeyD', 'ArrowRight'], name: 'right' },
  { keys: ['Space'], name: 'jump' },
  { keys: ['ShiftLeft', 'ShiftRight'], name: 'sprint' },
];

export default function GameView({ onExit }: GameViewProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [interactionText, setInteractionText] = useState('');
  const [showInteraction, setShowInteraction] = useState(false);
  const [equippedItem, setEquippedItem] = useState<string>('Fists');
  const [cameraMode, setCameraMode] = useState<'first' | 'third'>('third');
  const [flightEnabled, setFlightEnabled] = useState(false);

  const playerPosRef = useRef(new THREE.Vector3(0, 2, 0));
  const { stats, eat, drink, takeDamage } = usePlayerStats();
  const { wantedLevel, addWanted } = useWantedLevel();
  const { data: profile } = useGetCallerUserProfile();
  const { data: settings } = useGetSettings();

  // Apply saved camera mode from settings
  useEffect(() => {
    if (settings?.cameraMode === Variant_firstPerson_thirdPerson.firstPerson) {
      setCameraMode('first');
    } else {
      setCameraMode('third');
    }
  }, [settings?.cameraMode]);

  const violenceEnabled = settings?.violenceToggle ?? true;
  const chatEnabled = settings?.chatEnabled ?? true;

  // ESC key for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') {
        setIsPaused((p) => !p);
        setShowInventory(false);
        setShowJobBoard(false);
      }
      if (e.code === 'KeyI' && !isPaused) {
        setShowInventory((v) => !v);
      }
      if (e.code === 'KeyJ' && !isPaused) {
        setShowJobBoard((v) => !v);
      }
      if (e.code === 'KeyV' && !isPaused) {
        setCameraMode((m) => (m === 'first' ? 'third' : 'first'));
      }
      if (e.code === 'KeyG' && !isPaused) {
        setFlightEnabled((f) => !f);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  const handleInteract = useCallback((text: string) => {
    setInteractionText(text);
    setShowInteraction(true);
    setTimeout(() => setShowInteraction(false), 2500);
  }, []);

  const handleEquip = (itemId: string) => {
    const itemNames: Record<string, string> = {
      fists: 'Fists', sword: 'Iron Sword', pistol: 'Pistol',
      rifle: 'Assault Rifle', laser: 'Laser Blaster', grenade: 'Grenade',
    };
    if (itemNames[itemId]) setEquippedItem(itemNames[itemId]);
  };

  const anyModalOpen = isPaused || showInventory || showJobBoard;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 3D Canvas */}
      <KeyboardControls map={KEY_MAP}>
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 600, position: [0, 5, 10] }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <World
            playerPos={playerPosRef}
            wantedLevel={wantedLevel}
            violenceEnabled={violenceEnabled}
            onInteract={handleInteract}
          />
          <PlayerController
            playerPosRef={playerPosRef}
            cameraMode={cameraMode}
            flightEnabled={flightEnabled}
            paused={anyModalOpen}
            onInteract={handleInteract}
            onEat={eat}
            onDrink={drink}
            onTakeDamage={takeDamage}
            onAddWanted={addWanted}
          />
        </Canvas>
      </KeyboardControls>

      {/* HUD */}
      {!anyModalOpen && (
        <HUD
          health={stats.health}
          hunger={stats.hunger}
          thirst={stats.thirst}
          armor={stats.armor}
          wantedLevel={wantedLevel}
          playerPos={{ x: playerPosRef.current.x, z: playerPosRef.current.z }}
          equippedItem={equippedItem}
          job={profile?.currentJob}
        />
      )}

      {/* Interaction Prompt */}
      <InteractionPrompt text={interactionText} visible={showInteraction && !anyModalOpen} />

      {/* Chat */}
      {!anyModalOpen && <ChatUI enabled={chatEnabled} />}

      {/* Top bar controls */}
      {!anyModalOpen && (
        <div className="fixed top-3 right-3 z-30 flex gap-2">
          <button
            onClick={() => setCameraMode((m) => (m === 'first' ? 'third' : 'first'))}
            className="panel-glass rounded px-2 py-1 font-gaming text-xs text-neon-orange border border-neon-orange/30 hover:border-neon-orange/60"
          >
            {cameraMode === 'first' ? '1ST' : '3RD'} PERSON [V]
          </button>
          <button
            onClick={() => setFlightEnabled((f) => !f)}
            className={`panel-glass rounded px-2 py-1 font-gaming text-xs border ${
              flightEnabled ? 'text-neon-yellow border-neon-yellow/50' : 'text-muted-foreground border-border'
            }`}
          >
            {flightEnabled ? '✈ FLIGHT ON' : '✈ FLIGHT [G]'}
          </button>
          <button
            onClick={() => setShowInventory(true)}
            className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
          >
            INVENTORY [I]
          </button>
          <button
            onClick={() => setShowJobBoard(true)}
            className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
          >
            JOBS [J]
          </button>
          <button
            onClick={() => setIsPaused(true)}
            className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
          >
            MENU [ESC]
          </button>
        </div>
      )}

      {/* Modals */}
      {isPaused && <PauseMenu onResume={() => setIsPaused(false)} onExit={onExit} />}
      {showInventory && (
        <InventoryUI
          onClose={() => setShowInventory(false)}
          onEquip={handleEquip}
          flightEnabled={flightEnabled}
          onToggleFlight={() => setFlightEnabled((f) => !f)}
        />
      )}
      {showJobBoard && <JobBoard onClose={() => setShowJobBoard(false)} />}
    </div>
  );
}
