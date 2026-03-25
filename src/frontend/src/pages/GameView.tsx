import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GameJob, Variant_firstPerson_thirdPerson } from "../backend";
import ChatUI from "../components/ChatUI";
import FirstResponderMissionPanel from "../components/FirstResponderMissionPanel";
import GameErrorBoundary from "../components/GameErrorBoundary";
import HUD from "../components/HUD";
import InteractionPrompt from "../components/InteractionPrompt";
import InventoryUI from "../components/InventoryUI";
import JobBoard from "../components/JobBoard";
import PauseMenu from "../components/PauseMenu";
import PoliceMissionPanel from "../components/PoliceMissionPanel";
import PolicePatrolRoute from "../components/PolicePatrolRoute";
import SWATMissionPanel from "../components/SWATMissionPanel";
import TouchActionButtons from "../components/TouchActionButtons";
import VirtualJoystick from "../components/VirtualJoystick";
import PlayerController from "../components/three/PlayerController";
import World from "../components/three/World";
import { usePlayerStats } from "../hooks/usePlayerStats";
import {
  useGetCallerUserProfile,
  useGetJobProgress,
  useGetSettings,
} from "../hooks/useQueries";
import { useTouchControls } from "../hooks/useTouchControls";
import { useWantedLevel } from "../hooks/useWantedLevel";

interface GameViewProps {
  onExit: () => void;
}

const KEY_MAP = [
  { keys: ["KeyW", "ArrowUp"], name: "forward" },
  { keys: ["KeyS", "ArrowDown"], name: "backward" },
  { keys: ["KeyA", "ArrowLeft"], name: "left" },
  { keys: ["KeyD", "ArrowRight"], name: "right" },
  { keys: ["Space"], name: "jump" },
  { keys: ["ShiftLeft", "ShiftRight"], name: "sprint" },
];

export default function GameView({ onExit }: GameViewProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [interactionText, setInteractionText] = useState("");
  const [showInteraction, setShowInteraction] = useState(false);
  const [equippedItem, setEquippedItem] = useState<string>("Fists");
  const [cameraMode, setCameraMode] = useState<"first" | "third">("third");
  const [flightEnabled, setFlightEnabled] = useState(false);

  // Building interior state
  const [isInsideBuilding, setIsInsideBuilding] = useState(false);
  const [currentBuildingType, setCurrentBuildingType] = useState<string | null>(
    null,
  );
  const outdoorPlayerPos = useRef(new THREE.Vector3(0, 2, 0));

  // Career stats
  const [arrestCount, setArrestCount] = useState(0);
  const [patrolProgress, setPatrolProgress] = useState(0);
  const [rescueCount, setRescueCount] = useState(0);
  const [firesSuppressed, _setFiresSuppressed] = useState(0);
  const [operationsCompleted, _setOperationsCompleted] = useState(0);

  const playerPosRef = useRef(new THREE.Vector3(0, 2, 0));
  const { stats, eat, drink, takeDamage } = usePlayerStats();
  const { wantedLevel, addWanted, clearWanted } = useWantedLevel();
  const { data: profile } = useGetCallerUserProfile();
  const { data: settings } = useGetSettings();
  const { data: jobProgress } = useGetJobProgress();

  const currentJob = profile?.currentJob;

  // Touch controls
  const {
    isTouchDevice,
    joystick,
    actions: touchActions,
    cameraTouch,
    setJoystick,
    setAction,
    resetCameraDelta,
  } = useTouchControls();

  // Apply saved camera mode from settings
  useEffect(() => {
    if (settings?.cameraMode === Variant_firstPerson_thirdPerson.firstPerson) {
      setCameraMode("first");
    } else {
      setCameraMode("third");
    }
  }, [settings?.cameraMode]);

  // Clear wanted level when player is a police officer or SWAT
  // biome-ignore lint/correctness/useExhaustiveDependencies: clearWanted is stable
  useEffect(() => {
    if (currentJob === GameJob.policeOfficer || currentJob === GameJob.swat) {
      clearWanted();
    }
  }, [currentJob]);

  const violenceEnabled = settings?.violenceToggle ?? true;
  const chatEnabled = settings?.chatEnabled ?? true;

  // ESC key for pause (desktop only)
  useEffect(() => {
    if (isTouchDevice) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "Escape") {
        setIsPaused((p) => !p);
        setShowInventory(false);
        setShowJobBoard(false);
      }
      if (e.code === "KeyI" && !isPaused) {
        setShowInventory((v) => !v);
      }
      if (e.code === "KeyJ" && !isPaused) {
        setShowJobBoard((v) => !v);
      }
      if (e.code === "KeyV" && !isPaused) {
        setCameraMode((m) => (m === "first" ? "third" : "first"));
      }
      if (e.code === "KeyG" && !isPaused) {
        setFlightEnabled((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, isTouchDevice]);

  const handleInteract = useCallback((text: string) => {
    setInteractionText(text);
    setShowInteraction(true);
    setTimeout(() => setShowInteraction(false), 2500);
  }, []);

  const handleEquip = (itemId: string) => {
    const itemNames: Record<string, string> = {
      fists: "Fists",
      sword: "Iron Sword",
      pistol: "Pistol",
      rifle: "Assault Rifle",
      laser: "Laser Blaster",
      grenade: "Grenade",
      baton: "Police Baton",
      taser: "Taser",
      handcuffs: "Handcuffs",
      medkit: "Med Kit",
      extinguisher: "Fire Extinguisher",
      flashbang: "Flashbang",
    };
    if (itemNames[itemId]) setEquippedItem(itemNames[itemId]);
  };

  const handleEnterBuilding = useCallback(
    (buildingType: string, outdoorPos: THREE.Vector3) => {
      outdoorPlayerPos.current.copy(outdoorPos);
      setCurrentBuildingType(buildingType);
      setIsInsideBuilding(true);
      handleInteract(`Entering ${buildingType}...`);
    },
    [handleInteract],
  );

  const handleExitBuilding = useCallback(() => {
    setIsInsideBuilding(false);
    setCurrentBuildingType(null);
    playerPosRef.current.copy(outdoorPlayerPos.current);
    handleInteract("Exited building");
  }, [handleInteract]);

  const handleArrestNPC = useCallback(() => {
    setArrestCount((c) => c + 1);
    handleInteract("Suspect arrested! Wanted level reduced.");
  }, [handleInteract]);

  const handleHealNPC = useCallback(() => {
    setRescueCount((c) => c + 1);
    handleInteract("Civilian healed! Mission progress updated.");
  }, [handleInteract]);

  const handlePickupItem = useCallback(
    (_itemId: string, _itemType: string, label: string) => {
      handleInteract(`Picked up: ${label}`);
    },
    [handleInteract],
  );

  const handlePatrolWaypoint = useCallback((_idx: number, _total: number) => {
    setPatrolProgress((p) => p + 1);
  }, []);

  const anyModalOpen = isPaused || showInventory || showJobBoard;

  const isPoliceJob = currentJob === GameJob.policeOfficer;
  const isSWATJob = currentJob === GameJob.swat;
  const isFirstResponder = currentJob === GameJob.firstResponder;
  const isParamedic = isFirstResponder; // firstResponder covers both paramedic and firefighter

  return (
    <GameErrorBoundary onExit={onExit}>
      <div
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/* 3D Canvas */}
        <KeyboardControls map={KEY_MAP}>
          <Canvas
            shadows
            camera={{ fov: 75, near: 0.1, far: 600, position: [0, 5, 10] }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              shadowMapType: THREE.PCFSoftShadowMap,
            }}
            style={{ width: "100vw", height: "100vh", display: "block" }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x111111);
            }}
          >
            <World
              playerPos={playerPosRef}
              wantedLevel={wantedLevel}
              violenceEnabled={violenceEnabled}
              onInteract={handleInteract}
              playerJob={currentJob ?? GameJob.unemployed}
              isInsideBuilding={isInsideBuilding}
              currentBuildingType={currentBuildingType}
              onEnterBuilding={handleEnterBuilding}
              onExitBuilding={handleExitBuilding}
              onPickupItem={handlePickupItem}
              onArrestNPC={handleArrestNPC}
              onHealNPC={handleHealNPC}
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
              isTouchDevice={isTouchDevice}
              joystick={joystick}
              touchActions={touchActions}
              cameraTouch={cameraTouch}
              onResetCameraDelta={resetCameraDelta}
            />
            {/* Patrol route rendered inside canvas for police job */}
            {isPoliceJob && !isInsideBuilding && (
              <PolicePatrolRoute
                playerPosition={playerPosRef}
                onWaypointReached={handlePatrolWaypoint}
              />
            )}
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

        {/* Career Mission Panels */}
        {!anyModalOpen && isPoliceJob && (
          <div
            className="fixed top-0 right-0 z-30 pointer-events-none"
            style={{ top: "60px" }}
          >
            <PoliceMissionPanel
              arrestCount={arrestCount}
              patrolProgress={patrolProgress}
              jobProgress={jobProgress ?? null}
              onMissionComplete={(type) =>
                handleInteract(`Mission complete: ${type}!`)
              }
            />
          </div>
        )}
        {!anyModalOpen && isSWATJob && (
          <div
            className="fixed top-0 right-0 z-30 pointer-events-none"
            style={{ top: "60px" }}
          >
            <SWATMissionPanel
              wantedLevel={wantedLevel}
              operationsCompleted={operationsCompleted}
              jobProgress={jobProgress ?? null}
              onMissionComplete={(type) =>
                handleInteract(`SWAT mission complete: ${type}!`)
              }
            />
          </div>
        )}
        {!anyModalOpen && isFirstResponder && (
          <div
            className="fixed top-0 right-0 z-30 pointer-events-none"
            style={{ top: "60px" }}
          >
            <FirstResponderMissionPanel
              role={isParamedic ? "paramedic" : "firefighter"}
              rescueCount={rescueCount}
              firesSuppressed={firesSuppressed}
              jobProgress={jobProgress ?? null}
              onMissionComplete={(type) =>
                handleInteract(`Mission complete: ${type}!`)
              }
            />
          </div>
        )}

        {/* Interaction Prompt */}
        <InteractionPrompt
          text={interactionText}
          visible={showInteraction && !anyModalOpen}
        />

        {/* Chat */}
        {!anyModalOpen && !isTouchDevice && <ChatUI enabled={chatEnabled} />}

        {/* Desktop top bar controls */}
        {!anyModalOpen && !isTouchDevice && (
          <div className="fixed top-3 right-3 z-30 flex gap-2">
            <button
              type="button"
              onClick={() =>
                setCameraMode((m) => (m === "first" ? "third" : "first"))
              }
              className="panel-glass rounded px-2 py-1 font-gaming text-xs text-neon-orange border border-neon-orange/30 hover:border-neon-orange/60"
            >
              {cameraMode === "first" ? "1ST" : "3RD"} PERSON [V]
            </button>
            <button
              type="button"
              onClick={() => setFlightEnabled((f) => !f)}
              className={`panel-glass rounded px-2 py-1 font-gaming text-xs border ${
                flightEnabled
                  ? "text-neon-yellow border-neon-yellow/50"
                  : "text-muted-foreground border-border"
              }`}
            >
              {flightEnabled ? "✈ FLIGHT ON" : "✈ FLIGHT [G]"}
            </button>
            <button
              type="button"
              onClick={() => setShowInventory(true)}
              className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
            >
              INVENTORY [I]
            </button>
            <button
              type="button"
              onClick={() => setShowJobBoard(true)}
              className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
            >
              JOBS [J]
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(true)}
              className="panel-glass rounded px-2 py-1 font-gaming text-xs text-muted-foreground border border-border hover:border-neon-orange/40"
            >
              MENU [ESC]
            </button>
          </div>
        )}

        {/* Virtual Joystick (touch only) */}
        {!anyModalOpen && (
          <VirtualJoystick
            onJoystickChange={setJoystick}
            visible={isTouchDevice && !anyModalOpen}
          />
        )}

        {/* Touch Action Buttons (touch only) */}
        {!anyModalOpen && (
          <TouchActionButtons
            visible={isTouchDevice && !anyModalOpen}
            onAction={setAction}
            onCameraToggle={() =>
              setCameraMode((m) => (m === "first" ? "third" : "first"))
            }
            onFlightToggle={() => setFlightEnabled((f) => !f)}
            onInventory={() => setShowInventory(true)}
            onPause={() => setIsPaused(true)}
          />
        )}

        {/* Modals */}
        {isPaused && (
          <PauseMenu onResume={() => setIsPaused(false)} onExit={onExit} />
        )}
        {showInventory && (
          <InventoryUI
            onClose={() => setShowInventory(false)}
            onEquip={handleEquip}
            flightEnabled={flightEnabled}
            onToggleFlight={() => setFlightEnabled((f) => !f)}
            currentJob={currentJob}
          />
        )}
        {showJobBoard && <JobBoard onClose={() => setShowJobBoard(false)} />}
      </div>
    </GameErrorBoundary>
  );
}
