import { AlertTriangle, CheckCircle, Crosshair, Zap } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { JobProgress, RoleSpecificStats } from "../backend";
import { useSetJobProgress } from "../hooks/useQueries";

interface SWATMission {
  id: string;
  title: string;
  description: string;
  type: "breach" | "neutralize" | "hostage" | "suppress";
  completed: boolean;
  progress?: number;
  total?: number;
}

interface SWATMissionPanelProps {
  wantedLevel: number;
  operationsCompleted: number;
  jobProgress: JobProgress | null;
  onMissionComplete?: (missionType: string) => void;
}

const SWAT_MISSIONS: SWATMission[] = [
  {
    id: "breach1",
    title: "Breach & Clear",
    description: "Enter and clear a high-threat building",
    type: "breach",
    completed: false,
  },
  {
    id: "neutralize1",
    title: "Neutralize Threat",
    description: "Neutralize 3 high-threat NPCs",
    type: "neutralize",
    completed: false,
    progress: 0,
    total: 3,
  },
  {
    id: "hostage1",
    title: "Extract Hostage",
    description: "Locate and extract the hostage to the safe zone",
    type: "hostage",
    completed: false,
  },
  {
    id: "suppress1",
    title: "Suppress Criminal Activity",
    description: "Reduce wanted level to 0 while on duty",
    type: "suppress",
    completed: false,
    progress: 0,
    total: 5,
  },
];

export default function SWATMissionPanel({
  wantedLevel,
  operationsCompleted,
  jobProgress,
  onMissionComplete,
}: SWATMissionPanelProps) {
  const [missions, setMissions] = useState<SWATMission[]>(SWAT_MISSIONS);
  const [expanded, setExpanded] = useState(true);
  const setJobProgressMutation = useSetJobProgress();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omitting stable refs to avoid infinite loops
  useEffect(() => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.type === "neutralize") {
          const done = operationsCompleted >= (m.total ?? 3);
          if (done && !m.completed) {
            onMissionComplete?.("neutralize");
            if (jobProgress) {
              const stats: RoleSpecificStats = {
                __kind__: "swat",
                swat: {
                  operationsCompleted: BigInt(operationsCompleted),
                  hostageRescues:
                    jobProgress.roleSpecificStats.__kind__ === "swat"
                      ? jobProgress.roleSpecificStats.swat.hostageRescues
                      : BigInt(0),
                },
              };
              setJobProgressMutation.mutate({
                successfulMissions: BigInt(
                  Number(jobProgress.successfulMissions) + 1,
                ),
                failedMissions: jobProgress.failedMissions,
                roleSpecificStats: stats,
              });
            }
          }
          return {
            ...m,
            progress: Math.min(operationsCompleted, m.total ?? 3),
            completed: done,
          };
        }
        if (m.type === "suppress") {
          const progress = Math.max(0, 5 - wantedLevel);
          const done = wantedLevel === 0;
          if (done && !m.completed) onMissionComplete?.("suppress");
          return { ...m, progress, completed: done };
        }
        return m;
      }),
    );
  }, [wantedLevel, operationsCompleted]);

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="w-72 pointer-events-auto">
      <div
        className="bg-gray-900/90 border border-red-500/50 rounded-lg overflow-hidden shadow-xl backdrop-blur-sm cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((prev) => !prev);
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-red-900/60">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-300" />
            <span className="text-red-100 font-bold text-sm">
              SWAT Operations
            </span>
          </div>
          <div className="flex items-center gap-2">
            {wantedLevel >= 4 && (
              <span className="text-red-400 text-xs animate-pulse font-bold">
                ⚠ REINFORCE
              </span>
            )}
            <span className="text-red-300 text-xs">
              {completedCount}/{missions.length}
            </span>
            <span className="text-red-300 text-xs">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>

        {expanded && (
          <div className="p-2 space-y-2">
            {wantedLevel >= 4 && (
              <div className="bg-red-900/60 border border-red-500/60 rounded p-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-200 text-xs font-bold">
                  SWAT Reinforcements Deployed! Level: {wantedLevel}
                </span>
              </div>
            )}
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`rounded p-2 border ${
                  mission.completed
                    ? "bg-green-900/40 border-green-500/40"
                    : "bg-gray-800/60 border-red-500/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  {mission.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold">
                      {mission.title}
                    </div>
                    <div className="text-gray-300 text-xs mt-0.5">
                      {mission.description}
                    </div>
                    {mission.total !== undefined && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                          <span>Progress</span>
                          <span>
                            {mission.progress ?? 0}/{mission.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/60 rounded-full h-1.5">
                          <div
                            className="bg-red-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${((mission.progress ?? 0) / mission.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
